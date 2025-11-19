import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { RaffleEntrySchema } from "@/shared/types";
import { google } from "googleapis";

// Define o tipo do nosso ambiente, incluindo os segredos para o Google Sheets
type Env = {
  DB: D1Database;
  GOOGLE_SHEETS_CLIENT_EMAIL: string;
  GOOGLE_SHEETS_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
};

const app = new Hono<{ Bindings: Env }>();

/**
 * Adiciona uma nova linha de dados a uma planilha do Google.
 * @param env - As variáveis de ambiente do worker.
 * @param values - Um array de valores (células) para adicionar na linha.
 */
async function appendToSheet(env: Env, values: (string | number)[]) {
  try {
    // Autentica com as credenciais da conta de serviço
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SHEETS_CLIENT_EMAIL,
        // A chave privada precisa ter os caracteres de nova linha restaurados
        private_key: env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = env.GOOGLE_SHEET_ID;
    const range = "A1"; // Adiciona na primeira linha vazia da primeira página

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
    console.log("Dados enviados para o Google Sheets com sucesso.");
  } catch (error) {
    console.error("Erro ao enviar dados para o Google Sheets:", error);
    // Não relançamos o erro para não impedir a resposta de sucesso ao usuário,
    // já que o dado principal foi salvo no banco de dados.
  }
}

app.post(
  "/api/raffle/register",
  zValidator("json", RaffleEntrySchema),
  async (c) => {
    const data = c.req.valid("json");

    // Formata os dados conforme solicitado
    const formattedData = {
      ...data,
      name: data.name.toUpperCase(),
      contact: data.contact.replace(/\D/g, ""), // Remove tudo que não for dígito
    };

    try {
      // 1. Salva no banco de dados
      const result = await c.env.DB.prepare(
        `INSERT INTO raffle_entries (name, email, contact, area_of_expertise, created_at, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`
      )
        .bind(
          formattedData.name,
          formattedData.email,
          formattedData.contact,
          formattedData.area_of_expertise
        )
        .run();

      // 2. Envia para o Google Sheets em segundo plano
      // Usamos waitUntil para não atrasar a resposta para o usuário
      c.executionCtx.waitUntil(
        appendToSheet(c.env, [
          new Date().toISOString(),
          formattedData.name,
          formattedData.email,
          formattedData.contact,
          formattedData.area_of_expertise,
        ])
      );

      return c.json({ success: true, id: result.meta.last_row_id });
    } catch (error) {
      console.error("Erro ao salvar inscrição no banco de dados:", error);
      return c.json({ success: false, error: "Erro ao salvar inscrição" }, 500);
    }
  }
);

export default app;
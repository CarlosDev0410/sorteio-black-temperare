import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { RaffleEntrySchema } from "@/shared/types";
import { SignJWT } from "jose";

type Env = {
  DB: D1Database;
  GOOGLE_SHEETS_CLIENT_EMAIL: string;
  GOOGLE_SHEETS_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
};

const app = new Hono<{ Bindings: Env }>();

/**
 * Converte uma chave privada PEM (string) para um objeto CryptoKey.
 */
async function importPrivateKey(pem: string) {
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = pem.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "");
  const binaryDer = new Uint8Array(atob(pemContents).split("").map(c => c.charCodeAt(0)));

  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["sign"]
  );
}

/**
 * Gera um token de acesso do Google usando as credenciais da conta de serviço.
 */
async function getGoogleAccessToken(env: Env) {
  const privateKeyPem = env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n");
  const privateKey = await importPrivateKey(privateKeyPem);

  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(env.GOOGLE_SHEETS_CLIENT_EMAIL)
    .setAudience("https://oauth2.googleapis.com/token")
    .setExpirationTime("1h")
    .setSubject(env.GOOGLE_SHEETS_CLIENT_EMAIL)
    .setPayload({ scope: "https://www.googleapis.com/auth/spreadsheets" })
    .sign(privateKey);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokens = await response.json<{ access_token: string }>();
  return tokens.access_token;
}

/**
 * Adiciona uma nova linha de dados a uma planilha do Google.
 */
async function appendToSheet(env: Env, values: (string | number)[]) {
  try {
    const accessToken = await getGoogleAccessToken(env);
    const sheetName = "Sheet1"; // Nome padrão da aba
    const range = `${sheetName}!A1`;

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          values: [values],
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Erro na API do Google Sheets:", response.status, errorBody);
    } else {
      console.log("Dados enviados para o Google Sheets com sucesso.");
    }
  } catch (error) {
    console.error("Erro ao enviar dados para o Google Sheets:", JSON.stringify(error, null, 2));
  }
}

app.post(
  "/api/raffle/register",
  zValidator("json", RaffleEntrySchema),
  async (c) => {
    const data = c.req.valid("json");

    const formattedData = {
      ...data,
      name: data.name.toUpperCase(),
      contact: data.contact.replace(/\D/g, ""),
    };

    try {
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
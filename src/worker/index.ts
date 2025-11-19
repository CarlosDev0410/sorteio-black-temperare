import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { RaffleEntrySchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

app.post("/api/raffle/register", zValidator("json", RaffleEntrySchema), async (c) => {
  const data = c.req.valid("json");

  try {
    const result = await c.env.DB.prepare(
      `INSERT INTO raffle_entries (name, email, contact, area_of_expertise, created_at, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`
    )
      .bind(data.name, data.email, data.contact, data.area_of_expertise)
      .run();

    return c.json({ success: true, id: result.meta.last_row_id });
  } catch (error) {
    console.error("Error saving raffle entry:", error);
    return c.json({ success: false, error: "Erro ao salvar inscrição" }, 500);
  }
});

export default app;

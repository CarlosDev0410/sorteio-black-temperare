import z from "zod";

export const RaffleEntrySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  contact: z.string().min(10, "Contato deve ter no mínimo 10 caracteres"),
  area_of_expertise: z.string().min(1, "Área de atuação é obrigatória"),
});

export type RaffleEntry = z.infer<typeof RaffleEntrySchema>;

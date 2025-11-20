import z from "zod";

export const RaffleEntrySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  contact: z.string().min(10, "Número de telefone inválido"),
  area_of_expertise: z.string().min(1, "Área de atuação é obrigatória"),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
  is_client: z.string().optional(),
  how_they_found_us: z.string().optional(),
  feedback: z.string().optional(),
  raffle_number: z.number().optional(),
});

export type RaffleEntry = z.infer<typeof RaffleEntrySchema>;
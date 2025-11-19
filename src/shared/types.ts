import z from "zod";

export const EmailSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export const RaffleEntryDetailsSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  contact: z.string().min(10, "Contato deve ter no mínimo 10 caracteres"),
  area_of_expertise: z.string().min(1, "Área de atuação é obrigatória"),
});

export type RaffleEntryDetails = z.infer<typeof RaffleEntryDetailsSchema>;
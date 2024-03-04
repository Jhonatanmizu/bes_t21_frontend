import z from "zod";

export const courseSessionSchema = z.object({
  remotePath: z.string().default(""),
  img: z.any(),
  title: z.coerce
    .string({
      required_error: "É necessário definir um título!",
    })
    .min(1, "O título deve ter no mínimo 1 caractere")
    .trim(),
  description: z.coerce
    .string()
    .min(5, "A descrição deve ter no mínimo 5 caracteres!")
    .trim(),
  startAt: z.coerce.string().trim(),
  endAt: z.coerce.string().trim(),
});

export type courseSessionData = z.infer<typeof courseSessionSchema>;

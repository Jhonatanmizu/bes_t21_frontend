import z from "zod";

export const answerSchema = z.object({
  img: z.any(),
  title: z.coerce
    .string({
      required_error: "É necessário definir um título!",
    })
    .min(1, "O título deve ter no mínimo 1 caracteres")
    .trim(),
  description: z.coerce
    .string()
    .min(5, "A descrição deve ter no mínimo 5 caracteres!")
    .trim(),
});

export type answerData = z.infer<typeof answerSchema>;

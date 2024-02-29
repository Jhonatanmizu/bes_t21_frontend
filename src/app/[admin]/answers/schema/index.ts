"use client";
import z from "zod";

export const answerSchema = z.object({
  imageUrl: z.any(),
  title: z.coerce
    .string({
      required_error: "É necessário definir um título!",
    })
    .min(5, "O título deve ter no mínimo 5 caracteres")
    .trim(),
  description: z.coerce
    .string()
    .min(5, "A descrição deve ter no mínimo 5 caracteres!")
    .trim(),
});

export type AnswerData = z.infer<typeof answerSchema>;

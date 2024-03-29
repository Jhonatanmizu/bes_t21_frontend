"use client";
import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createLevelSchema = z.object({
  title: z.coerce
    .string({
      required_error: "É necessário informar o nome do ranking",
    })
    .min(4, "O nome do ranking deve ter no mínimo 4 caracteres")
    .trim(),
  description: z.coerce.string().trim(),
  numberOfStars: z.coerce
    .number({
      required_error: "É necessário informar o número de estrelas",
    })
    .min(1, "Deve ser entre 1 e 5")
    .max(5, "Deve ser entre 1 e 5"),
  startIn: z.coerce.number({
    required_error: "É necessário informar o intervalo de ínicio!",
  }),
  img: z.any(),
  remotePath: z.string().default(""),
});

export type createLevelData = z.infer<typeof createLevelSchema>;

export const updateLevelSchema = z.object({
  title: z.coerce
    .string({
      required_error: "É necessário informar o nome do ranking",
    })
    .min(4, "O nome do ranking deve ter no mínimo 4 caracteres"),
  description: z.coerce.string().trim(),
  numberOfStars: z.coerce
    .number({
      required_error: "É necessário informar o número de estrelas",
    })
    .min(1, "Deve ser entre 1 e 5")
    .max(5, "Deve ser entre 1 e 5"),
  startIn: z.coerce.number({
    required_error: "É necessário informar o intervalo de ínicio!",
  }),
  img: z.any(),
  remotePath: z.string().default(""),
});

export type updateLevelData = z.infer<typeof updateLevelSchema>;

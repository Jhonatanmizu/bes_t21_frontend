import { z } from "zod";
import { QuestionLevel, QuestionType } from "@/app/common/enums";

export const questionSchema = z.object({
  uid: z.string().nullable().default(null),
  img: z.string().nullable().default(null),
  description: z
    .string({ required_error: "Descrição é obrigatória" })
    .min(1, "Descrição é obrigatória"),
  level: z.enum(
    [QuestionLevel.EASY, QuestionLevel.MEDIUM, QuestionLevel.HARD],
    { required_error: "É necessário informar o nível da questão" }
  ),
  type: z.enum(
    [
      QuestionType.INPUT,
      QuestionType.MULTIPLE,
      QuestionType.VOICE,
      QuestionType.SELECT,
    ],
    {
      required_error: "É necessário informar o tipo da questão",
      invalid_type_error: "Você deve selecionar o tipo da questão",
    }
  ),
});

export type questionData = z.infer<typeof questionSchema>;

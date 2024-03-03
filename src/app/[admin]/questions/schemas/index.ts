import z from "zod";
// Types
import { QuestionLevel, QuestionType } from "@/app/common/enums";

export const questionSchema = z.object({
  uid: z.coerce.string().nullable().default(null),
  img: z.coerce.string().nullable().default(null),
  description: z.coerce.string({ required_error: "Descrição é obrigatória" }),
  level: z.enum(
    [QuestionLevel.EASY, QuestionLevel.MEDIUM, QuestionLevel.HARD],
    { required_error: "É necessário informar o nível da questão" }
  ),
  type: z.enum(
    [QuestionType.INPUT, QuestionType.MULTIPLE, QuestionType.VOICE],
    { required_error: "É necessário informar o tipo da questão" }
  ),
  point: z.number().min(1, "A pontuação deve ser maior que zero"),
  correctAnswers: z
    .array(z.string())
    .min(1, "Deve haver ao menos uma questão correta"),
});

export type questionData = z.infer<typeof questionSchema>;

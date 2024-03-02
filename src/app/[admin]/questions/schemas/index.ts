import z from "zod";
// Types
import { QuestionLevel, QuestionType } from "@/app/common/enums";

const questionSchema = z.object({
  uid: z.coerce.string(),
  description: z.coerce.string(),
  level: z.enum([QuestionLevel.EASY, QuestionLevel.MEDIUM, QuestionLevel.HARD]),
  type: z.enum([QuestionType.INPUT, QuestionType.MULTIPLE, QuestionType.VOICE]),
  point: z.number(),
  correctAnswers: z.array(z.string()),
});

export type questionData = z.infer<typeof questionSchema>;

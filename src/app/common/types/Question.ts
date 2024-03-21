import { QuestionLevel, QuestionType } from "../enums";

export interface IQuestion {
  uid: string | null;
  img: string | null;
  description: string;
  level: QuestionLevel;
  type: QuestionType;
  point: number;
  correctAnswers: string | string[];
  wrongAnswers: string | string[];
}

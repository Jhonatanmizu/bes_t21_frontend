import { QuestionLevel, QuestionType } from "../enums";

export interface IQuestion {
  uid: string;
  description: string;
  level: QuestionLevel;
  type: QuestionType;
  point: number;
  correctAnswers: string[];
}

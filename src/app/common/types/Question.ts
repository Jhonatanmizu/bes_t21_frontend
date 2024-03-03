import { QuestionLevel, QuestionType } from "../enums";

export interface IQuestion {
  uid: string;
  img: string;
  description: string;
  level: QuestionLevel;
  type: QuestionType;
  point: number;
  correctAnswers: string[];
}

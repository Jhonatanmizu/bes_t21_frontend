export enum QuestionLevel {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum QuestionType {
  MULTIPLE = "MULTIPLE",
  INPUT = "INPUT",
  VOICE = "VOICE",
  SELECT = "SELECT",
}

export const questionLevelStringRepresentation: Record<string, QuestionLevel> =
  {
    Fácil: QuestionLevel.EASY,
    Média: QuestionLevel.MEDIUM,
    Difícil: QuestionLevel.HARD,
  };

export const questionTypeStringRepresentation: Record<string, QuestionType> = {
  Múltipla: QuestionType.MULTIPLE,
  Resposta: QuestionType.INPUT,
  Voz: QuestionType.VOICE,
  Selecionar: QuestionType.SELECT,
};

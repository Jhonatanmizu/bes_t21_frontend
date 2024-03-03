export interface CreateAnswerDTO {
  imageUrl?: string;
  title: string;
  description: string;
}

export interface UpdateAnswerDto {
  uid: string;
  imageUrl?: string;
  title: string;
  description: string;
}

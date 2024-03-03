export interface CreateAnswerDTO {
  img?: string;
  title: string;
  description: string;
  remotePath: string;
}

export interface UpdateAnswerDto {
  uid: string;
  img?: string;
  title: string;
  description: string;
  remotePath: string;
}

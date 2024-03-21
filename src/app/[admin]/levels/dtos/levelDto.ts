export interface CreateLevelDTO {
  img: string;
  title: string;
  description: string;
  startIn: number;
  numberOfStars: number;
  remotePath: string;
}

export interface UpdateLevelDto {
  uid: string;
  img: string;
  title: string;
  description: string;
  startIn: number;
  numberOfStars: number;
  remotePath: string;
}

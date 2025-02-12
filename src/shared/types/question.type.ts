export type Question = {
  _id: string;
  question: string;
  choices: string[];
  answer: string;
  endUserId: string;
  createdAt: Date;
  updatedAt: Date;
  isAnswered: boolean;
  myAnswer?: string;
};

export type ChoiceStat = {
  questionId: string;
  choice: string;
  count: number;
};

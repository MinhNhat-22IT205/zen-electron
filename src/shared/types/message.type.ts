type Message = {
  _id: string;
  endUserId: string;
  conversationId: string;
  content: string;
  visibility: "retrieve" | "delete" | "normal";
  createdAt: Date;
};
export { Message };

import { EndUserMinimal } from "./enduser.type";

type Message = {
  _id: string;
  endUserId: EndUserMinimal;
  conversationId: string;
  content: string;
  visibility: "retrieve" | "delete" | "normal";
  read: boolean;
  createdAt: Date;
  type: "text" | "file";
};
type LivestreamMessage = {
  endUser: EndUserMinimal;
  message: string;
  liveStreamId: string;
  createdAt: Date;
};
export { Message, LivestreamMessage };

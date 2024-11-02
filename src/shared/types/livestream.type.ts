import { EndUserMinimal } from "./enduser.type";

export enum LiveStreamStatus {
  ACTIVE = "active",
  ENDED = "ended",
}
export type Livestream = {
  _id: string;

  title: string;

  description: string;

  endUserId: string;

  status: LiveStreamStatus;

  viewers: string[];

  createdAt: Date;

  updatedAt: Date;
};

export type PopulatedLivestream = Livestream & {
  endUser: EndUserMinimal;
};

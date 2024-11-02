import { Livestream } from "@/src/shared/types/livestream.type";
import { LIVESTREAM_API_ENDPOINT } from "./livestream-endpoint.api";
import http from "@/src/shared/libs/axios/axios.base";
import { ztAddLivestreamInputs } from "../libs/add-livestream.zod";

export const createLivestream = async (
  data: ztAddLivestreamInputs,
): Promise<Livestream> => {
  try {
    const response = await http.post(LIVESTREAM_API_ENDPOINT, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

import http from "@/src/shared/libs/axios/axios.base";
import { EndUser } from "@/src/shared/types/enduser.type";

export const addStar = async (
  star: number,
  endUser: EndUser,
  setEndUser: (endUser: EndUser) => void,
) => {
  const response = await http.patch(`/endusers/add-star`, {
    star: star,
  });
  setEndUser({ ...endUser, star: endUser.star + star });

  return response.data;
};

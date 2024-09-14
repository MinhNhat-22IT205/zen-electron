import http from "../axios/axios.base";

export const fetcher = (url: string) =>
  http.get(url).then((res: { data: any }) => {
    return res.data;
  });

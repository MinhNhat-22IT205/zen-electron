/**DECEPERATED**/
// import http from "@/src/shared/libs/axios/axios.base";
// import { Message } from "@/src/shared/types/message.type";
// import { useEffect, useState } from "react";
// import { MESSAGE_API_ENDPOINT } from "../api/chat-endpoints.api";
// import { AxiosResponse } from "axios";

// const MESSAGE_PER_FETCH = 15;

// export default function useFetchMessages(conversationId: string) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [fetch, setFetch] = useState(false);
//   const [isReachEnd, setIsReachEnd] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [{ limit, skip }, setFetchParams] = useState({
//     limit: MESSAGE_PER_FETCH,
//     skip: 0
//   });
//   const updateFetchParams = (newLimit: number, newSkip: number) => {
//     setFetchParams({ limit: newLimit, skip: newSkip });
//   };

//   useEffect(() => {
//     (async () => {
//       setIsLoading(true);
//       let result: AxiosResponse<Message[], any>;
//       try {
//         result = await http.get<Message[]>(
//           MESSAGE_API_ENDPOINT +
//             `?limit=${limit}&skip=${skip}&conversationId=${conversationId}`
//         );
//       } catch (er) {
//         console.log(er);
//       }

//       if (result.data.length === 0) {
//         console.log("reach end");
//         setIsReachEnd(true);
//         setIsLoading(false);
//         return;
//       }
//       setMessages((prev) => [...result.data, ...prev]);
//       setIsLoading(false);
//     })();
//   }, [fetch]);

//   const fetchMoreMessages = () => {
//     if (isLoading || isReachEnd) return;
//     updateFetchParams(messages.length + MESSAGE_PER_FETCH, messages.length);
//     setFetch(!fetch);
//   };
//   const addMessage = (message: Message) => {
//     setMessages((prev) => [...prev, message]);
//   };

//   return {
//     isLoading,
//     messages,
//     fetchMoreMessages,
//     addMessage,
//     isReachEnd
//   };
// }
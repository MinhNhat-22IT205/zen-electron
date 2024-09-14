import http from "@/src/shared/libs/axios/axios.base";
import { CONVERSTAION_API_ENDPOINT } from "./conversation-endpoints.api";
import { Conversation } from "@/src/shared/types/conversation.type";
import { ServerError } from "@/src/shared/types/error.type";

const addConversation = async (endUserIds:String[]):Promise<ServerError | Conversation> => {
    try {
        const response = await http.post<Conversation>(CONVERSTAION_API_ENDPOINT, {userIds:endUserIds});
        return response.data ;
    }catch (error) {
        console.log(error)
        return error.response.data;
    }
};

export { addConversation };
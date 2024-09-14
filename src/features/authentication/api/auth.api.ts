import http from "@/src/shared/libs/axios/axios.base";
import { EndUser } from "@/src/shared/types/enduser.type";
import { ztLoginInputs } from "../libs/zod/login.zod";
import { LOGIN_API_ENDPOINT, REGISTER_API_ENDPOINT } from "./auth-endpoints.api";
import { ztRegisterInputs } from "../libs/zod/register.zod";

 type ServerError={
    message:string;
    statusCode:number;
    error:string
}

const login=async(values: ztLoginInputs):Promise<EndUser|ServerError> =>{
    try {
        const result = await http.patch<EndUser>(
            LOGIN_API_ENDPOINT,
            values
        );
        return result.data;
    }
    catch (error) {
        return error.response.data
    }
}

const register=async(values: ztRegisterInputs):Promise<EndUser|ServerError> =>{
    try {
        const result = await http.post<EndUser>(
            REGISTER_API_ENDPOINT,
            values
        );
        return result.data;
    }
    catch (error) {
        return error.response.data
    }
}
export { login,register, ServerError };
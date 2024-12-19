import http from "@/src/shared/libs/axios/axios.base";
import { EndUser } from "@/src/shared/types/enduser.type";
import { ztLoginInputs } from "../libs/zod/login.zod";
import {
  CHECK_ACCOUNT_API_ENDPOINT,
  CHECK_OTP_API_ENDPOINT,
  DISABLE_OTP_API_ENDPOINT,
  GENERATE_QR_API_ENDPOINT,
  LOGIN_API_ENDPOINT,
  REGISTER_API_ENDPOINT,
  VERIFY_OTP_API_ENDPOINT,
} from "./auth-endpoints.api";
import { ztRegisterInputs } from "../libs/zod/register.zod";
import { ServerError } from "@/src/shared/types/error.type";

const checkAccount = async (
  email: string,
  password: string,
): Promise<EndUser> => {
  try {
    const result = await http.post<EndUser>(CHECK_ACCOUNT_API_ENDPOINT, {
      email,
      password,
    });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

const login = async (values: ztLoginInputs): Promise<EndUser | ServerError> => {
  try {
    console.log(values);
    const result = await http.patch<EndUser>(LOGIN_API_ENDPOINT, values);
    return result.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

const checkOtp = async (otp: string): Promise<{ isVerified: boolean }> => {
  try {
    const result = await http.patch<{ isVerified: boolean }>(
      CHECK_OTP_API_ENDPOINT,
      { otp },
    );
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

const register = async (
  values: ztRegisterInputs,
): Promise<EndUser | ServerError> => {
  try {
    const result = await http.post<EndUser>(REGISTER_API_ENDPOINT, values);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

const generateQr = async (): Promise<{ qrUrl: string }> => {
  try {
    const result = await http.get<{ qrUrl: string }>(GENERATE_QR_API_ENDPOINT);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

const disableOtp = async (email: string, otp: string): Promise<EndUser> => {
  try {
    const result = await http.patch<EndUser>(DISABLE_OTP_API_ENDPOINT, {
      email,
      otp,
    });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

const verifyOtpToEnable2fa = async (
  otp: string,
  email: string,
): Promise<EndUser> => {
  try {
    const result = await http.patch<EndUser>(VERIFY_OTP_API_ENDPOINT, {
      otp,
      email,
    });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

const getEndUser = async (endUserId: string): Promise<EndUser> => {
  try {
    const result = await http.get<EndUser>(`/endusers/${endUserId}`);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

export {
  checkAccount,
  login,
  register,
  generateQr,
  verifyOtpToEnable2fa,
  checkOtp,
  disableOtp,
  getEndUser,
};

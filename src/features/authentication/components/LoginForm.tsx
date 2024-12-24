import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zLoginInputs, ztLoginInputs } from "../libs/zod/login.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/shared/components/shadcn-ui/form";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";
import { useToast } from "@/src/shared/hooks/use-toast";
import { checkAccount, checkOtp, login } from "../api/auth.api";
import { EndUser } from "@/src/shared/types/enduser.type";
import { ServerError } from "@/src/shared/types/error.type";
import { Conversation } from "@/src/shared/types/conversation.type";
import { CONVERSTAION_API_ENDPOINT } from "../../chat/api/chat-endpoints.api";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import useSWR from "swr";
import OtpModal from "./otpModal";

const LoginForm = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore((state) => state);
  const { toast } = useToast();
  const [otpModal, setOtpModal] = useState<boolean>(false);
  const [runOnSubmit, setRunOnSubmit] = useState<boolean>(false);
  const [userTemp, setUserTemp] = useState<EndUser | null>(null);
  const [otp, setOtp] = useState<string>("");
  const form = useForm<ztLoginInputs>({
    resolver: zodResolver(zLoginInputs),
    defaultValues: {
      email: "randomEmail@gmail.com",
      password: "Password@123",
    },
  });

  const onCheck = async (values: ztLoginInputs) => {
    const result = await checkAccount(values.email, values.password);
    if ("error" in result) {
      const serverError = result as unknown as ServerError;
      toast({
        title: "Login failed!",
        description: serverError.message,
        variant: "destructive",
      });
      return;
    }
    setUserTemp({ ...result, password: values.password });
    if (result.otpEnabled) {
      setOtpModal(true);
    } else {
      setRunOnSubmit(true);
    }
  };
  useEffect(() => {
    if (runOnSubmit) {
      onSubmit();
      setRunOnSubmit(false);
    }
  }, [runOnSubmit]);
  const onSubmit = async () => {
    const otpChecker = await checkOtp(otp);
    if (!otpChecker.isVerified && userTemp?.otpEnabled) {
      toast({
        title: "Invalid OTP!",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }
    console.log(otpChecker);
    const result = await login({
      email: userTemp?.email,
      password: userTemp?.password,
    });
    if ("error" in result) {
      const serverError = result as unknown as ServerError;
      toast({
        title: "Login failed!",
        description: serverError.message,
        variant: "destructive",
      });
      return;
    }
    const endUser = result as unknown as EndUser;
    authStore.setEndUser(endUser);
    toast({
      title: "Login successfully!",
      description: "Redirecting to Conversations...",
    });
    navigate("/conversations");
  };
  return (
    <div className="w-[45rem] bg-white/90 backdrop-blur-sm flex flex-col p-8 rounded-2xl shadow-lg gap-6 border border-amber-100">
      <div className="space-y-2">
        <h1 className="font-bold text-4xl bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
          Welcome Back!
        </h1>
        <p className="text-amber-600/80">Sign in to continue your journey</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onCheck)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-left text-sm font-medium text-amber-700">
                Email
              </h2>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="border-amber-200 focus:border-amber-400 h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-left text-sm font-medium text-amber-700">
                Password
              </h2>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="border-amber-200 focus:border-amber-400 h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white h-11 rounded-lg font-medium transition-all duration-200"
              type="submit"
            >
              Sign In
            </Button>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-500">Don't have an account?</span>
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/auth/register")}
                className="text-amber-600 hover:text-amber-700 p-0 h-auto font-medium"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <OtpModal
        open={otpModal}
        setOpen={setOtpModal}
        setOtp={setOtp}
        onSubmit={onSubmit}
        otp={otp}
      />
    </div>
  );
};

export default LoginForm;

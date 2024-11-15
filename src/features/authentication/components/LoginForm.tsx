import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import React from "react";
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
import { login } from "../api/auth.api";
import { EndUser } from "@/src/shared/types/enduser.type";
import { ServerError } from "@/src/shared/types/error.type";
import { Conversation } from "@/src/shared/types/conversation.type";
import { CONVERSTAION_API_ENDPOINT } from "../../chat/api/chat-endpoints.api";
import { fetcher } from "@/src/shared/libs/swr/fetcher";
import useSWR from "swr";
import { session } from "electron";

const LoginForm = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore((state) => state);
  const myEndUserId = useAuthStore((state) => state.endUser?._id);
  console.log("userId", myEndUserId);
  const { toast } = useToast();
  const form = useForm<ztLoginInputs>({
    resolver: zodResolver(zLoginInputs),
    defaultValues: {
      email: "hoanghieufro@gmail.com",
      password: "Password@123",
    },
  });

  const {
    data: conversations,
    isLoading,
    error,
    mutate,
  } = useSWR<Conversation[]>(
    CONVERSTAION_API_ENDPOINT + "?limit=1000&skip=0",
    fetcher,
    // { refreshInterval: 1000 },
  );

  const onSubmit = async (values: ztLoginInputs) => {
    console.log("HELLO WORLD");
    const result = await login(values);
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
    const hasLoadedConversations = !isLoading;
    console.log(conversations);
    if (conversations?.length > 0) {
      navigate("/conversations/" + conversations[0]._id);
    } else {
      navigate("/conversations");
    }
  };

  return (
    <div className="w-[45rem] bg-gray-50 flex flex-col text-center p-4 rounded-lg shadow-md gap-4">
      <h1 className="font-bold text-3xl">Welcome Back!</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h1 className="text-left">Email:</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <h1 className="text-left">Password:</h1>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button className="w-full" variant={"default"} type="submit">
              Submit
            </Button>
            <Button
              type="button"
              variant={"link"}
              onClick={() => navigate("/auth/register")}
            >
              Sign Up
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;

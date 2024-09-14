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

const LoginForm = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore((state) => state);
  const { toast } = useToast();
  const form = useForm<ztLoginInputs>({
    resolver: zodResolver(zLoginInputs),
    defaultValues: {
      email: "nhatminhledao2004@gmail.com",
      password: "Password@123",
    },
  });

  const onSubmit = async (values: ztLoginInputs) => {
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
      description: "Redirecting to popular page...",
    });
    navigate("/feeds");
  };

  return (
    <div className="w-[300px] bg-gray-50 flex flex-col text-center p-4 rounded-lg shadow-md gap-4">
      <h1 className="font-bold text-2xl">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" variant={"default"} type="submit">
            Submit
          </Button>
        </form>
      </Form>
      <Button variant={"link"} onClick={() => navigate("/auth/register")}>
        Sign Up
      </Button>
    </div>
  );
};

export default LoginForm;

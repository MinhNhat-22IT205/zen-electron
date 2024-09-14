import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import React from "react";
import { useNavigate } from "react-router-dom";
import { zRegisterInputs, ztRegisterInputs } from "../libs/zod/register.zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/shared/components/shadcn-ui/form";
import { toast } from "@/src/shared/hooks/use-toast";
import { register, ServerError } from "../api/auth.api";

const RegisterForm = () => {
  const navigate = useNavigate();
  const form = useForm<ztRegisterInputs>({
    resolver: zodResolver(zRegisterInputs),
    defaultValues: {
      email: "nhatminhledao2004@gmail.com",
      password: "Password@123",
      username: "moromoro",
      confirmPassword: "Password@123",
      gender: "male",
    },
  });

  const onSubmit = async (values: ztRegisterInputs) => {
    const result = await register(values);
    if ("error" in result) {
      const serverError = result as unknown as ServerError;
      toast({
        title: "Signup failed!",
        description: serverError.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Account created successfully!",
      description: "Please login to continue...",
    });
    navigate("/auth/login");
  };

  return (
    <div className="w-[300px] bg-gray-50 flex flex-col text-center p-4 rounded-lg shadow-md gap-4">
      <h1 className="font-bold text-2xl">Register</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Confirm password" {...field} />
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
      <Button variant={"link"} onClick={() => navigate("/auth/login")}>
        Login
      </Button>
    </div>
  );
};

export default RegisterForm;

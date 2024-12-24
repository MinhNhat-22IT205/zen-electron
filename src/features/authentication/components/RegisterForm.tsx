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
import { register } from "../api/auth.api";
import { ServerError } from "@/src/shared/types/error.type";

const RegisterForm = () => {
  const navigate = useNavigate();
  const form = useForm<ztRegisterInputs>({
    resolver: zodResolver(zRegisterInputs),
    defaultValues: {
      email: "randomEmail@gmail.com",
      password: "Password@123",
      username: "randomName",
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
    <div className="w-[45rem] bg-white/90 backdrop-blur-sm flex flex-col p-8 rounded-2xl shadow-lg gap-6 border border-amber-100">
      <div className="space-y-2">
        <h1 className="font-bold text-4xl bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
          Join the Conversation
        </h1>
        <p className="text-amber-600/80">Create your account to get started</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-left text-sm font-medium text-amber-700">
                Username
              </h2>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Choose a username"
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
                        placeholder="Create a password"
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
                Confirm Password
              </h2>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
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
              Create Account
            </Button>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-500">Already have an account?</span>
              <Button
                variant="link"
                onClick={() => navigate("/auth/login")}
                className="text-amber-600 hover:text-amber-700 p-0 h-auto font-medium"
              >
                Sign In
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;

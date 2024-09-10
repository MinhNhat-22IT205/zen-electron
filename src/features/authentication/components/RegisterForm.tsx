import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[300px] bg-gray-50 flex flex-col text-center p-4 rounded-lg shadow-md gap-4">
      <h1 className="font-bold text-2xl">Register</h1>
      <Input placeholder="Username" />
      <Input placeholder="Password" />
      <Button variant={"default"}>Submit</Button>
      <Button variant={"link"} onClick={() => navigate("/auth/login")}>
        Sign In
      </Button>
    </div>
  );
};

export default RegisterForm;

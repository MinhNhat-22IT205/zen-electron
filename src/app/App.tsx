import { Button } from "../shared/components/shadcn-ui/button";
import React from "react";
import AppRoutes from "./AppRoutes";
import { Toaster } from "../shared/components/shadcn-ui/toaster";

const App = () => {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
};

export default App;

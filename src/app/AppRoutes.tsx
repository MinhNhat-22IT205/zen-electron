import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";

const AppRoutes = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<h1>asd</h1>} />
            <Route path="/explore" element={<h1>explore</h1>} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
};

export default AppRoutes;

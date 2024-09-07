import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import FeedPage from "../features/feed/components/FeedPage";
import FeedPageLayout from "../features/feed/components/FeedPageLayout";

const AppRoutes = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<h1>asd</h1>} />
            <Route path="/feeds" element={<FeedPageLayout />}>
              <Route index element={<FeedPage />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
};

export default AppRoutes;

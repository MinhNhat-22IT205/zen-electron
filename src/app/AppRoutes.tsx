import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import FeedPage from "../features/feed/components/FeedPage";
import FeedPageLayout from "../features/feed/components/FeedPageLayout";
import ChatPage from "../features/chat/components/ChatPage";
import ChatRoom from "../features/chat/components/room/ChatRoom";

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
          <Route path="/chats" element={<ChatPage />}>
            <Route path=":id" element={<ChatRoom />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
};

export default AppRoutes;

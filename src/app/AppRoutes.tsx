import React from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import FeedPage from "../features/newsfeed/components/FeedPage";
import FeedPageLayout from "../features/newsfeed/components/FeedPageLayout";
import ChatPage from "../features/chat/components/ChatPage";
import ChatRoom from "../features/chat/components/chat-room/ChatRoom";
import LoginForm from "../features/authentication/components/LoginForm";
import RegisterForm from "../features/authentication/components/RegisterForm";
import AuthLayout from "../features/authentication/components/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import SearchPage from "../features/search/components/SearchPage";
import CreateConversation from "../features/chat/components/conversation/CreateConversation";
import CallRoom from "../features/chat/components/call/CallRoom";
import UserProfilePage from "../features/user-profile/components/UserProfilePage";
import LivestreamRoom from "../features/livestream/components/stream/LivestreamRoom";
import LivestreamList from "../features/livestream/components/LivestreamList";
import AddLivestreamButton from "../features/livestream/components/add-livestream/AddLivestreamButton";
import PostIdPage from "../features/post/components/post-id/PostIdPage";
import GroupPage from "../features/group/components/GroupPage";
import GroupIdPage from "../features/group/components/GroupIdPage";
import JoinGroupRequestList from "../features/group/components/group-request/JoinGroupRequestList";
const AppRoutes = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          {/* Auth page */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="/auth/login" />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>

          {/* Home page */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/feeds" />} />
            <Route
              path="feeds"
              element={
                <FeedPageLayout
                  livestreamListComponent={<LivestreamList />}
                  addLivestreamButtonComponent={<AddLivestreamButton />}
                />
              }
            >
              <Route index element={<FeedPage />} />
              <Route path=":id" element={<PostIdPage />} />
            </Route>
            <Route path="groups" element={<GroupPage />} />
            <Route path="groups/:id" element={<GroupIdPage />} />
            <Route
              path="groups/:id/requests"
              element={<JoinGroupRequestList />}
            />
            <Route path="search" element={<SearchPage />} />
            <Route path="user-profile/:id" element={<UserProfilePage />} />
          </Route>

          {/* Chat page */}
          <Route
            path="/conversations"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          >
            <Route
              path="create-conversation"
              element={<CreateConversation />}
            />
            <Route path=":id" element={<ChatRoom />} />
          </Route>

          {/* Call room */}
          <Route path="/call-room" element={<CallRoom />} />

          {/* Livestream room */}
          <Route path="/livestream/:id" element={<LivestreamRoom />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default AppRoutes;

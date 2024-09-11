import { Button } from "../../../shared/components/shadcn-ui/button";
import { ArrowLeftIcon, TriangleLeftIcon } from "@radix-ui/react-icons";
import { Outlet, useNavigate } from "react-router-dom";
import ConversationList from "./conversation/ConversationList";

const ChatPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full flex flex-col ">
      <div className="border-b border-gray-200">
        <Button variant="link" onClick={() => navigate(-1)}>
          <TriangleLeftIcon className="w-4 h-4" /> Back
        </Button>
      </div>
      <div className="flex w-full h-full flex-1">
        <div className="w-64 h-full bg-white border border-gray-200">
          <ConversationList />
        </div>
        <div className="h-full w-full">
          {/* ChatRoom */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

"use client";
import { notFound, useSearchParams } from "next/navigation";
import Chat from "./chat";
import ChatInput from "./chatinput";
import { useSession } from "@/lib/auth-client";

const ChatInterface = () => {
  const session = useSession();
  const params = useSearchParams();
  console.log("params", params);
  const chatId = params.get("id") || "";

  if (!session || !session.data?.user) {
    return notFound();
  }
  return (
    <>
      <Chat chatId={chatId} />
      <ChatInput chatId={chatId} />
    </>
  );
};

export default ChatInterface;

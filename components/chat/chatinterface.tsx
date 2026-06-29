"use client";
import Chat from "./chat";
import ChatInput from "./chatinput";
import { useEffect, useState } from "react";
import { Message } from "@/drizzle/schema";

type ChatInterfaceProps = {
  initialMessages: Message[];
  chatId: string;
};

const ChatInterface = ({ initialMessages, chatId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // const appendMessage = (message: Message[]) => {
  //   setMessages((prevMessages) => [...prevMessages, ...message]);
  // };

  // useEffect(() => {
  //   appendMessage(initialMessages);
  // }, []);

  return (
    <>
      <Chat chatId={chatId} messages={messages} />
      <ChatInput chatId={chatId} />
    </>
  );
};

export default ChatInterface;

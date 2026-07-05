import Message from "@/components/chat/message";
import { EmptyChat } from "@/components/chat/emptychat";
import { cn } from "@/lib/utils";
import ChatHeader from "./chatheader";
import { Message as MessageType } from "@/drizzle/schema";
import { useEffect, useRef } from "react";
import { TypingIndicator } from "./typing-indicator";

type Props = {
  chatId?: string;
  messages: MessageType[];
  loading?: boolean;
};

const Chat = ({ chatId, messages, loading }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!chatId)
    return (
      <div className="flex-1 overflew-y-auto ">
        <ChatHeader />
        <EmptyChat message={"Create a new chat to get started!"} />
      </div>
    );

  const isLastMessageFromUser = messages.length > 0 && messages[messages.length - 1].role === "user";
  const showTypingIndicator = loading && isLastMessageFromUser;

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
      <ChatHeader messages={messages} />

      {!messages?.length && <EmptyChat />}
      <div className={cn("flex flex-col", !messages?.length && "hidden")}>
        {messages &&
          messages.map((message: MessageType) => (
            <Message key={message.id} message={message} />
          ))}
        {showTypingIndicator && (
          <div className="py-5 px-4 md:px-10 max-w-2xl">
            <TypingIndicator />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Chat;

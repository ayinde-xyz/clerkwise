import Message from "@/components/chat/message";
import { EmptyChat } from "@/components/chat/emptychat";
import { cn } from "@/lib/utils";
import ChatHeader from "./chatheader";
import { Message as MessageType } from "@/drizzle/schema";
import { useEffect, useRef, useState } from "react";
import { TypingIndicator } from "./typing-indicator";

type Props = {
  chatId?: string;
  messages: MessageType[];
  loading: boolean;
  retrySendMessage?: (message: MessageType) => Promise<Response | undefined>;
  handleDeleteMessage?: (messageId: string) => Promise<void>;
  handleEditMessage: (message: string) => Promise<void>;
};

const Chat = ({
  chatId,
  messages,
  loading,
  retrySendMessage,
  handleDeleteMessage,
  handleEditMessage,
}: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    if (currentScrollY === 0) {
      setShowHeader(true);
    } else if (currentScrollY < lastScrollY.current) {
      setShowHeader(true);
    } else if (currentScrollY > lastScrollY.current) {
      setShowHeader(false);
    }
    lastScrollY.current = currentScrollY;
  };

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

  const isLastMessageFromUser =
    messages.length > 0 && messages[messages.length - 1].role === "user";
  const showTypingIndicator = loading && isLastMessageFromUser;

  return (
    <div
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto overflow-x-hidden pb-26 relative">
      <ChatHeader messages={messages} showHeader={showHeader} />

      {!messages?.length && <EmptyChat />}
      <div className={cn("flex flex-col", !messages?.length && "hidden")}>
        {messages &&
          messages.map((message: MessageType) => (
            <Message
              key={message.id}
              message={message}
              retrySendMessage={retrySendMessage}
              loading={loading}
              handleDeleteMessage={handleDeleteMessage}
              handleEditMessage={handleEditMessage}
            />
          ))}
        {showTypingIndicator && (
          <div className="flex justify-end">
            <TypingIndicator />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Chat;

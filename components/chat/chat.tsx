"use client";

import Message from "@/components/chat/message";
import { EmptyChat } from "@/components/chat/emptychat";
import { cn } from "@/lib/utils";
import ChatHeader from "./chatheader";
import { Message as MessageType } from "@/drizzle/schema";
import { useRef, useState } from "react";
import {
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  MessageScrollerProvider,
} from "@/components/ui/message-scroller";
import { MessageGroup } from "@/components/ui/message";
import { Marker, MarkerIcon, MarkerContent } from "@/components/ui/marker";
import { Spinner } from "../ui/spinner";

type Props = {
  chatId?: string;
  messages: MessageType[];
  loading: boolean;
  retrySendMessage?: (message: MessageType) => Promise<Response | undefined>;
  handleDeleteMessage?: (messageId: string) => Promise<void>;
  handleEditMessage: (values: {
    prompt: string;
    category?: MessageType["category"];
  }) => Promise<void>;
};

const Chat = ({
  chatId,
  messages,
  loading,
  retrySendMessage,
  handleDeleteMessage,
  handleEditMessage,
}: Props) => {
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

  if (!chatId)
    return (
      <div className="flex-1 overflow-y-auto">
        <ChatHeader showHeader={showHeader} />
        <EmptyChat message={"Create a new chat to get started!"} />
      </div>
    );

  const isLastMessageFromUser =
    messages.length > 0 && messages[messages.length - 1].role === "user";
  const showTypingIndicator = loading && isLastMessageFromUser;

  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller className="flex-1 relative ">
        <MessageScrollerViewport onScroll={handleScroll}>
          <ChatHeader messages={messages} showHeader={showHeader} />

          {!messages?.length && <EmptyChat />}

          <MessageScrollerContent
            className={cn(
              "flex flex-col gap-6",
              !messages?.length && "hidden",
            )}>
            <MessageGroup className="flex flex-col gap-4 px-4 md:px-10 pb-30">
              {messages &&
                messages.map((message: MessageType) => (
                  <MessageScrollerItem key={message.id}>
                    <Message
                      message={message}
                      retrySendMessage={retrySendMessage}
                      loading={loading}
                      handleDeleteMessage={handleDeleteMessage}
                      handleEditMessage={handleEditMessage}
                    />
                  </MessageScrollerItem>
                ))}
            </MessageGroup>

            {showTypingIndicator && (
              <MessageScrollerItem className="flex justify-end pl-4 md:pl-10">
                <Marker>
                  <MarkerIcon>
                    <Spinner />
                  </MarkerIcon>
                  <MarkerContent className="shimmer">
                    Thinking....
                  </MarkerContent>
                </Marker>
              </MessageScrollerItem>
            )}

            {/* Scroll anchor to keep the view updated at the bottom */}
            <MessageScrollerItem scrollAnchor />
          </MessageScrollerContent>
        </MessageScrollerViewport>
        {/* <MessageScrollerButton className="shadow-lg border border-border" /> */}
      </MessageScroller>
    </MessageScrollerProvider>
  );
};

export default Chat;

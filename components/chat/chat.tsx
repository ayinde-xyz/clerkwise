import Message from "@/components/chat/message";
import { EmptyChat } from "@/components/chat/emptychat";
import { cn } from "@/lib/utils";
import ChatHeader from "./chatheader";
import { Message as MessageType } from "@/drizzle/schema";

type Props = {
  chatId?: string;
  messages: MessageType[];
};

const Chat = ({ chatId, messages }: Props) => {
  if (!chatId)
    return (
      <div className="flex-1 overflew-y-auto ">
        <ChatHeader />
        <EmptyChat message={"Create a new chat to get started!"} />
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
      <ChatHeader messages={messages} />

      {!messages?.length && <EmptyChat />}
      <div className={cn("flex flex-col", !messages?.length && "hidden")}>
        {messages &&
          messages.map((message: any) => (
            <Message key={message.id} message={message} />
          ))}
      </div>
    </div>
  );
};

export default Chat;

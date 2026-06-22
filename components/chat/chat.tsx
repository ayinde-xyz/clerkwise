import Message from "@/components/chat/message";
import { EmptyChat } from "@/components/chat/emptychat";
import { cn } from "@/lib/utils";
import { getMessagesByChatId } from "@/actions/newchat";
import ChatHeader from "./chatheader";

type Props = {
  chatId?: string;
};

const Chat = async ({ chatId }: Props) => {
  if (!chatId)
    return (
      <div className="flex-1 overflew-y-auto ">
        <ChatHeader />
        <EmptyChat message={"Create a new chat to get started!"} />
      </div>
    );

  const messages = await getMessagesByChatId(chatId);

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

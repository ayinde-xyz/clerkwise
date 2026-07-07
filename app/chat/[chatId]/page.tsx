import { auth } from "@/lib/auth";
import Chat from "@/components/chat/chat";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ChatInterface from "@/components/chat/chatinterface";
import { getMessagesByChatId } from "@/actions/newchat";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

const ChatPage = async ({ params }: ChatPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { chatId } = await params;

  const messages = await getMessagesByChatId(chatId);

  if (!session || !session.user) {
    return notFound();
  }

  return (
    <div className="flex flex-col overflow-hidden w-full h-dvh relative">
      {/* <p>Yes i am still there</p> */}
      {/* Chat */}
      <ChatInterface initialMessages={messages} chatId={chatId} />
    </div>
  );
};

export default ChatPage;

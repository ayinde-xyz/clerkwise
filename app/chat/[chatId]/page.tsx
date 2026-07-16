import { auth } from "@/lib/auth";
import Chat from "@/components/chat/chat";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ChatInterface from "@/components/chat/chatinterface";
import { getMessagesByChatId } from "@/actions/newchat";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
  searchParams: Promise<{ init?: boolean }>;
};

const ChatPage = async ({ params, searchParams }: ChatPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { chatId } = await params;
  const { init } = await searchParams;

  const messages = await getMessagesByChatId(chatId);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col overflow-hidden w-full h-dvh relative">
      <ChatInterface initialMessages={messages} chatId={chatId} init={init} />
    </div>
  );
};

export default ChatPage;

import { auth } from "@/lib/auth";
import Chat from "@/components/chat/chat";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ChatInterface from "@/components/chat/chatinterface";

const ChatPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // const params = searchParams ? await searchParams : undefined;
  // const { id } = params || {};

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col overflow-hidden w-full h-dvh relative">
      {/* Chat */}
      <ChatInterface />
    </div>
  );
};

export default ChatPage;

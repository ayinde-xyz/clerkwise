import { auth } from "@/lib/auth";
import Chat from "@/components/chat/chat";
import ChatInput from "@/components/chat/chatinput";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ChatPage = async ({ params }: Props) => {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return notFound();
  }

  return (
    <div className="w-full flex flex-col overflow-hidden h-dvh">
      <Chat chatId={id} />
      <ChatInput chatId={id} />
    </div>
  );
};

export default ChatPage;

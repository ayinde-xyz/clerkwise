import { notFound } from "next/navigation";
import Chat from "./chat";
import ChatInput from "./chatinput";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ChatInterface = async ({ params }: Props) => {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return notFound();
  }
  return (
    <>
      <Chat chatId={id} />
      <ChatInput chatId={id} />
    </>
  );
};

export default ChatInterface;

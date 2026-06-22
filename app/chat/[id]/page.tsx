import ChatInterface from "@/components/chat/chatinterface";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ChatPage = async ({ params }: Props) => {
  return (
    <div className="w-full flex flex-col overflow-hidden h-dvh">
      <ChatInterface params={params} />
    </div>
  );
};

export default ChatPage;

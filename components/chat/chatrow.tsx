"use client";
import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Chat } from "@/drizzle/schema";
import axios from "axios";

type Props = {
  chat: Chat;
  error?: any;
};

const ChatRow = ({ chat, error }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const active = pathname.includes(chat.id);

  const removeChat = async (chatId: string) => {
    await axios.delete(`/api/chat?chatId=${chatId}`);
    router.push("/chat");
  };
  return (
    <Link
      href={`/chat/${chat.id}`}
      className={`chatRow justify-center ${active ? "bg-gray-700/50" : "bg-transparent"}`}>
      <ChatBubbleLeftIcon className="h-5 w-5" />
      {error && (
        <p className="text-red-500 text-sm">
          Error: {error.message || "An error occurred"}
        </p>
      )}
      <p className="flex-1 inline-flex truncate">{chat.title || "New Chat"}</p>
      <TrashIcon
        onClick={() => removeChat(chat.id)}
        className="h-5 w-5 text-gray-700 hover:text-red-700"
      />
    </Link>
  );
};

export default ChatRow;

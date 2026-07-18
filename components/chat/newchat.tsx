"use client";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { useSession } from "@/lib/auth-client";
import { newChat } from "@/actions/newchat";
import { useRouter } from "next/navigation";

const NewChat = () => {
  const session = useSession();
  const router = useRouter();
  if (!session || !session.data) return null;

  const createNewChat = async () => {
    if (!session || !session.data) return;
    const newChatId = await newChat(session.data.user.id);

    router.push(`/chat/${newChatId}`);
  };

  return (
    <Button onClick={createNewChat} className="border-gray-700 border chatRow">
      <PlusIcon className="h-4 w-4" />
      <p>New Chat</p>
    </Button>
  );
};

export default NewChat;

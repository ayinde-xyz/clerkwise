"use client";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { useSession } from "@/lib/auth-client";

interface NewChatProps {
  create?: () => Promise<void>;
}

const NewChat = ({ create }: NewChatProps) => {
  const session = useSession();
  if (!session || !session.data) return null;

  return (
    <Button onClick={create} className="border-gray-700 border chatRow">
      <PlusIcon className="h-4 w-4" />
      <p>New Chat</p>
    </Button>
  );
};

export default NewChat;

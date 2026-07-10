"use client";
import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Chat } from "@/drizzle/schema";
import axios from "axios";
import { Button } from "../ui/button";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";

type Props = {
  chat: Chat;
  error?: any;
};

const ChatRow = ({ chat, error }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const active = pathname.includes(chat.id);

  const removeChat = async (chatId: string) => {
    await axios.delete(`/api/chat/${chatId}`);
    router.push("/chat");
  };

  return (
    <SidebarMenuItem className="list-none">
      <SidebarMenuButton asChild isActive={active}>
        <Link href={`/chat/${chat.id}`} className="flex items-center gap-3">
          <ChatBubbleLeftIcon className="h-4 w-4 shrink-0" />
          {error ? (
            <span className="text-red-500 text-sm truncate">
              Error: {error.message || "An error occurred"}
            </span>
          ) : (
            <span className="truncate capitalize">
              {chat.title || "New Chat"}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
      <SidebarMenuAction asChild showOnHover>
        <Button
          variant="ghost"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeChat(chat.id);
          }}>
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">Delete Chat</span>
        </Button>
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
};

export default ChatRow;

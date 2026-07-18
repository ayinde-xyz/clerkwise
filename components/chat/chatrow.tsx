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
import { toast } from "sonner";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {
  chat: Chat;
};

const ChatRow = ({ chat }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const active = pathname.includes(chat.id);

  const removeChat = async (chatId: string) => {
    await axios
      .delete("/api/chat", { data: { chatId } })
      .then(() => {
        toast.success("Chat deleted successfully");
        router.push("/chat");
      })
      .catch((error) => {
        console.error("Error deleting chat:", error);
        toast.error("Failed to delete chat");
      });
  };

  return (
    <Suspense
      fallback={
        <div className="animate-pulse text-center flex flex-col space-y-2 text-white">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      }>
      <SidebarMenuItem className="list-none">
        <SidebarMenuButton asChild isActive={active}>
          <Link href={`/chat/${chat.id}`} className="flex items-center gap-3">
            <ChatBubbleLeftIcon className="h-4 w-4 shrink-0" />

            <span className="truncate capitalize">
              {chat.title || "New Chat"}
            </span>
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
    </Suspense>
  );
};

export default ChatRow;

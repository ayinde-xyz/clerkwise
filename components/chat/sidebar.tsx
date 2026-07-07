"use client";
import NewChat from "@/components/chat/newchat";
import ChatRow from "@/components/chat/chatrow";
import {
  SidebarMenu,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Chat } from "@/drizzle/schema";
import { redirect } from "next/navigation";
import useSWR from "swr";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import ModelSelection from "./modelselection";
import { useSession } from "@/lib/auth-client";
import { SignOut } from "../auth/signout";
import { newChat } from "@/actions/newchat";
import { archivo } from "@/app/fonts";
import Image from "next/image";
import Icon from "@/app/icon.svg";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const session = useSession();

  const createNewChat = async () => {
    if (!session.data) return;
    const newChatId = await newChat(session.data);
    redirect(`/chat/${newChatId}`);
  };

  const {
    data: chats,
    error,
    isLoading,
  } = useSWR<Chat[]>("/api/chat", fetcher);

  return (
    <Sidebar {...props} variant="floating">
      <SidebarHeader>
        <SidebarGroup className="items-center space-x-2">
          <div className="flex items-center space-x-2">
            <h1 className={`${archivo.className} text-xl font-bold `}>
              ClerkWise
            </h1>
            <Image
              src={Icon}
              alt="ClerkWise Logo"
              className="inline"
              width={32}
              height={32}
            />
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>New Chat</SidebarGroupLabel>
          <SidebarGroupContent>
            <NewChat create={createNewChat} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Select a Model</SidebarGroupLabel>
          <SidebarGroupContent>
            <ModelSelection isSidebar />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex-1">
              <div className="flex flex-col space-y-2 my-2">
                {isLoading && (
                  <div className="animate-pulse text-center flex flex-col space-y-2 text-white">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                )}
                {chats?.map((chat) => (
                  <SidebarMenu key={chat.id}>
                    <SidebarMenuButton asChild>
                      <ChatRow chat={chat} error={error} />
                    </SidebarMenuButton>
                  </SidebarMenu>
                ))}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="items-center justify-center">
          {session.data && <SignOut />}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

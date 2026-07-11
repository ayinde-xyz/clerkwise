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
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Chat } from "@/drizzle/schema";
import { redirect } from "next/navigation";
import useSWR from "swr";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import ModelSelection from "./modelselection";
import { useSession } from "@/lib/auth-client";
import { SignOut, DeleteAccount } from "../auth/signout";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown } from "lucide-react";
import { newChat } from "@/actions/newchat";
import { archivo } from "@/app/fonts";
import Image from "next/image";
import Icon from "@/app/icon.svg";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const getInitials = (name?: string | null, email?: string | null) => {
  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) {
      const w = parts[0];
      return (w[0] + (w[1] || "")).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  if (email) {
    const local = email.split("@")[0] || "";
    return (local[0] + (local[1] || "")).toUpperCase() || "U";
  }

  return "U";
};
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
            <h1
              className={`${archivo.className} text-3xl font-bold text-primary`}>
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
          <SidebarGroupContent>
            <NewChat create={createNewChat} />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Select a Model</SidebarGroupLabel>
          <SidebarGroupContent>
            <ModelSelection />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && (
                <div className="animate-pulse text-center flex flex-col space-y-2 text-white">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              )}
              {chats?.map((chat) => (
                <ChatRow key={chat.id} chat={chat} error={error} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {session.data && (
            <SidebarMenuItem className="list-none w-full">
              <Collapsible className="w-full group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="w-full flex items-center justify-between p-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={session.data.user.image || ""}
                          alt={session.data.user.name || "User"}
                        />
                        <AvatarFallback className="rounded-lg">
                          {getInitials(
                            session.data.user.name,
                            session.data.user.email,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start min-w-0">
                        <span className="text-sm font-semibold truncate text-left">
                          {session.data.user.name || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate text-left">
                          {session.data.user.email}
                        </span>
                      </div>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col gap-1 mt-1 px-1">
                  <SignOut />
                  <DeleteAccount />
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

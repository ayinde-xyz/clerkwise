"use client";

import { EditIcon, RotateCwIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import CopyButton from "./copybutton";
import { Message as MessageType } from "@/drizzle/schema";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Message as UiMessage,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { cn } from "@/lib/utils";

type Props = {
  message: MessageType;
  retrySendMessage?: (message: MessageType) => Promise<Response | undefined>;
  loading: boolean;
  handleDeleteMessage?: (messageId: string) => Promise<void>;
  handleEditMessage: (values: {
    prompt: string;
    category?: MessageType["category"];
  }) => Promise<void>;
};

const Message = ({
  message,
  retrySendMessage,
  loading,
  handleDeleteMessage,
  handleEditMessage,
}: Props) => {
  const isModel = message.role === "model";
  const session = useSession();
  const userImage = session?.data?.user?.image;
  const userName = session?.data?.user?.name || "User";

  // Render category label nicely
  const getCategoryLabel = (cat: string) => {
    return cat
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <UiMessage align={isModel ? "end" : "start"} className="py-2 px-1">
      <MessageContent className="max-w-[85%]">
        <MessageHeader
          className={cn(
            "flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5",
            isModel ? "justify-end" : "justify-start",
          )}>
          {message.category && (
            <span className="text-[9px] bg-slate-200/60 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-1.5 py-0.5 rounded font-normal normal-case">
              {getCategoryLabel(message.category)}
            </span>
          )}
        </MessageHeader>

        <Bubble
          variant={isModel ? "muted" : "ghost"}
          align={isModel ? "end" : "start"}
          className={cn(isModel && "rounded-2xl rounded-tr-xs shadow-sm")}>
          <BubbleContent
            className={
              "whitespace-pre-wrap p-3 text-sm leading-relaxed wrap-break-word"
            }>
            <p>{message.content}</p>
            {!message.success && !isModel && (
              <div className="mt-2 text-xs text-red-500 font-medium">
                Failed to send message. Please try again.
              </div>
            )}
          </BubbleContent>
        </Bubble>

        <MessageFooter
          className={cn(
            "flex items-center gap-1 mt-1 opacity-0 group-hover/message:opacity-100 transition-opacity duration-200",
            isModel ? "justify-end" : "justify-start",
          )}>
          {isModel && <CopyButton text={message.content} />}

          {!isModel && !message.success && (
            <Button
              variant="ghost"
              size="icon"
              disabled={loading}
              className="h-7 w-7 hover:bg-muted text-muted-foreground focus:translate-y-0.5 focus:scale-95 transition-all"
              onClick={() => retrySendMessage?.(message)}>
              <RotateCwIcon className="h-3.5 w-3.5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            disabled={loading}
            className="h-7 w-7 hover:bg-muted text-muted-foreground hover:text-destructive focus:translate-y-0.5 focus:scale-95 transition-all"
            onClick={() => handleDeleteMessage?.(message.id)}>
            <TrashIcon className="h-3.5 w-3.5" />
          </Button>

          {!isModel && (
            <Button
              variant="ghost"
              size="icon"
              disabled={loading}
              className="h-7 w-7 hover:bg-muted text-muted-foreground focus:translate-y-0.5 focus:scale-95 transition-all"
              onClick={() =>
                handleEditMessage?.({
                  prompt: message.content,
                  category: message.category || undefined,
                })
              }>
              <EditIcon className="h-3.5 w-3.5" />
            </Button>
          )}
        </MessageFooter>
      </MessageContent>
    </UiMessage>
  );
};

export default Message;

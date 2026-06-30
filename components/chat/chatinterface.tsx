"use client";
import Chat from "./chat";
import ChatInput from "./chatinput";
import { useEffect, useRef, useState } from "react";
import { Message } from "@/drizzle/schema";
import {
  ChatSchema,
  ChatSchemaType,
  FileSchema,
  FileSchemaType,
} from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useModel from "@/hooks/use-model";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

type ChatInterfaceProps = {
  initialMessages: Message[];
  chatId: string;
};

const ChatInterface = ({ initialMessages, chatId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const store = useModel();
  const router = useRouter();
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ChatSchemaType>({
    resolver: zodResolver(ChatSchema),
    defaultValues: {
      prompt: "",
      model: store.model,
      file: undefined,
    },
  });

  const sendMessage = async (values: ChatSchemaType) => {
    try {
      setLoading(true);

      toast.loading("Sending message...");

      const { prompt, model, file } = values;

      const userMessage = {
        id: Date.now().toString(),
        chatId,
        role: "user",
        createdAt: new Date(),
        content: prompt,
      };

      setMessages((prev) => [...prev, userMessage]);

      form.reset({ ...values, prompt: "" });
      setAttachedFileName(null);

      const addMessages = await axios.post("/api/chat/addMessage", {
        chatId,
        prompt,
        role: "user",
      });

      if (addMessages.status !== 200) {
        toast.dismiss();
        toast.error("Failed to send message");
        setLoading(false);
        return;
      }
      toast.dismiss();

      const response = await fetch("/api/chat/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
        }),
      });

      toast.dismiss();
      toast.success("Response Generated.");

      router.refresh();
      return response;
    } catch (error) {
      console.error(error);
      toast.error(`${error} Failed to send message`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Chat chatId={chatId} messages={messages} />
      <ChatInput
        chatId={chatId}
        form={form}
        sendMessage={sendMessage}
        loading={loading}
      />
    </>
  );
};

export default ChatInterface;

"use client";
import Chat from "./chat";
import ChatInput from "./chatinput";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { toast } from "sonner";
import axios from "axios";

type ChatInterfaceProps = {
  initialMessages?: Message[];
  chatId?: string;
};

const ChatInterface = ({
  initialMessages = [],
  chatId,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const store = useModel();
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ChatSchemaType>({
    resolver: zodResolver(ChatSchema),
    defaultValues: {
      prompt: "",
      model: store.model,
      file: undefined,
    },
  });

  const getApiErrorMessage = async (response: Response): Promise<string> => {
    const fallbackMessage = `API error: ${response.status}`;

    try {
      const data = await response.json();
      if (typeof data?.error === "string" && data.error.trim().length > 0) {
        return data.error;
      }
    } catch {
      // Ignore JSON parse errors and use fallback status text.
    }

    return fallbackMessage;
  };

  const stopStream = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setLoading(false);
    setIsStreaming(false);
  }, []);

  const sendMessage = async (prompt: string) => {
    if (!chatId) return;
    let userMessageId = "";
    let assistantMessageId = "";
    try {
      setLoading(true);

      toast.loading("Sending message...");

     

      userMessageId =
        typeof window !== "undefined" && window.crypto?.randomUUID
          ? window.crypto.randomUUID()
          : Math.random().toString(36).substring(2);
      const userMessage = {
        id: userMessageId,
        chatId,
        role: "user",
        createdAt: new Date(),
        content: prompt,
        success: true,
      };

      setMessages((prev) => [...prev, userMessage]);

      
      setAttachedFileName(null);

      const addMessages = await axios.post("/api/chat", {
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

      const response = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        const errorMessage = await getApiErrorMessage(response);
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      assistantMessageId =
        typeof window !== "undefined" && window.crypto?.randomUUID
          ? window.crypto.randomUUID()
          : Math.random().toString(36).substring(2);

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          chatId,
          role: "model",
          content: "",
          createdAt: new Date(),
        },
      ]);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let contentText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        if (!isStreaming) setIsStreaming(true);
        contentText += chunkText;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: contentText }
              : msg,
          ),
        );
      }

      await axios.post("/api/chat", {
        chatId,
        prompt: contentText,
        role: "model",
      });

      return response;
    } catch (error: any) {
      console.error(error);
      if (error.name !== "AbortError") {
        const errorMessage =
          typeof error?.message === "string" && error.message.trim().length > 0
            ? error.message
            : "Failed to send message. Please try again.";
        toast.error(errorMessage);

        setMessages((prev) =>
          prev
            .map((m) => (m.id === userMessageId ? { ...m, success: false } : m))
            .filter((m) => m.id !== assistantMessageId),
        );
      } else {
        setMessages(
          (prev) =>
            prev
              .map((m) =>
                m.id === assistantMessageId && m.content === "" ? null : m,
              )
              .filter(Boolean) as Message[],
        );
      }
    } finally {
      abortControllerRef.current = null;
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleSendMessage = useCallback(
    async (values: ChatSchemaType) => {
      form.reset({ ...values, prompt: "" });
      const response = await sendMessage(values.prompt);
      return response;
    },
    [sendMessage, form],
  );

  return (
    <>
      <Chat chatId={chatId} messages={messages} loading={loading} />
      <ChatInput
        form={form}
        handleSendMessage={handleSendMessage}
        loading={loading}
        isStreaming={isStreaming}
        stopStream={stopStream}
      />
    </>
  );
};

export default ChatInterface;

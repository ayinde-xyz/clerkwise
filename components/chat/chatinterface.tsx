"use client";
import Chat from "./chat";
import ChatInput from "./chatinput";
import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "@/drizzle/schema";
import { ChatSchema, ChatSchemaType } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useModel from "@/hooks/use-model";
import { toast } from "sonner";
import axios from "axios";
import { deleteMessageById, newChat } from "@/actions/newchat";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";

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

type ChatInterfaceProps = {
  initialMessages?: Message[];
  chatId?: string;
  init?: boolean;
};

const initiatedChats = new Set<string>();

const ChatInterface = ({
  initialMessages = [],
  chatId,
  init,
}: ChatInterfaceProps) => {
  const session = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const store = useModel();

  const form = useForm<ChatSchemaType>({
    resolver: zodResolver(ChatSchema),
    defaultValues: {
      prompt: "",
      model: store.model,
      category: "internal_medicine",
    },
  });

  const stopStream = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setLoading(false);
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback(
    async (prompt: string, skipUserMessage: boolean = false) => {
      if (!chatId) return;
      let userMessageId = "";
      let assistantMessageId = "";
      try {
        setLoading(true);

        if (!skipUserMessage) {
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

          const addUserMessages = await axios.post("/api/chat", {
            id: userMessageId,
            chatId,
            prompt,
            role: "user",
          });

          if (addUserMessages.status !== 200) {
            toast.dismiss();
            toast.error("Failed to send message");
            setLoading(false);
            return;
          }
          toast.dismiss();
        }

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
          id: assistantMessageId,
          chatId,
          prompt: contentText,
          role: "model",
        });

        return response;
      } catch (error: any) {
        console.error(error);
        if (error.name !== "AbortError") {
          const errorMessage =
            typeof error?.message === "string" &&
            error.message.trim().length > 0
              ? error.message
              : "Failed to send message. Please try again.";
          toast.error(errorMessage);

          setMessages((prev) =>
            prev
              .map((m) =>
                m.id === userMessageId ? { ...m, success: false } : m,
              )
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
    },
    [chatId, isStreaming, setMessages],
  );

  const handleSendMessage = useCallback(
    async (values: ChatSchemaType) => {
      form.reset({ ...values, prompt: "" });
      if (!chatId) {
        if (!session.data) {
          toast.error("Please sign in to start a chat");
          router.push("/auth/signup");
          return;
        }
        try {
          setLoading(true);
          const newChatId = await newChat(session.data);
          const tempMsgId =
            typeof window !== "undefined" && window.crypto?.randomUUID
              ? window.crypto.randomUUID()
              : Math.random().toString(36).substring(2);
          await axios.post("/api/chat", {
            id: tempMsgId,
            chatId: newChatId,
            prompt: values.prompt,
            role: "user",
          });
          router.push(`/chat/${newChatId}?init=true`);
        } catch (error) {
          console.error("Failed to start new chat:", error);
          toast.error("Failed to start new chat. Please try again.");
          setLoading(false);
        }
      }

      const response = await sendMessage(values.prompt);
      return response;
    },
    [chatId, sendMessage, form, session.data, router],
  );

  const handleDeleteMessage = useCallback(
    async (messageId: string) => {
      console.log("Deleting message with Id", messageId);
      if (loading) return;
      try {
        const deletedMessageId = await deleteMessageById(messageId);
        const targetId = deletedMessageId?.[0]?.id || messageId;
        setMessages((prev) => prev.filter((msg) => msg.id !== targetId));
        toast.success("Message deleted successfully");
      } catch (error) {
        console.error("Failed to delete message:", error);
        // Fallback: remove from UI anyway
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        toast.error("Failed to delete message. Please try again.");
      }
    },
    [loading, deleteMessageById, setMessages],
  );

  const handleEditMessage = useCallback(
    async (message: string) => {
      if (loading) return;
      form.setValue("prompt", message);
    },
    [form, loading],
  );

  const retrySendMessage = useCallback(
    async (message: Message) => {
      form.reset({ ...form.getValues(), prompt: message.content });
      const response = await sendMessage(message.content);
      return response;
    },
    [sendMessage, form],
  );

  useEffect(() => {
    if (!chatId || !init) return;
    if (initiatedChats.has(chatId)) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "user" && messages.length === 1) {
      initiatedChats.add(chatId);
      sendMessage(lastMessage.content, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, sendMessage, init]);

  return (
    <>
      <Chat
        chatId={chatId}
        messages={messages}
        loading={loading}
        retrySendMessage={retrySendMessage}
        handleDeleteMessage={handleDeleteMessage}
        handleEditMessage={handleEditMessage}
      />
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

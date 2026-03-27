"use server";
import "server-only";
import { db } from "@/drizzle";
import { type Chat, chat, message } from "@/drizzle/schema";
import { Session } from "@/lib/auth-client";
import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getChats = async (session: Session) => {
  const response = await db
    .select()
    .from(chat)
    .where(eq(chat.userId, session.user?.id || ""));

  return response;
};

export const getMessagesByChatId = async (chatId: string) => {
  const getMessages = unstable_cache(
    async () => {
      return await db
        .select()
        .from(message)
        .where(eq(message.chatId, chatId))
        .orderBy(asc(message.createdAt));
    },
    [`messages-${chatId}`],
    { tags: [`messages-${chatId}`] },
  );

  return await getMessages();
};

// Revalidation functions
// export const revalidateMessages = async (chatId: string) => {
//   revalidateTag(`messages-${chatId}`, "max");
//   revalidateTag("messages", "max");
// };

// export const revalidateChats = async (userId: string) => {
//   revalidateTag(`chats-${userId}`, "max");
// };

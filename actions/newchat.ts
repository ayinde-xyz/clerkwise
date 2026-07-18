"use server";
import "server-only";
import { db } from "@/drizzle";
import { type Chat, chat, message } from "@/drizzle/schema";
import { Session } from "@/lib/auth-client";
import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { revalidatePath } from "next/cache";

export const newChat = async (userId: string) => {
  const [created] = await db
    .insert(chat)
    .values({
      userId,
      title: "New Chat",
      createdAt: new Date(),
    })
    .returning({ id: chat.id });

  revalidatePath("/chat");

  return created.id;
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

export const chatTitles = async (userId: string) => {
  const getChatTitlesByChatId = await db
    .select()
    .from(chat)
    .where(eq(chat.userId, userId));

  return getChatTitlesByChatId;
};

export const deleteMessageById = async (messageId: string) => {
  const deletedMessageId = await db
    .delete(message)
    .where(eq(message.id, messageId))
    .returning({ id: message.id });

  return deletedMessageId;
};

// Revalidation functions
// export const revalidateMessages = async (chatId: string) => {
//   revalidateTag(`messages-${chatId}`, "max");
//   revalidateTag("messages", "max");
// };

// export const revalidateChats = async (userId: string) => {
//   revalidateTag(`chats-${userId}`, "max");
// };

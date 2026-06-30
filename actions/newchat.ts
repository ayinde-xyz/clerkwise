"use server";
import "server-only";
import { db } from "@/drizzle";
import { type Chat, chat, message } from "@/drizzle/schema";
import { Session } from "@/lib/auth-client";
import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const newChat = async (session: Session) => {
  const [created] = await db
    .insert(chat)
    .values({
      userId: session?.user.id || "",
      title: "New Chat",
      createdAt: new Date(),
    })
    .returning({ id: chat.id });

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

export const addMessagesByChatId = async (
  chatId: string,
  prompt: string,
  role: "user" | "assistant",
) => {
  const checkMessageWithId = await db.query.message.findMany({
    where: (message, { eq }) => eq(message.chatId, chatId),
  });

  if (!checkMessageWithId.length) {
    await db.update(chat).set({ title: prompt }).where(eq(chat.id, chatId));
  }

  const addMessages = await db
    .insert(message)
    .values({
      content: prompt,
      chatId,
      attachments: [],
      role,
      createdAt: new Date(),
    })
    .returning({
      id: message.id,
    });

  return addMessages;
};

// Revalidation functions
// export const revalidateMessages = async (chatId: string) => {
//   revalidateTag(`messages-${chatId}`, "max");
//   revalidateTag("messages", "max");
// };

// export const revalidateChats = async (userId: string) => {
//   revalidateTag(`chats-${userId}`, "max");
// };

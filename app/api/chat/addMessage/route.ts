import { db } from "@/drizzle";
import { chat, message } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    const body = await request.json();

    const { chatId, prompt, role } = body;

    const checkMessageWithId = await db.query.message.findMany({
      where: (message, { eq }) => eq(message.chatId, chatId),
    });

    if (!checkMessageWithId.length) {
      await db.update(chat).set({ title: prompt }).where(eq(chat.id, chatId));
    }

    await db
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

    //  console.log(response);
    revalidatePath(`/chat/${chatId}`);
    updateTag(`messages-${chatId}`);
    return NextResponse.json(
      { success: "Message sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Message not sent successfully" });
  }
}

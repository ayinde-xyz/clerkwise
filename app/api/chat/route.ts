import { db } from "@/drizzle";
import { chat, message } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return notFound();
    }
    const chats = await await db
      .select()
      .from(chat)
      .where(eq(chat.userId, session.user?.id || ""));

    return NextResponse.json(chats || []);
    // console.log("API CHATs:", chats);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    const body = await request.json();

    const { chatId, prompt, role, id, category } = body;

    const checkMessageWithId = await db.query.message.findMany({
      where: (message, { eq }) => eq(message.chatId, chatId),
    });

    if (!checkMessageWithId.length) {
      await db.update(chat).set({ title: prompt }).where(eq(chat.id, chatId));
    }

    await db
      .insert(message)
      .values({
        id,
        content: prompt,
        chatId,
        role,
        category: category || "internal_medicine",
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

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();

    const { chatId } = data;

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required." },
        { status: 400 },
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    const result = await db
      .delete(chat)
      .where(and(eq(chat.id, chatId), eq(chat.userId, session.user.id)))
      .returning({ id: chat.id });

    console.log(result, "This is the result");
    if (!result.length) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      { message: "Chat deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete chat." },
      { status: 500 },
    );
  }
}

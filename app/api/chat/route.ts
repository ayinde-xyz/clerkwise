import { db } from "@/drizzle";
import { chat } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
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

export async function DELETE(request: NextRequest) {
  try {
    const chatId = request.nextUrl.searchParams.get("chatId");

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

    // await db.delete(message).where(eq(message.chatId, id));
    await db.delete(chat).where(eq(chat.id, chatId));

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

import { db } from "@/drizzle";
import { chat } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

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

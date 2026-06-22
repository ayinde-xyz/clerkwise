import { auth } from "@/lib/auth";
import { askLLM } from "@/lib/langchain";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { prompt } = body;

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  const response = await askLLM(prompt);

  // Here you would typically save the prompt to your database
  // For demonstration, we'll just return the prompt back
  return NextResponse.json({ prompt: body.prompt });
}

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

  try {
    const { readable, writable } = new TransformStream();

    const response = await askLLM(prompt);

    const reader = response.getReader();
    let firstChunk: ReadableStreamReadResult<Uint8Array>;
    try {
      firstChunk = await reader.read();
    } catch (streamErr: any) {
      return NextResponse.json(
        { error: streamErr?.message || "Failed to generate response" },
        { status: 503 },
      );
    }

    console.log("LLM Response:", response); // Log the response for debugging purposes

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in POST /api/chat/prompt:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  // Here you would typically save the prompt to your database
  // For demonstration, we'll just return the prompt back
}

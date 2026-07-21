import { auth } from "@/lib/auth";
import { streamLLM } from "@/lib/langchain";
import { rateLimit } from "@/lib/upstash";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || (process.env.NODE_ENV === "development" ? "http" : "https");
  const currentOrigin = host ? `${proto}://${host}` : req.nextUrl.origin;

  const allowedOrigins = [
    currentOrigin,
    req.nextUrl.origin,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
  ].filter(Boolean) as string[];

  if (origin) {
    const isAllowed = allowedOrigins.some((allowed) => allowed === origin || origin.startsWith(allowed));
    if (!isAllowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else {
    const referer = req.headers.get("referer");
    if (referer) {
      const isAllowedReferer = allowedOrigins.some((allowed) => referer.startsWith(allowed));
      if (!isAllowedReferer) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
  }

  const { success, limit, remaining, reset } = await rateLimit.limit(
    session.user.id,
  );

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Slow down." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );
  }

  const body = await req.json();

  const { prompt, category, model } = body;

  if (!prompt || !category || !model || typeof prompt !== "string") {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  try {
    const stream = streamLLM(prompt, category, model);
    const encoder = new TextEncoder();

    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.content;
            if (content) {
              controller.enqueue(encoder.encode(content.toString()));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error in POST /api/prompt:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

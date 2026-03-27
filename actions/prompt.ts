"use server";
import { Session } from "@/lib/auth-client";
import { FileMetadataResponse } from "@google/generative-ai/server";
import { revalidatePath } from "next/cache";
import { ModelType } from "@/schemas";
import * as z from "zod";
import { ChatGoogle } from "@langchain/google/node";
import { HumanMessage } from "@langchain/core/messages";

// const ai = genkit({
//   plugins: [googleAI()],
// });

export const aiResponse = async (
  input: string,
  // session?: Session,
  model: string,
  file?: { uri: string; mimeType: string },
  // model?: ModelType,
  // response?: FileMetadataResponse | undefined,
) => {
  try {
    const modelRes = new ChatGoogle({
      model,
      maxOutputTokens: 2048,
    });

    const messageContent: any[] = [
      {
        type: "text",
        text: input,
      },
    ];

    if (file) {
      messageContent.push({
        type: "media",
        mimeType: file.mimeType,
        fileUri: file.uri,
      });
    }

    const response = await modelRes.invoke([
      new HumanMessage({
        content: messageContent,
      }),
    ]);

    console.log("AI Response:", response.content);

    // const baseUrl =
    //   process.env.NEXT_PUBLIC_BASE_URL ||
    //   process.env.NEXTAUTH_URL ||
    //   `http://localhost:${process.env.PORT || 3000}`;

    // revalidatePath(`/api/chats/${chatId}`);
    return response.content;
  } catch (error) {
    console.error("Error generating AI response:", error);
  }
};

// const messageHistory: MessageHistory[] = [];
// const messages = await getDocs(
//   query(
//     collection(db, "users", session?.user?.id!, "chats", chatId!, "messages"),
//     orderBy("createdAt", "asc"),
//     limitToLast(10),
//   ),
// );
// messages.forEach((doc) => {
//   messageHistory.push({
//     role: doc.data().role,
//     content: [{ text: doc.data().text }],
//   });
// });
// const promptFlow = ai.defineFlow(
//   {
//     name: "promptFlow",
//     inputSchema: z.string(),
//     outputSchema: z.string(),
//   },
//   async (request, streamingCallback) => {
//     const { text } = await ai.generate({
//       messages: messageHistory,
//       model: modelEngines[model],
//       streamingCallback,
//       prompt:
//         response !== undefined
//           ? [
//               {
//                 text: request,
//               },
//               {
//                 media: { contentType: response.mimeType, url: response.uri },
//               },
//             ]
//           : request,
//     });
//     return text;
//   },
// );
// const { output } = promptFlow.stream(prompt);
// const finalOutput = await output;
// const message: Message = {
//   text: finalOutput || "Chat GPT was unable to find an answer",
//   createdAt: admin.firestore.FieldValue.serverTimestamp(),
//   role: "model",
//   user: {
//     _id: model,
//     name: "Gemini",
//     avatar: "https://links.papareact.com/89k",
//   },
// };
// await adminDb
//   .collection("users")
//   .doc(session?.user?.id!)
//   .collection("chats")
//   .doc(chatId)
//   .collection("messages")
//   .add(message);
// revalidatePath(`/api/chats/${chatId}`);
// return { finalOutput };

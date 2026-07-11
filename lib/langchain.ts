import { ChatSchemaType, ModelType } from "@/schemas";
import { ChatGoogle } from "@langchain/google";

const gemini = new ChatGoogle({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3-flash-preview",
});

export async function askLLM(prompt: string) {
  const response = await gemini.invoke([{ role: "user", content: prompt }]);
  return response;
}

export async function streamLLM(
  prompt: string,
  model: ModelType,
  category: ChatSchemaType["category"],
) {
  return await gemini.stream([{ role: "user", content: prompt }]);
}

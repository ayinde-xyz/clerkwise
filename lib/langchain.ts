import { ChatGoogle } from "@langchain/google";

const llm = new ChatGoogle({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3-flash-preview",
});

export async function askLLM(prompt: string) {
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return response;
}

export async function streamLLM(prompt: string) {
  return await llm.stream([{ role: "user", content: prompt }]);
}


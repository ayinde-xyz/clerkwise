import { ChatGoogle } from "@langchain/google";

const llm = new ChatGoogle({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
});

export async function askLLM(prompt: string) {
  const response = await llm.invoke([{ role: "user", content: prompt }]);
  return response;
}

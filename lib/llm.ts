"use server";
import { ChatGoogle } from "@langchain/google";

export const llm1 = async (model: string) => {
  const gemini = new ChatGoogle({
    apiKey: process.env.GOOGLE_API_KEY,
    model,
    maxOutputTokens: 2048,
    temperature: 1,
    thinkingBudget: 1024,
  });
  return gemini;
};

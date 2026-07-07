"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ChatSchemaType } from "@/schemas";

type ModelState = {
  model: ChatSchemaType["model"];
  setModel: (model: ChatSchemaType["model"]) => void;
  reset: () => void;
};

const DEFAULT_MODEL = "gemini-3.1-flash-lite-preview";

const useModel = create<ModelState>()(
  persist(
    (set) => ({
      model: DEFAULT_MODEL,
      setModel: (model) => set({ model }),
      reset: () => set({ model: DEFAULT_MODEL }),
    }),
    {
      name: "clerkwise-model-storage", // key in localStorage (optional)
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useModel;

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ModelType } from "@/schemas";

type ModelState = {
  model: ModelType;
  setModel: (model: ModelType) => void;
  reset: () => void;
};

const DEFAULT_MODEL = "gemini-3-flash-preview";

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

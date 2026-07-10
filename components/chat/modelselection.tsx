"use client";
import { ModelType } from "@/schemas";

import useModel from "@/hooks/use-model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const models = [
  {
    title: "Gemini 3.1 Pro",
    value: "gemini-3-flash-preview",
    description: "",
  },
  {
    title: "GPT 5.5",
    value: "gpt-5.5-2026-04-23",
    description: "",
  },
  {
    title: "Claude Sonnet 5",
    value: "claude-sonnet-5",
    description: "The best model in the world for multimodal understanding",
  },
];

const ModelSelection = () => {
  const store = useModel();
  const value = store.model;
  const onChange = (v: ModelType) => {
    store.setModel(v);
  };

  return (
    <Select
      name={models[0].title}
      value={value}
      onValueChange={onChange}
      defaultValue="">
      <SelectTrigger className="min-w-30">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent position="item-aligned">
        {models.map((model) => (
          <SelectItem key={model.value} value={model.value}>
            {model.title}
            <SelectSeparator />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelection;

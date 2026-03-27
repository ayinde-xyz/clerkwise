"use client";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import { ChatSchemaType } from "@/schemas";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { BotIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "../ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Model = {
  field?: ControllerRenderProps<ChatSchemaType, "model">;
  fieldState?: ControllerFieldState;
  isSidebar: boolean;
};

const models = [
  {
    title: "Gemini 3.1 Pro",
    value: "gemini-3.1-pro-preview",
    description: "The best model in the world for multimodal understanding",
  },
  {
    title: "Gemini 3.1 Flash",
    value: "gemini-3.1-flash-lite-preview",
    description:
      "Our most balanced model built for speed, scale, and frontier intelligence.",
  },
  {
    title: "Gemini 2.5 Flash",
    value: "gemini-2.5-flash",
    description:
      "Our best model in terms of price-performance, offering well-rounded capabilities",
  },
  {
    title: "Gemini 2.5 Flash-Lite",
    value: "gemini-2.5-flash-lite",
    description:
      "Our fastest flash model optimized for cost-efficiency and high throughput.",
  },
  {
    title: "Gemini 2.5 Pro",
    value: "gemini-2.5-pro",
    description:
      "Our state-of-the-art thinking model, capable of reasoning over complex problems ",
  },
];

import useModel from "@/hooks/use-model";

const ModelSelection = ({ field, fieldState, isSidebar }: Model) => {
  const store = useModel();
  const value = field?.value ?? store.model;
  const onChange = (v: ChatSchemaType["model"]) => {
    if (field?.onChange) field.onChange(v);
    store.setModel(v);
  };

  if (isSidebar) {
    return (
      <Field>
        <Select
          name={field?.name}
          value={value}
          onValueChange={onChange}
          defaultValue="gemini-3.1-flash-lite-preview">
          <SelectTrigger
            aria-invalid={fieldState?.invalid}
            className="min-w-30">
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
      </Field>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="icon" variant={"ghost"}>
          <BotIcon size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute -top-30  -right-10 md:-top-25 md:left-30 w-60 md:w-70  bg-slate-100">
        <DropdownMenuLabel>Select a model</DropdownMenuLabel>
        <RadioGroup
          name={field?.name}
          value={value}
          onValueChange={onChange}
          defaultValue={"gemini-3.1-flash-lite-preview"}>
          {models.map((model) => (
            <FieldLabel key={model.value}>
              <Field
                orientation="horizontal"
                data-invalid={fieldState?.invalid}>
                <FieldContent>
                  <FieldTitle>{model.title}</FieldTitle>
                  <FieldDescription>{model.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={model.value} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelSelection;

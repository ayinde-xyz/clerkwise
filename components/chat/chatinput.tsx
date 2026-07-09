"use client";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { SendIcon, SquareIcon } from "lucide-react";
import { Field, FieldGroup, FieldSet } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import ModelSelection from "./modelselection";
import useModel from "@/hooks/use-model";
import { useRouter } from "next/navigation";
import { ChatSchemaType } from "@/schemas";

type Props = {
  form: UseFormReturn<ChatSchemaType>;
  handleSendMessage: (values: ChatSchemaType) => Promise<Response | undefined>;
  loading: boolean;
  isStreaming: boolean;
  stopStream: () => void;
};
const ChatInput = ({
  form,
  handleSendMessage,
  loading,
  isStreaming,
  stopStream,
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const promptValue = form.watch("prompt");

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [promptValue]);

  const showStopButton = loading && isStreaming;

  return (
    <form
      onSubmit={form.handleSubmit(handleSendMessage)}
      className="absolute bottom-0 right-0 left-0 bg-transparent w-full px-3 max-w-2xl mx-auto  rounded-2xl  text-sm">
      <FieldGroup className="mb-2 relative">
        <Controller
          control={form.control}
          name="prompt"
          render={({ field, fieldState }) => (
            <Field className="max-w-2xl bg-slate-200 rounded-2xl p-1">
              <InputGroup>
                <InputGroupTextarea
                  disabled={loading}
                  className=" resize-none"
                  {...field}
                  ref={(e) => {
                    field.ref(e);
                    textareaRef.current = e;
                  }}
                  aria-invalid={fieldState.invalid}
                  id="block-end-input"
                  placeholder="Ask Clerkwise"
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText
                    className={`tabular-nums ${(field.value ?? "").trim().length > 90 ? "text-destructive" : ""}`}>
                    {(field.value ?? "").trim().length}/100 chars
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          )}
        />

        {/* <Controller
          control={form.control}
          name="model"
          render={({ field, fieldState }) => {
            const handleChange = (v: ChatSchemaType["model"]) => {
              field.onChange(v);
              store.setModel(v);
            };
            return (
              <FieldSet className="absolute bottom-1 right-18 w-7 rounded-b-lg">
                <ModelSelection
                  field={{ ...field, onChange: handleChange }}
                  fieldState={fieldState}
                  isSidebar={false}
                />
              </FieldSet>
            );
          }}
        /> */}

        {showStopButton ? (
          <Button
            className="hover:opacity-50 font-bold p-1.5 absolute bottom-1 right-0  rounded-full  disabled:cursor-not-allowed"
            type="button"
            variant={"destructive"}
            size={"icon"}
            onClick={stopStream}>
            <SquareIcon size={14} />
          </Button>
        ) : (
          <Button
            type="submit"
            variant={"ghost"}
            size={"icon"}
            disabled={loading || !form.watch("prompt")}
            className="hover:opacity-50 font-bold p-1.5 absolute bottom-1 right-0   disabled:cursor-not-allowed">
            <SendIcon size={14} />
          </Button>
        )}
      </FieldGroup>
    </form>
  );
};

export default ChatInput;

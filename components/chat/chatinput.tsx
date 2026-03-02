"use client";
import { useRef, useState } from "react";
import {
  ChatSchema,
  ChatSchemaType,
  FileSchema,
  FileSchemaType,
} from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiResponse } from "@/actions/prompt";
import { uploadFile } from "@/actions/upload";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaperclipIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Field, FieldGroup, FieldSet } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import ModelSelection from "./modelselection";
import useModel from "@/hooks/use-model";

type Props = {
  chatId: string;
};
const ChatInput = ({ chatId }: Props) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const store = useModel();

  const form = useForm<ChatSchemaType>({
    resolver: zodResolver(ChatSchema),
    defaultValues: {
      prompt: "",
      model: store.model,
      file: undefined,
    },
  });

  // Keep form model in sync when store changes (e.g., sidebar selection)

  const handleUpload = async (file: FileSchemaType) => {
    setLoading(true);
    const validatedFile = FileSchema.safeParse(file);
    if (validatedFile.error) {
      console.error(validatedFile.error.message);
      toast.error("Please ensure your file is less than 6MB");
      return null;
    }
    toast.loading("Uploading file...");

    const response = file ? await uploadFile(file) : undefined;
    if (response?.state === "ACTIVE") {
      toast.dismiss();
      toast.success("File uploaded successfully");
    } else {
      toast.error("Failed to upload file");
    }
    setLoading(false);
    return response;
  };

  const sendMessage = async (values: ChatSchemaType) => {
    try {
      setLoading(true);

      toast.loading("Sending message...");

      const { prompt, model, file } = values;

      form.reset();

      await axios.post("/api/chat/addMessage", {
        chatId,
        prompt,
        role: "user",
      });

      const response = await aiResponse(prompt, model);

      await axios.post("/api/chat/addMessage", {
        chatId,
        prompt: response,
        role: "model",
      });
    } catch (error) {
      console.error(error);
      toast.error(`${error} Failed to send message`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(sendMessage)}
      className="relative bg-transparent w-full max-w-2xl mx-auto  rounded-2xl  text-sm">
      <div className="absolute -top-15 inset-x-0 h-15 bg-linear-to-t from-white via-white/50 to-transparent pointer-events-none blur-sm" />
      <FieldGroup>
        <Controller
          control={form.control}
          name="prompt"
          render={({ field, fieldState }) => (
            <Field className=" max-w-2xl bg-slate-200 rounded-2xl p-3">
              <InputGroup className="h-auto ">
                <InputGroupTextarea
                  disabled={loading}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="block-end-input"
                  placeholder="Ask Neuralis"
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length}/100 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="model"
          render={({ field, fieldState }) => {
            const handleChange = (v: ChatSchemaType["model"]) => {
              field.onChange(v);
              store.setModel(v);
            };
            return (
              <FieldSet className="absolute bottom-1 right-18 w-6 rounded-b-lg">
                <ModelSelection
                  field={{ ...field, onChange: handleChange }}
                  fieldState={fieldState}
                  isSidebar={false}
                />
              </FieldSet>
            );
          }}
        />
        <Controller
          control={form.control}
          name="file"
          render={({ field }) => (
            <Field className="rounded-full space-y-0 absolute bottom-1 right-10 w-9 h-fit">
              <Button
                variant={"ghost"}
                size={"icon"}
                type="button"
                className="focus:outline-gray-400 focus:outline-2 focus:rounded-full  hover:bg-gray-200 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={() => fileInputRef.current?.click()}
                disabled={form.watch("model") === "gemini-2.5-flash-lite"}>
                <PaperclipIcon size={14} />
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const uploadedResult = await handleUpload(
                        e.target.files[0],
                      );
                      field.onChange(uploadedResult);
                    }
                  }}
                  disabled={
                    loading || form.watch("model") === "gemini-2.5-flash-lite"
                  }
                  className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
                  tabIndex={-1}
                />
              </Button>
            </Field>
          )}
        />

        <Button
          type="submit"
          variant={"ghost"}
          size={"icon"}
          disabled={loading}
          className="hover:opacity-50 font-bold p-1.5 absolute bottom-1 right-0  rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed">
          <SendIcon size={14} />
        </Button>
      </FieldGroup>
    </form>
  );
};

export default ChatInput;

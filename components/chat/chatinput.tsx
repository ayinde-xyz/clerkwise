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

  // const fileInputRef = useRef<HTMLInputElement>(null);

  // const removeFile = () => {
  //   form.setValue("file", undefined);
  //   setAttachedFileName(null);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };

  // Keep form model in sync when store changes (e.g., sidebar selection)

  // const handleUpload = async (file: FileSchemaType) => {
  //   setLoading(true);
  //   const validatedFile = FileSchema.safeParse(file);
  //   if (validatedFile.error) {
  //     console.error(validatedFile.error.message);
  //     toast.error("Please ensure your file is less than 6MB");
  //     return null;
  //   }
  //   toast.loading("Uploading file...");

  //   const response = file ? await uploadFile(file) : undefined;
  //   if (response?.state === "ACTIVE") {
  //     toast.dismiss();
  //     toast.success("File uploaded successfully");
  //   } else {
  //     toast.error("Failed to upload file");
  //   }
  //   setLoading(false);
  //   return response;
  // };

  // const removeFile = () => {
  //   form.setValue("file", undefined);
  //   setAttachedFileName(null);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };

  const showStopButton = loading && isStreaming;

  return (
    <form
      onSubmit={form.handleSubmit(handleSendMessage)}
      className="absolute bottom-0 left-0 right-0 bg-transparent w-full max-w-2xl mx-auto  rounded-2xl  text-sm">
      {/* Blurring design */}
      {/* <div className="absolute -top-15 inset-x-0 h-15 bg-linear-to-t from-white via-white/50 to-transparent pointer-events-none blur-sm" /> */}
      <FieldGroup className="mx-2">
        {/* File attachment chip */}
        {/* {attachedFileName && (
          <div className="absolute -top-9 left-1 z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 shadow-sm">
              <FileIcon size={12} className="text-slate-400 shrink-0" />
              <span className="max-w-45 truncate">{attachedFileName}</span>
              <button
                type="button"
                onClick={removeFile}
                className="ml-0.5 p-0.5 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600"
                aria-label="Remove file">
                <XIcon size={12} />
              </button>
            </div>
          </div>
        )} */}

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
                  placeholder="Ask Clerksmart"
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
        {/* <Controller
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
                      const selectedFile = e.target.files[0];
                      const uploadedResult = await handleUpload(selectedFile);
                      console.log(uploadedResult);
                      field.onChange(uploadedResult);
                      if (uploadedResult?.state === "ACTIVE") {
                        setAttachedFileName(selectedFile.name);
                      }
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
        /> */}

        {showStopButton ? (
          <Button
            className="hover:opacity-50 font-bold p-1.5 absolute bottom-1 right-0  rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            className="hover:opacity-50 font-bold p-1.5 absolute bottom-1 right-0  rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed">
            <SendIcon size={14} />
          </Button>
        )}
      </FieldGroup>
    </form>
  );
};

export default ChatInput;

"use client";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import {
  SendIcon,
  SquareIcon,
  Stethoscope,
  Activity,
  Baby,
  Heart,
} from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CATEGORIES = [
  {
    value: "internal_medicine",
    label: "Internal Medicine",
    icon: Stethoscope,
    description: "General medical diagnosis and treatment.",
  },
  {
    value: "surgery",
    label: "Surgery",
    icon: Activity,
    description: "Operative procedures and treatments.",
  },
  {
    value: "obstetrics_gynecology",
    label: "Obstetrics & Gynecology",
    icon: Heart,
    description: "Pregnancy, childbirth, and reproductive health.",
  },
  {
    value: "pediatrics",
    label: "Pediatrics",
    icon: Baby,
    description: "Medical care for infants and children.",
  },
] as const;

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
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const categoryValue = form.watch("category") || "internal_medicine";

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
                <InputGroupAddon
                  align="block-end"
                  className="flex justify-between pr-8 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 text-xs font-medium text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                    {(() => {
                      const cat =
                        CATEGORIES.find((c) => c.value === categoryValue) ||
                        CATEGORIES[0];
                      const Icon = cat.icon;
                      return (
                        <>
                          <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
                          <span>{cat.label}</span>
                        </>
                      );
                    })()}
                  </Button>
                  <InputGroupText
                    className={`tabular-nums  ${(field.value ?? "").trim().length > 450 ? "text-destructive" : ""}`}>
                    {(field.value ?? "").trim().length}/500 chars
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          )}
        />

        <Controller
          name="category"
          control={form.control}
          render={({ field }) => (
            <>
              {isMobile ? (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerContent className="p-4 bg-background border-t">
                    <DrawerHeader className="px-0">
                      <DrawerTitle>Select Category</DrawerTitle>
                      <DrawerDescription>
                        Choose a medical category for your query.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="py-2">
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-1 gap-4">
                        {CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <div key={cat.value} className="relative">
                              <RadioGroupItem
                                value={cat.value}
                                id={cat.value}
                                className="peer sr-only"
                              />
                              <label
                                htmlFor={cat.value}
                                className="flex flex-col items-start gap-2 rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700 peer-data-[state=checked]:border-indigo-600 dark:peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-50/20 dark:peer-data-[state=checked]:bg-indigo-950/20 cursor-pointer transition-all h-full">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-5 w-5 text-slate-500 peer-data-[state=checked]:text-indigo-600 dark:peer-data-[state=checked]:text-indigo-400" />
                                  <span className="font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                                    {cat.label}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500 dark:text-zinc-400 text-left leading-normal">
                                  {cat.description}
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>
                    <DrawerFooter className="px-0 pt-4">
                      <DrawerClose asChild>
                        <Button type="button" className="w-full">
                          Done
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent className="max-w-md bg-background border p-6">
                    <DialogHeader>
                      <DialogTitle>Select Category</DialogTitle>
                      <DialogDescription>
                        Choose a medical category for your query.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <div key={cat.value} className="relative">
                              <RadioGroupItem
                                value={cat.value}
                                id={cat.value}
                                className="peer sr-only"
                              />
                              <label
                                htmlFor={cat.value}
                                className="flex flex-col items-start gap-2 rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700 peer-data-[state=checked]:border-indigo-600 dark:peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-50/20 dark:peer-data-[state=checked]:bg-indigo-950/20 cursor-pointer transition-all h-full">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-5 w-5 text-slate-500 peer-data-[state=checked]:text-indigo-600 dark:peer-data-[state=checked]:text-indigo-400" />
                                  <span className="font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                                    {cat.label}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500 dark:text-zinc-400 text-left leading-normal">
                                  {cat.description}
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button type="button" onClick={() => setOpen(false)}>
                        Done
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </>
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

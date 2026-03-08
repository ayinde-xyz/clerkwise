import * as z from "zod";
import { FileMetadataResponse } from "@google/generative-ai/server";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Please enter a valid password" }),
});

export const SignupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  name: z.string().min(1, { message: "Please enter a valid name" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
export const ResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});
export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export const ChatSchema = z.object({
  prompt: z
    .string()
    .min(1, { message: "Please enter a valid prompt" })
    .max(100, "Description must be at most 100 characters."),
  // chatId: z.string().min(1, { message: "Please enter a valid chat ID" }),
  // model: z.string().min(1, { message: "Please enter a valid model" }),
  file: z
    .custom<FileMetadataResponse>()
    .refine((files) => files && Number(files.sizeBytes) < 7000000, {
      message: "Your file must be less than 7MB",
    })
    .optional(),
  model: z.enum([
    "gemini-3.1-pro-preview",
    "gemini-3.1-flash-lite-preview",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro",
  ]),

  // file: z.instanceof(FileMetadataResponse).optional(),
  // session: z.object({
  //   user: z.object({
  //     email: z.string().email({ message: "Please enter a valid email" }),
  //     name: z.string().min(1, { message: "Please enter a valid name" }),
  //     image: z.string().optional(),
  //   }),
  // }),
});

export const FileSchema = z
  .instanceof(File)
  .refine((files) => files && files.size < 7000000, {
    message: "Your file must be less than 7MB",
  })
  .optional();

export type SignupSchemaType = z.infer<typeof SignupSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type ResetSchemaType = z.infer<typeof ResetSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
export type ModelType = z.infer<typeof ChatSchema.shape.model>;
export type ChatSchemaType = z.infer<typeof ChatSchema>;
export type FileSchemaType = z.infer<typeof FileSchema>;

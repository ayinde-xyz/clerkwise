"use client";
import { ResetPasswordSchemaType, ResetPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { resetPassword } from "@/lib/auth-client";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({
  className,
  token,
  ...props
}: React.ComponentProps<"div"> & ResetPasswordFormProps) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = (values: ResetPasswordSchemaType) => {
    const { password } = values;

    startTransition(async () => {
      await resetPassword({
        token,
        newPassword: password,
        fetchOptions: {
          onRequest: () => {
            toast.loading("Resetting password...");
          },
          onError: (error) => {
            toast.dismiss();
            toast.error(`Error resetting password: ${error.error.message}`);
          },
          onSuccess: () => {
            toast.dismiss();
            toast.success("Password reset successfully! You can now log in.");
            router.push("/auth/login");
          },
        },
      });
    });
  };
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
            Reset your Password
          </h1>
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            Please enter your new password to continue
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="password" className="text-gray-700 dark:text-zinc-300">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Enter your new password"
                      required
                      className="border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 focus:bg-white dark:focus:bg-zinc-950 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel
                    htmlFor="confirmPassword"
                    className="text-gray-700 dark:text-zinc-300">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      required
                      className="border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 focus:bg-white dark:focus:bg-zinc-950 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-semibold disabled:cursor-not-allowed transition-all duration-300">
              {loading && <Loader2 className="animate-spin" size={14} />}
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

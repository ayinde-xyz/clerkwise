"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResetSchema, ResetSchemaType } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/lib/auth-client";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ResetSchemaType>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (values: ResetSchemaType) => {
    const { email } = values;

    startTransition(async () => {
      await requestPasswordReset({
        email,
        redirectTo: "/auth/reset-password",
        fetchOptions: {
          onRequest: () => {
            toast.loading("Sending password reset email...");
          },
          onError: (error) => {
            toast.dismiss();
            toast.error(
              `Error sending password reset email: ${error.error.message}`,
            );
          },
          onSuccess: () => {
            toast.dismiss();
            toast.success(
              "Password reset email sent! Please check your inbox.",
            );
            router.push("/auth/forgot-password/success");
          },
        },
      });
    });
  };
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Forgot your Password?
          </h1>
          <p className="text-sm text-gray-600">
            Send a reset email to your email address
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="email" className="text-gray-700">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="border border-gray-200 bg-white/50 focus:bg-white transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold disabled:cursor-not-allowed transition-all duration-300">
              {loading && <Loader2 className="animate-spin" size={14} />}
              {loading ? "Sending..." : "Send Reset Email"}
            </Button>

            <div className="text-center text-xs text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors">
                Log in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

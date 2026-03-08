"use client";
import { cn } from "@/lib/utils";
import { LoginSchema, LoginSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "../ui/card";
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
import { Social } from "./social";
import Link from "next/link";
import { signInEmailAction } from "@/actions/login";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: LoginSchemaType) => {
    toast.loading("Logging in...");

    startTransition(async () => {
      const { error } = await signInEmailAction(values);

      if (error) {
        toast.dismiss();
        toast.error(error);
      } else {
        toast.dismiss();
        toast.success("Logged in successfully!");
        router.replace("/chat");
      }
    });
  };
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-600">Log in to your account</p>
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
                      className="border border-gray-200 bg-white/50 focus:bg-white transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <div className="flex items-center">
                    <FormLabel htmlFor="password" className="text-gray-700">
                      Password
                    </FormLabel>
                    <Link
                      href="/auth/forgot-password"
                      className="ml-auto text-xs text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline transition-colors">
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="***********"
                      className="border border-gray-200 bg-white/50 focus:bg-white transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold disabled:cursor-not-allowed transition-all duration-300">
              {isPending && <Loader2 className="animate-spin" size={14} />}
              {isPending ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </Form>
        <div className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-200">
          <span className="relative z-10 bg-white/60 px-2 text-gray-600">
            Or continue with
          </span>
        </div>
        <Social />
        <div className="text-center text-xs text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

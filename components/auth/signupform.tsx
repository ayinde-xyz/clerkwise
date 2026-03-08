"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Social } from "./social";
import { SignupSchema, SignupSchemaType } from "@/schemas";
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
import { signupEmailAction } from "@/actions/signup";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, startLoading] = useTransition();
  const router = useRouter();

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });
  const onSubmit = (values: SignupSchemaType) => {
    startLoading(async () => {
      toast.loading("Signing up...");
      const { error, success } = await signupEmailAction(values);
      console.log(error);

      if (error) {
        toast.dismiss();
        toast.error(error);
      } else {
        toast.dismiss();
        toast.success("Registration Complete, Please verify your email");
        router.push("/auth/signup/success");
      }
    });
  };
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-sm text-gray-600">Sign up to your account</p>
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="name" className="text-gray-700">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
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
                  <FormLabel htmlFor="password" className="text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="***********"
                      required
                      className="border border-gray-200 bg-white/50 focus:bg-white transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold disabled:cursor-not-allowed transition-all duration-300">
              {loading && <Loader2 className="animate-spin" size={14} />}
              {loading ? "Signing up..." : "Sign up"}
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
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

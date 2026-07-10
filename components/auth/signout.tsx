"use client";
import { deleteUser, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { LogOut, UserX } from "lucide-react";

export const SignOut = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    startTransition(async () => {
      await signOut({
        fetchOptions: {
          onRequest: () => {
            toast.loading("Signing out...");
          },
          onError: (error) => {
            toast.dismiss();
            toast.error(`Error signing out: ${error.error.message}`);
          },
          onSuccess: () => {
            toast.dismiss();
            toast.success("Signed out successfully!");
            router.replace("/auth/login");
          },
        },
      });
    });
  };

  return (
    <Button
      variant="ghost"
      disabled={isPending}
      onClick={handleSignOut}
      className="w-full justify-start text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors gap-2 h-9 px-3">
      <LogOut className="h-4 w-4" />
      <span>Log out</span>
    </Button>
  );
};

export const DeleteAccount = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    await deleteUser({
      callbackURL: "/auth/delete/success",
      fetchOptions: {
        onRequest: () => {
          setIsDeleting(true);
          toast.loading("Deleting account...");
        },
        onError: (error) => {
          setIsDeleting(false);
          toast.dismiss();
          toast.error(`Error deleting account: ${error.error.message}`);
        },
        onSuccess: () => {
          setIsDeleting(false);
          toast.dismiss();
          toast.success("Check your email to confirm account deletion.");
        },
      },
    });
  };

  return (
    <Button
      variant="ghost"
      disabled={isDeleting}
      onClick={handleDeleteAccount}
      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors gap-2 h-9 px-3">
      <UserX className="h-4 w-4" />
      <span>Delete Account</span>
    </Button>
  );
};

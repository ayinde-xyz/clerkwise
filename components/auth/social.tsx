"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { APIError } from "better-auth";
import {
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaSpotify,
  FaTiktok,
} from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import { toast } from "sonner";
// import { onClick } from "@/actions/social-login";

export const Social = () => {
  const onClick = async (
    provider:
      | "google"
      | "spotify"
      | "facebook"
      | "linkedin"
      | "instagram"
      | "tiktok",
  ) => {
    try {
      toast.loading("Signing in...");
      const result = await signIn.social({
        provider,
        callbackURL: "/chat",
      });

      if (result.error) {
        toast.dismiss();
        toast.error(result.error.message || "Something went wrong");
        return;
      }

      toast.dismiss();
      toast.success("Signed in successfully!");
    } catch (err) {
      if (err instanceof APIError) {
        toast.error(err.message);
      }

      toast.error("Something went wrong");
    }
  };
  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        onClick={() => {
          onClick("spotify");
        }}
        variant="outline"
        disabled
        className="w-full">
        <FaSpotify />
        <span className="sr-only">Login with Spotify</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => onClick("google")}
        className="w-full">
        <FaGoogle />
        <span className="sr-only">Login with Google</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => onClick("facebook")}
        className="w-full">
        <FaMeta />
        <span className="sr-only">Login with Meta</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => onClick("linkedin")}
        disabled
        className="w-full">
        <FaLinkedin />
        <span className="sr-only">Login with Linkedin</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => onClick("instagram")}
        disabled
        className="w-full">
        <FaInstagram />
        <span className="sr-only">Login with Instagram</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => onClick("tiktok")}
        disabled
        className="w-full">
        <FaTiktok />
        <span className="sr-only">Login with Tiktok</span>
      </Button>
    </div>
  );
};

// IGAAUe5LLtekVBZAE41WFRRYm84VzY1blJfbVl4YkFOVE52LTQwMzFrTU92djdZAQXZAWbWw5NVZApYmhnU2ZAVMnYwaEh5Vmo3VUhaTmJNYzF3QzVKcmhIdWstVXJja1pNeExyWmhIUTNWbGRyYjRFTGtRdTRXUFVBSXk5SXRBUXI0TQZDZD

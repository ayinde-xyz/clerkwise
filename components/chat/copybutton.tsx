"use client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";

const CopyButton = ({ text }: { text: string }) => {
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
      }}
      className="rounded-full focus:border-2 focus:bg-transparent focus:border-black">
      <Copy size={16} />
    </Button>
  );
};

export default CopyButton;

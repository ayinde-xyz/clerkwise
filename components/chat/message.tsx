import { RotateCwIcon } from "lucide-react";
import { Button } from "../ui/button";
import CopyButton from "./copybutton";
import { Message as MessageType } from "@/drizzle/schema";

type Props = {
  message: MessageType;
  retrySendMessage?: (message: MessageType) => Promise<Response | undefined>;
};

const Message = ({ message, retrySendMessage }: Props) => {
  const isModel = message.role === "model";

  if (!message.success) {
    return (
      <div className={`py-5 flex ${isModel ? "justify-end" : "justify-start"}`}>
        <div className="flex space-x-5 md:px-10 px-4 max-w-2xl">
          <div
            className={`p-3 text-sm whitespace-pre-wrap rounded-2xl bg-slate-300 ${
              isModel &&
              "order-first bg-linear-to-bl   from-sky-500 to-indigo-500"
            }`}>
            <p>{message.content}</p>
            {!isModel && (
              <div className="mt-2 text-xs text-red-500">
                Failed to send message. Please try again.
              </div>
            )}
            {isModel && <CopyButton text={message.content} />}
            {!isModel && (
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => retrySendMessage?.(message)}>
                <RotateCwIcon />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-5 flex ${isModel ? "justify-end" : "justify-start"}`}>
      <div className="flex space-x-5 md:px-10 px-4 max-w-2xl">
        <div
          className={`p-3 text-sm whitespace-pre-wrap rounded-2xl bg-slate-300 ${
            isModel &&
            "order-first bg-linear-to-bl   from-sky-500 to-indigo-500"
          }`}>
          <p>{message.content}</p>
          {isModel && <CopyButton text={message.content} />}
        </div>
      </div>
    </div>
  );
};

export default Message;

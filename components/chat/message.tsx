import CopyButton from "./copybutton";
import { Message as MessageType } from "@/drizzle/schema";

type Props = {
  message: MessageType;
};

const Message = ({ message }: Props) => {
  const isModel = message.role === "model";

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

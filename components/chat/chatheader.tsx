"use client";
import { ChevronRightIcon } from "lucide-react";
import ToggleButton from "./togglebutton";
import { Message } from "@/drizzle/schema";
import { useEffect, useRef, useState } from "react";

interface ChatHeaderProps {
  messages?: Message[];
  showHeader?: boolean;
}

const ChatHeader = ({ messages, showHeader }: ChatHeaderProps) => {
  // const [isVisible, setIsVisible] = useState(true);

  // let lastScrollY = 0;
  // const lastScrollY = useRef(0);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > lastScrollY.current) {
  //       // Scrolling down
  //       setIsVisible(false);
  //     } else {
  //       // Scrolling up
  //       setIsVisible(true);
  //     }
  //     lastScrollY.current = window.scrollY;
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [lastScrollY]);
  return (
    <div
      className={`w-full h-10 border-b space-x-2 border-gray-300/30  backdrop-blur-sm backdrop-contrast flex items-center sticky top-0 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
      <ToggleButton />
      <ChevronRightIcon />
      <h1 className="text-slate-800">
        {messages ? messages[0]?.content : "New Chat"}{" "}
      </h1>
    </div>
  );
};

export default ChatHeader;

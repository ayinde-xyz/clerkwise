import React from "react";
import ToggleButton from "@/components/chat/togglebutton";
import { ChevronRightIcon } from "lucide-react";

export default function ChatLoading() {
  return (
    <div className="flex flex-col overflow-hidden w-full h-screen bg-slate-50 dark:bg-zinc-950">
      {/* ChatHeader Skeleton */}
      <div className="w-full h-10 border-b space-x-2 border-gray-300 flex items-center px-4 bg-white dark:bg-zinc-900">
        <ToggleButton />
        <ChevronRightIcon className="text-gray-400" />
        <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
      </div>

      {/* Messages Scroll Area Skeleton */}
      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 space-y-6">
        {/* User Message (Right Side) */}
        <div className="py-5 flex justify-start">
          <div className="flex space-x-5 md:px-10 px-4 max-w-2xl w-full">
            <div className="p-3 w-48 h-10 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          </div>
        </div>

        {/* Model Response (Right Side / Blue-violet gradient color) */}
        <div className="py-5 flex justify-end">
          <div className="flex space-x-5 md:px-10 px-4 max-w-2xl w-full justify-end">
            <div className="p-3 w-80 h-24 bg-indigo-200 dark:bg-indigo-950/40 rounded-2xl animate-pulse" />
          </div>
        </div>

        {/* User Message */}
        <div className="py-5 flex justify-start">
          <div className="flex space-x-5 md:px-10 px-4 max-w-2xl w-full">
            <div className="p-3 w-64 h-12 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          </div>
        </div>

        {/* Model Response */}
        <div className="py-5 flex justify-end">
          <div className="flex space-x-5 md:px-10 px-4 max-w-2xl w-full justify-end">
            <div className="p-3 w-96 h-32 bg-indigo-200 dark:bg-indigo-950/40 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* ChatInput Skeleton */}
      <div className="p-4 bg-transparent w-full max-w-2xl mx-auto mb-4">
        <div className="max-w-2xl bg-slate-200 dark:bg-zinc-800 rounded-2xl p-3 h-16 animate-pulse" />
      </div>
    </div>
  );
}

import React from "react";
import type { Message } from "../types/chat";

interface MessageBubbleProps {
  message: Message;
  isDarkMode: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isDarkMode,
}) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-3.5 py-2.5 rounded-lg ${
          isUser
            ? isDarkMode
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white"
            : isDarkMode
              ? "bg-gray-800 text-gray-100 border border-gray-700"
              : "bg-gray-100 text-gray-900 border border-gray-200"
        }`}
      >
        <p className="break-words text-sm">{message.content}</p>
        <span
          className={`text-xs mt-1 block ${
            isUser
              ? "text-blue-100"
              : isDarkMode
                ? "text-gray-400"
                : "text-gray-600"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

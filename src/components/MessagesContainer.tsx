import React, { useRef, useEffect } from "react";
import type { Message } from "../types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
  isDarkMode: boolean;
}

export const MessagesContainer: React.FC<MessagesContainerProps> = ({
  messages,
  isLoading,
  isDarkMode,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`flex-1 overflow-y-auto p-5 space-y-3 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-5xl mb-4">💬</div>
            <p
              className={`text-xl font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Welcome to AIChat
            </p>
            <p
              className={`text-sm mt-2 ${
                isDarkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Start a conversation by typing a message
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isDarkMode={isDarkMode}
            />
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div
                className={`${isDarkMode ? "bg-gray-700" : "bg-gray-200"} rounded-lg px-4 py-3`}
              >
                <div className="flex gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-gray-400" : "bg-gray-500"} animate-bounce`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-gray-400" : "bg-gray-500"} animate-bounce delay-100`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-gray-400" : "bg-gray-500"} animate-bounce delay-200`}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

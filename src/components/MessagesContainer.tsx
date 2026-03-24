import React, { useRef, useEffect } from "react";
import type { Message } from "../types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
  isLoadingHistory?: boolean;
}

export const MessagesContainer: React.FC<MessagesContainerProps> = ({
  messages,
  isLoading,
  isLoadingHistory = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-24 xl:px-32 space-y-3 bg-transparent scrollbar-thin">
      {isLoadingHistory ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="flex gap-1 justify-center mb-4">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
            </div>
            <p className="text-sm text-gray-500">Loading messages...</p>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-xl font-medium text-gray-600">
              Welcome to BLVChat
            </p>
            <p className="text-sm mt-2 text-gray-500">
              Start a conversation by typing a message
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble
              key={`${message.role}-${message.timestamp.getTime()}-${message.content.slice(0, 20)}`}
              message={message}
            />
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="bg-gray-200 rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200" />
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

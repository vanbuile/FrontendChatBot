import React, { useRef, useEffect } from "react";
import type { Message } from "../types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
  isLoadingHistory?: boolean;
  hasMoreHistory?: boolean;
  isLoadingOlderMessages?: boolean;
  onLoadOlderMessages?: () => Promise<void>;
}

export const MessagesContainer: React.FC<MessagesContainerProps> = ({
  messages,
  isLoading,
  isLoadingHistory = false,
  hasMoreHistory = false,
  isLoadingOlderMessages = false,
  onLoadOlderMessages,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousLastMessageKeyRef = useRef<string | null>(null);

  const currentLastMessageKey =
    messages.length > 0
      ? `${messages[messages.length - 1].role}-${messages[messages.length - 1].timestamp.getTime()}-${messages[messages.length - 1].content}`
      : null;

  // Auto-scroll only when the latest message changes.
  useEffect(() => {
    if (
      currentLastMessageKey &&
      currentLastMessageKey !== previousLastMessageKeyRef.current
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    previousLastMessageKeyRef.current = currentLastMessageKey;
  }, [currentLastMessageKey]);

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    if (!onLoadOlderMessages || !hasMoreHistory || isLoadingOlderMessages) {
      return;
    }

    const container = event.currentTarget;
    if (container.scrollTop > 8) {
      return;
    }

    const previousScrollHeight = container.scrollHeight;
    await onLoadOlderMessages();

    requestAnimationFrame(() => {
      const activeContainer = scrollContainerRef.current;
      if (!activeContainer) {
        return;
      }

      const nextScrollHeight = activeContainer.scrollHeight;
      activeContainer.scrollTop = nextScrollHeight - previousScrollHeight;
    });
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-24 xl:px-32 space-y-3 bg-transparent scrollbar-thin"
    >
      {isLoadingHistory ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="flex gap-1 justify-center mb-4">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
            </div>
            <p className="text-sm text-gray-500">
              Loading messages...Waiting a minute to wake up server.
            </p>
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
          {isLoadingOlderMessages && (
            <div className="flex justify-center py-4">
              <div className="flex gap-1 items-center bg-gradient-to-r from-gray-100 to-gray-50 rounded-full px-4 py-2 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-200" />
              </div>
            </div>
          )}
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

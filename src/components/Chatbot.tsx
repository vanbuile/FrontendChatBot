import React from "react";
import { useChat } from "../hooks/useChat";
import { ChatInput } from "./ChatInput";
import { Header } from "./Header";
import { Layout } from "./Layout";
import { MessagesContainer } from "./MessagesContainer";

interface ChatbotProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  isDarkMode,
  onToggleDarkMode,
}) => {
  const { messages, isLoading, addMessage } = useChat();

  const handleSend = (message: string, files?: File[]) => {
    addMessage("user", message, files);
  };

  return (
    <Layout isDarkMode={isDarkMode}>
      {/* Header */}
      <Header isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />

      {/* Messages Container */}
      <MessagesContainer
        messages={messages}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
      />

      {/* Input Area */}
      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
      />
    </Layout>
  );
};

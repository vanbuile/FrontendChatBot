import React from "react";
import { useChat } from "../hooks/useChat";
import { ChatInput } from "./ChatInput";
import { Header } from "./Header";
import { Layout } from "./Layout";
import { MessagesContainer } from "./MessagesContainer";

export const Chatbot: React.FC = () => {
  const {
    messages,
    isLoading,
    isLoadingHistory,
    isLoadingOlderMessages,
    hasMoreHistory,
    addMessage,
    loadOlderMessages,
  } = useChat();

  const handleSend = (message: string, files?: File[]) => {
    addMessage("user", message, files);
  };

  return (
    <Layout>
      {/* Header */}
      <Header />

      {/* Messages Container */}
      <MessagesContainer
        messages={messages}
        isLoading={isLoading}
        isLoadingHistory={isLoadingHistory}
        hasMoreHistory={hasMoreHistory}
        isLoadingOlderMessages={isLoadingOlderMessages}
        onLoadOlderMessages={loadOlderMessages}
      />

      {/* Input Area */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </Layout>
  );
};

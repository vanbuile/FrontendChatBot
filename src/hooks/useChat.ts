import { useState, useCallback } from 'react';
import type { Message } from '../types/chat';
import { sendChatMessage } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback(
    async (role: 'user' | 'assistant', content: string, attachments?: File[]) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        role,
        content,
        timestamp: new Date(),
        attachments,
      };

      setMessages((prev) => [...prev, newMessage]);

      // Only call API for user messages
      if (role === 'user') {
        setIsLoading(true);
        
        try {
          // Call your backend API
          const response = await sendChatMessage(content, attachments);

          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.reply,
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
          console.error('Error sending message:', error);
          
          // Show error message
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Sorry, there was an error processing your message. Please try again.',
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, addMessage, clearMessages };
};

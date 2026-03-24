import { useState, useCallback, useEffect } from 'react';
import type { Message } from '../types/chat';
import { getChatHistory, sendChatMessage } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory();
        if (!Array.isArray(history.messages) || history.messages.length === 0) {
          return;
        }

        setMessages(history.messages);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadHistory();
  }, []);

  const addMessage = useCallback(
    async (role: 'user' | 'assistant', content: string, attachments?: File[]) => {
      if (role !== 'user') {
        return;
      }

      const newMessage: Message = {
        content,
        role: 'user',
        timestamp: new Date(),
        attachments: attachments?.map((file) => ({
          name: file.name,
          file,
          mimeType: file.type,
          size: file.size,
        })),
      };

      setMessages((prev) => [...prev, newMessage]);

      // Only call API for user messages
      setIsLoading(true);
      
      try {
        // Call your backend API
        const response = await sendChatMessage(newMessage);
        const botResponse: Message = response.message;
        
        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error('Error sending message:', error);
        
        // Show error message
        const errorMessage: Message = {
          content: 'Sorry, there was an error processing your message. Please try again.',
          role: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, addMessage, clearMessages };
};

import { useState, useCallback, useEffect } from 'react';
import type { Message } from '../types/chat';
import { getChatHistory, sendChatMessage } from '../services/api';

const buildMessageKey = (message: Message) =>
  `${message.role}-${message.timestamp.getTime()}-${message.content}`;

const mergeUniqueMessages = (base: Message[], incoming: Message[]) => {
  const seen = new Set(base.map((message) => buildMessageKey(message)));
  const appended = incoming.filter((message) => {
    const key = buildMessageKey(message);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  return [...base, ...appended];
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [nextBefore, setNextBefore] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory();
        if (!Array.isArray(history.messages)) {
          return;
        }

        setMessages(history.messages);
        setHasMoreHistory(history.hasMore);
        setNextBefore(history.nextBefore);
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsLoadingHistory(false);
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
    setHasMoreHistory(false);
    setNextBefore(null);
  }, []);

  const loadOlderMessages = useCallback(async () => {
    if (isLoadingOlderMessages || !hasMoreHistory || !nextBefore) {
      return;
    }

    setIsLoadingOlderMessages(true);

    try {
      const history = await getChatHistory({ before: nextBefore });
      if (!Array.isArray(history.messages) || history.messages.length === 0) {
        setHasMoreHistory(history.hasMore);
        setNextBefore(history.nextBefore);
        return;
      }

      setMessages((prev) => {
        const merged = mergeUniqueMessages(history.messages, prev);
        return merged.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      });
      setHasMoreHistory(history.hasMore);
      setNextBefore(history.nextBefore);
    } catch (error) {
      console.error('Error loading older messages:', error);
    } finally {
      setIsLoadingOlderMessages(false);
    }
  }, [hasMoreHistory, isLoadingOlderMessages, nextBefore]);

  return {
    messages,
    isLoading,
    isLoadingHistory,
    isLoadingOlderMessages,
    hasMoreHistory,
    addMessage,
    clearMessages,
    loadOlderMessages,
  };
};

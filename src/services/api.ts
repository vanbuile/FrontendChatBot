/**
 * API Service for Chatbot
 * 
 * This file handles all communication with your backend API.
 * Configure your API endpoint in .env file (VITE_API_URL)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ChatResponse {
  reply: string;
  success: boolean;
  error?: string;
}

/**
 * Send a message to the chatbot API
 */
export const sendChatMessage = async (
  message: string,
  attachments?: File[]
): Promise<ChatResponse> => {
  try {
    const formData = new FormData();
    formData.append('message', message);

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, browser will set it automatically with boundary
        // 'Authorization': `Bearer ${token}` // Add if you need authentication
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to send message:', error);
    return {
      success: false,
      reply: 'Sorry, I could not process your message. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Get chat history
 */
export const getChatHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // Add if needed
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return { messages: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Clear chat history
 */
export const clearChatHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // Add if needed
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to clear history:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

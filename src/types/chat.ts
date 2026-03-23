export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: File[];
  isLoading?: boolean;
}

export interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  isDarkMode: boolean;
  addMessage: (role: 'user' | 'assistant', content: string, attachments?: File[]) => void;
  clearMessages: () => void;
  toggleDarkMode: () => void;
}

export interface MessageAttachment {
  name: string;
  file?: File;
  url?: string;
  mimeType?: string;
  size?: number;
}

export interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  attachments?: MessageAttachment[];
}

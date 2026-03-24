/**
 * API Service for Chatbot
 * 
 * This file handles all communication with your backend API.
 * Configure your API endpoint in .env file (VITE_API_URL)
 */
import type { Message, MessageAttachment } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Keep one stable session id for the current browser tab/session.
const SESSION_ID =
  sessionStorage.getItem('chat_session_id') ||
  `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
sessionStorage.setItem('chat_session_id', SESSION_ID);

const ATTACHMENT_URL_KEYS = ['url', 'fileUrl', 'downloadUrl', 'path', 'src', 'href'];
const ATTACHMENT_NAME_KEYS = ['name', 'fileName', 'filename', 'originalName', 'title'];
const ATTACHMENT_MIME_KEYS = ['mimeType', 'contentType', 'fileType', 'type'];

const toNonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const getFirstString = (source: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const matched = toNonEmptyString(source[key]);
    if (matched) {
      return matched;
    }
  }
  return undefined;
};

const resolveAttachmentUrl = (rawUrl: string): string => {
  try {
    return new URL(rawUrl, API_BASE_URL).toString();
  } catch {
    return rawUrl;
  }
};

const getFileNameFromUrl = (url: string): string | undefined => {
  try {
    const parsed = new URL(url, API_BASE_URL);
    const rawName = parsed.pathname.split('/').filter(Boolean).pop();
    if (!rawName) {
      return undefined;
    }
    return decodeURIComponent(rawName);
  } catch {
    const fallback = url.split('/').filter(Boolean).pop();
    return fallback ? decodeURIComponent(fallback) : undefined;
  }
};

const normalizeAttachment = (raw: unknown): MessageAttachment | null => {
  if (typeof raw === 'string') {
    const sourceUrl = toNonEmptyString(raw);
    if (!sourceUrl) {
      return null;
    }

    const resolvedUrl = resolveAttachmentUrl(sourceUrl);
    return {
      name: getFileNameFromUrl(resolvedUrl) ?? 'FILE',
      url: resolvedUrl,
    };
  }

  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const source = raw as Record<string, unknown>;
  const sourceUrl = getFirstString(source, ATTACHMENT_URL_KEYS);
  const resolvedUrl = sourceUrl ? resolveAttachmentUrl(sourceUrl) : undefined;
  const name =
    getFirstString(source, ATTACHMENT_NAME_KEYS) ??
    (resolvedUrl ? getFileNameFromUrl(resolvedUrl) : undefined) ??
    'FILE';
  const mimeType = getFirstString(source, ATTACHMENT_MIME_KEYS);
  const rawSize = source.size;
  const size = typeof rawSize === 'number' ? rawSize : undefined;

  if (!resolvedUrl && !name) {
    return null;
  }

  return {
    name,
    url: resolvedUrl,
    mimeType,
    size,
  };
};

const normalizeAttachmentCollection = (rawCollection: unknown): MessageAttachment[] => {
  if (!rawCollection) {
    return [];
  }

  const list = Array.isArray(rawCollection) ? rawCollection : [rawCollection];
  return list
    .map((item) => normalizeAttachment(item))
    .filter((item): item is MessageAttachment => Boolean(item));
};

const pickAttachments = (source: Record<string, unknown>, keys: string[]): MessageAttachment[] => {
  for (const key of keys) {
    const normalized = normalizeAttachmentCollection(source[key]);
    if (normalized.length > 0) {
      return normalized;
    }
  }
  return [];
};

const toBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
  }

  return undefined;
};


/**
 * Send a message to the chatbot API
 */
export const sendChatMessage = async (
  message: Message
): Promise<{ message: Message; success: boolean; sessionId?: string; error?: string }> => {
  try {
    const formData = new FormData();

    // Main fields expected by new backend schema.
    formData.append('sessionId', SESSION_ID);
    formData.append('content', message.content);
    formData.append('role', message.role);
    formData.append('timestamp', message.timestamp.toISOString());

    // Backward compatibility for backends still reading legacy field names.
    formData.append('userMessage', message.content);
    formData.append('message', message.content);

    // Send file binaries so backend can process them.
    (message.attachments ?? []).forEach((attachment) => {
      if (attachment.file) {
        formData.append('files', attachment.file, attachment.file.name);
      }
    });

    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData; browser sets multipart boundary.
        // 'Authorization': `Bearer ${token}` // Add if you need authentication
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const payload = data as {
      success?: boolean;
      reply?: string;
      botMessage?: string;
      sessionId?: string;
      message?: {
        sessionId?: string;
        content?: string;
        role?: 'user' | 'assistant';
        timestamp?: string;
        botMessage?: string;
      };
      data?: {
        message?: {
          sessionId?: string;
          content?: string;
          role?: 'user' | 'assistant';
          timestamp?: string;
          botMessage?: string;
        };
        botMessage?: string;
        sessionId?: string;
      };
      error?: string;
    };
    const nestedMessage = payload.data?.message ?? payload.message;

    const reply =
      nestedMessage?.content ??
      nestedMessage?.botMessage ??
      payload.data?.botMessage ??
      payload.botMessage ??
      payload.reply ??
      'Sorry, I could not process your message. Please try again.';

    return {
      success: payload.success ?? Boolean(reply),
      message: {
        content: reply,
        role: nestedMessage?.role ?? 'assistant',
        timestamp: nestedMessage?.timestamp ? new Date(nestedMessage.timestamp) : new Date(),
      },
      sessionId: nestedMessage?.sessionId ?? payload.data?.sessionId ?? payload.sessionId ?? SESSION_ID,
      error: payload.error,
    };
  } catch (error) {
    console.error('Failed to send message:', error);
    return {
      success: false,
      message: {
        content: 'Sorry, I could not process your message. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Get chat history
 */
export const getChatHistory = async (params?: {
  sessionId?: string;
  page?: number;
  limit?: number;
  before?: string;
}) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.sessionId ?? SESSION_ID) {
      searchParams.set('sessionId', params?.sessionId ?? SESSION_ID);
    }
    if (typeof params?.page === 'number') {
      searchParams.set('page', String(params.page));
    }
    if (typeof params?.limit === 'number') {
      searchParams.set('limit', String(params.limit));
    }
    if (params?.before) {
      searchParams.set('before', params.before);
    }

    const query = searchParams.toString();
    const url = query ? `${API_BASE_URL}/messages?${query}` : `${API_BASE_URL}/messages`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // Add if needed
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      messages?: Array<Record<string, unknown>>;
      hasMore?: boolean | string;
      nextBefore?: string;
      data?: {
        messages?: Array<Record<string, unknown>>;
        hasMore?: boolean | string;
        nextBefore?: string;
      };
    };

    const sourceMessages =
      (Array.isArray(data.data?.messages) ? data.data?.messages : undefined) ??
      (Array.isArray(data.messages) ? data.messages : []);
    const normalizedMessages: Message[] = [];

    sourceMessages.forEach((item) => {
      const timestampValue = toNonEmptyString(item.timestamp) ?? toNonEmptyString(item.createdAt);
      const baseTs = timestampValue;
      const parsedTimestamp = baseTs ? new Date(baseTs) : new Date();

      const sharedAttachments = pickAttachments(item, ['attachments', 'files', 'fileUrls', 'urls']);
      const pickedUserAttachments = pickAttachments(item, ['userAttachments', 'userFiles', 'userFileUrls']);
      const userAttachments = pickedUserAttachments.length > 0 ? pickedUserAttachments : sharedAttachments;
      const botAttachments = pickAttachments(item, ['botAttachments', 'botFiles', 'botFileUrls']);

      const content = toNonEmptyString(item.content);
      const role = item.role === 'user' || item.role === 'assistant' ? item.role : undefined;
      const userMessage = toNonEmptyString(item.userMessage);
      const botMessage = toNonEmptyString(item.botMessage);

      if (content && role) {
        normalizedMessages.push({
          content,
          role,
          timestamp: parsedTimestamp,
          attachments: sharedAttachments.length > 0 ? sharedAttachments : undefined,
        });
        return;
      }

      if (userMessage) {
        normalizedMessages.push({
          content: userMessage,
          role: 'user',
          timestamp: parsedTimestamp,
          attachments: userAttachments.length > 0 ? userAttachments : undefined,
        });
      }

      if (botMessage) {
        normalizedMessages.push({
          content: botMessage,
          role: 'assistant',
          timestamp: parsedTimestamp,
          attachments: botAttachments.length > 0 ? botAttachments : undefined,
        });
      }
    });

    normalizedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return {
      messages: normalizedMessages,
      hasMore: toBoolean(data.data?.hasMore ?? data.hasMore) ?? false,
      nextBefore: toNonEmptyString(data.data?.nextBefore ?? data.nextBefore) ?? null,
    };
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return {
      messages: [],
      hasMore: false,
      nextBefore: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Clear chat history
 */
export const clearChatHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
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

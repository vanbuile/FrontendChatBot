import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Message } from "../types/chat";

interface MessageBubbleProps {
  message: Message;
}

interface AttachmentPreview {
  id: string;
  name: string;
  isImage: boolean;
  previewUrl?: string;
  objectUrlToRevoke?: string;
}

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "avif",
  "heic",
  "heif",
]);

const getFileExtension = (fileName: string): string => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
};

const isImageAttachment = (
  mimeType?: string,
  fileName?: string,
  url?: string,
) => {
  if (mimeType?.toLowerCase().startsWith("image/")) {
    return true;
  }

  const extension =
    getFileExtension(fileName ?? "") || getFileExtension(url ?? "");
  return IMAGE_EXTENSIONS.has(extension);
};

const getNameFromUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return decodeURIComponent(
      parsed.pathname.split("/").filter(Boolean).pop() ?? "FILE",
    );
  } catch {
    return decodeURIComponent(url.split("/").filter(Boolean).pop() ?? "FILE");
  }
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const [attachmentPreviews, setAttachmentPreviews] = useState<
    AttachmentPreview[]
  >([]);

  useEffect(() => {
    const attachments = message.attachments ?? [];

    const previews = attachments.map((attachment, index) => {
      const file = attachment.file;
      const attachmentUrl = attachment.url;
      const attachmentName =
        attachment.name ||
        file?.name ||
        (attachmentUrl ? getNameFromUrl(attachmentUrl) : "FILE");
      const image = isImageAttachment(
        attachment.mimeType ?? file?.type,
        attachmentName,
        attachmentUrl,
      );
      const localPreviewUrl =
        file && image ? URL.createObjectURL(file) : undefined;

      return {
        id: `${attachmentName}-${attachmentUrl ?? "local"}-${index}`,
        name: attachmentName,
        isImage: image,
        previewUrl: localPreviewUrl ?? (image ? attachmentUrl : undefined),
        objectUrlToRevoke: localPreviewUrl,
      };
    });

    setAttachmentPreviews(previews);

    return () => {
      previews.forEach((item) => {
        if (item.objectUrlToRevoke) {
          URL.revokeObjectURL(item.objectUrlToRevoke);
        }
      });
    };
  }, [message.attachments]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="w-4/5 px-1 py-1 text-gray-900 my-5">
        {isUser && attachmentPreviews.length > 0 && (
          <div className="mb-2.5 flex flex-wrap justify-end gap-2">
            {attachmentPreviews.map((item) => (
              <div
                key={item.id}
                className="w-32 h-32 rounded-lg overflow-hidden border border-blue-200 bg-blue-50"
                title={item.name}
              >
                {item.isImage && item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full p-1.5 flex flex-col items-center justify-center text-center">
                    <div className="text-[10px] px-1 py-0.5 rounded bg-blue-100 text-blue-700">
                      {item.name.split(".").pop()?.toUpperCase() || "FILE"}
                    </div>
                    <p className="text-[10px] mt-1 leading-tight break-all text-blue-800">
                      {item.name}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          className={`text-lg break-words prose prose-sm max-w-none ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

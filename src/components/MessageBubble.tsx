import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FiCopy, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import remarkGfm from "remark-gfm";
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
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likeState, setLikeState] = useState<"none" | "like" | "dislike">(
    "none",
  );

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy message");
    }
  };

  const handleLike = () => {
    setLikeState(likeState === "like" ? "none" : "like");
  };

  const handleDislike = () => {
    setLikeState(likeState === "dislike" ? "none" : "dislike");
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="w-4/5 px-1 py-1 text-gray-900 my-5 relative"
        onMouseEnter={() => !isUser && setIsHovered(true)}
        onMouseLeave={() => !isUser && setIsHovered(false)}
      >
        {/* Chatbot Name Header with Action Card */}
        {!isUser && (
          <div className="mb-2.5 relative inline-block px-4 pt-3">
            <div className="text-[13px] font-semibold tracking-tight text-slate-600">
              Template.net
            </div>

            {isHovered && (
              <div className="absolute left-24 bottom-0 flex gap-1 bg-white border border-slate-200 rounded-full shadow-md p-1 animate-in fade-in duration-200 whitespace-nowrap">
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  title={copied ? "Copied!" : "Copy"}
                  className="p-2 rounded-full hover:bg-gray-100 transition text-gray-900 cursor-pointer relative"
                >
                  <FiCopy size={16} />

                  {/* Copy Toast Notification */}
                  {copied && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in duration-200">
                      Đã copy!
                    </div>
                  )}
                </button>

                {/* Like Button */}
                <button
                  onClick={handleLike}
                  title="Like"
                  className={`p-2 rounded-full transition cursor-pointer ${
                    likeState === "like"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FiThumbsUp size={16} />
                </button>

                {/* Dislike Button */}
                <button
                  onClick={handleDislike}
                  title="Dislike"
                  className={`p-2 rounded-full transition cursor-pointer ${
                    likeState === "dislike"
                      ? "bg-red-100 text-red-600"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FiThumbsDown size={16} />
                </button>
              </div>
            )}
          </div>
        )}
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
          className={`break-words max-w-none text-[15px] leading-7 px-4 pb-4 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="bot-md-p text-slate-800 leading-7">
                    {children}
                  </p>
                ),
                h1: ({ children }) => (
                  <h1 className="bot-md-h1 text-slate-900">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="bot-md-h2 text-slate-900">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="bot-md-h3 text-slate-900">{children}</h3>
                ),
                ul: ({ children }) => <ul className="bot-md-ul">{children}</ul>,
                ol: ({ children }) => <ol className="bot-md-ol">{children}</ol>,
                li: ({ children }) => <li className="bot-md-li">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="bot-md-quote">{children}</blockquote>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className?.includes("language-");

                  if (isInline) {
                    return (
                      <code className="bot-md-inline-code" {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <code
                      className={`bot-md-code ${className ?? ""}`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bot-md-pre">{children}</pre>
                ),
                table: ({ children }) => (
                  <div className="bot-md-table-wrap">
                    <table className="bot-md-table">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="bot-md-th">{children}</th>,
                td: ({ children }) => <td className="bot-md-td">{children}</td>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="bot-md-link"
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className="bot-md-hr" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import { WiStars } from "react-icons/wi";

interface AttachedFileItem {
  id: string;
  file: File;
  previewUrl?: string;
}

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      attachedFiles.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [attachedFiles]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120;
      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";
    }
  };

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(
        input,
        attachedFiles.map((item) => item.file),
      );
      setInput("");
      attachedFiles.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
      setAttachedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mappedFiles = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));
    setAttachedFiles((prev) => [...prev, ...mappedFiles]);
    e.target.value = "";
  };

  const removeAttachedFile = (fileId: string) => {
    setAttachedFiles((prev) => {
      const removedItem = prev.find((item) => item.id === fileId);
      if (removedItem?.previewUrl) {
        URL.revokeObjectURL(removedItem.previewUrl);
      }
      return prev.filter((item) => item.id !== fileId);
    });
  };

  const handleConfirm = () => {
    handleSend();
  };

  return (
    <div className="flex flex-col items-center justify-center px-[200px] py-4 bg-white">
      {/* Floating Card Container */}
      <div className="w-full rounded-2xl shadow-xl border transition-all bg-white border-gray-200 shadow-lg">
        {/* Attached Files Preview */}
        {attachedFiles.length > 0 && (
          <div className="border-b px-6 py-4 border-gray-100">
            <div className="flex flex-wrap gap-3">
              {attachedFiles.map((item) => (
                <div
                  key={item.id}
                  className="relative w-24 h-24 rounded-xl overflow-hidden border bg-gray-50 border-gray-300"
                >
                  <button
                    onClick={() => removeAttachedFile(item.id)}
                    className="absolute top-1 right-1 z-10 w-5 h-5 rounded-full bg-black/65 text-white text-xs flex items-center justify-center hover:bg-red-500 transition"
                    title="Remove file"
                    aria-label="Remove file"
                    type="button"
                  >
                    x
                  </button>

                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full p-2 flex flex-col items-center justify-center gap-1">
                      <div className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                        {item.file.name.split(".").pop()?.toUpperCase() ||
                          "FILE"}
                      </div>
                      <p
                        className="text-[10px] leading-tight text-center line-clamp-2 break-all text-gray-700"
                        title={item.file.name}
                      >
                        {item.file.name}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className={`px-3 py-3 flex flex-col gap-4`}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Input Field - Textarea Top Row */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            placeholder="Ask template.net"
            rows={3}
            id="chat-input"
            className="w-full p-1 rounded-xl focus:outline-none font-medium text-base overflow-y-auto box-border scrollbar-thin resize-none bg-white text-gray-900 placeholder-gray-400"
          />

          {/* Buttons Row - Bottom */}
          <div className="flex gap-3 items-center justify-between">
            {/* Plus Button for File Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xl font-medium cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              title="Add file"
            >
              <GoPlus />
            </button>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={isLoading || !input.trim()}
              className={`flex-shrink-0 px-3 py-1 rounded-full flex items-center justify-center text-md font-medium ${
                isLoading || !input.trim()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-600 text-white cursor-pointer"
              }`}
              title="Confirm"
            >
              <WiStars className="text-2xl" /> Generate Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

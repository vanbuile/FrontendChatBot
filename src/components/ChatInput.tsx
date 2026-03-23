import React, { useState, useRef } from "react";
import { GoPlus } from "react-icons/go";
import { WiStars } from "react-icons/wi"; 

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  isDarkMode,
}) => {
  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 200;
      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";
    }
  };

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input, attachedFiles);
      setInput("");
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
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const handleConfirm = () => {
    handleSend();
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      {/* Floating Card Container */}
      <div
        className={`w-full max-w-6xl rounded-2xl shadow-xl border transition-all ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 shadow-2xl"
            : "bg-white border-gray-200 shadow-lg"
        }`}
      >
        {/* Attached Files Preview */}
        {attachedFiles.length > 0 && (
          <div
            className={`border-b px-6 py-4 ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}
          >
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className={`text-sm px-4 py-2 rounded-lg font-medium ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border border-gray-600 hover:border-gray-500"
                      : "bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400"
                  } flex items-center justify-between gap-2 transition`}
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    onClick={() =>
                      setAttachedFiles((prev) =>
                        prev.filter((_, i) => i !== idx),
                      )
                    }
                    className="font-bold text-gray-400 hover:text-red-500 transition"
                  >
                    ×
                  </button>
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
            className={`w-full p-1 rounded-xl focus:outline-none font-medium text-base transition resize-none overflow-y-auto box-border ${
              isDarkMode
                ? "bg-gray-700 text-white placeholder-gray-500"
                : "bg-white text-gray-900 placeholder-gray-400"
            }`}
          />

          {/* Buttons Row - Bottom */}
          <div className="flex gap-3 items-center justify-between">
            {/* Plus Button for File Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xl font-medium cursor-pointer ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              }`}
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
              <WiStars className="text-2xl"/> Generate Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

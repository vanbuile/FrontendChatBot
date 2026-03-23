import React from "react";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <div
      className={`border-b ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      } px-6 py-3 flex justify-between items-center`}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold">
          <span className="text-blue-600">AI</span>
          <span className={isDarkMode ? "text-white" : "text-gray-900"}>
            Chat
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          className={`px-4 py-2 rounded-lg transition w-64 ${
            isDarkMode
              ? "bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-700"
              : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none border border-gray-200"
          }`}
        />

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className={`px-4 py-2 rounded-lg transition ${
            isDarkMode
              ? "hover:bg-gray-800 text-gray-400"
              : "hover:bg-gray-100 text-gray-600"
          }`}
          title={isDarkMode ? "Light mode" : "Dark mode"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
};

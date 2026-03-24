import React from "react";

export const Header: React.FC = () => {
  return (
    <div className="border-b bg-white border-gray-200 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold">
          <span className="text-blue-600">AI</span>
          <span className="text-gray-900">Chat</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded-lg transition w-64 bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none border border-gray-200"
        />
      </div>
    </div>
  );
};

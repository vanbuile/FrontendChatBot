import React from "react";

interface SidebarProps {
  isDarkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isDarkMode }) => {
  const menuItems = [
    { icon: "📄", label: "Document", title: "Document" },
    { icon: "✏️", label: "Design", title: "Design" },
    { icon: "🖥️", label: "Presentation", title: "Presentation" },
    { icon: "🖼️", label: "Image", title: "Image" },
    { icon: "🎬", label: "Video", title: "Video" },
    { icon: "⋯", label: "More", title: "More" },
    { icon: "📋", label: "Templates", title: "Templates" },
    { icon: "⊙", label: "Brand", title: "Brand" },
    { icon: "📁", label: "Projects", title: "Projects" },
  ];

  return (
    <div
      className={`w-20 border-r ${
        isDarkMode
          ? "bg-gray-900 border-gray-800"
          : "bg-gray-50 border-gray-200"
      } flex flex-col h-screen`}
    >
      {/* Menu Items - Scrollable */}
      <div
        className={`flex-1 overflow-y-auto flex flex-col items-center py-8 gap-4`}
      >
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xl transition hover:opacity-80 ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            title={item.title}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Footer Buttons - Fixed */}
      <div
        className={`flex-shrink-0 flex flex-col items-center gap-4 py-6 border-t ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        {/* Sign in button */}
        <button
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition ${
            isDarkMode
              ? "hover:bg-gray-700 text-gray-400"
              : "hover:bg-gray-100 text-gray-600"
          }`}
          title="Sign in"
        >
          ➜
        </button>

        {/* Upgrade button */}
        <button
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-bold transition hover:opacity-90"
          title="Upgrade"
        >
          ⭐
        </button>
      </div>
    </div>
  );
};

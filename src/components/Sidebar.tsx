import React from "react";
import {
  FiHome,
  FiFile,
  FiEdit2,
  FiMonitor,
  FiImage,
  FiVideo,
  FiMoreHorizontal,
  FiClipboard,
  FiDisc,
  FiFolder,
} from "react-icons/fi";
import { BiLogInCircle } from "react-icons/bi";
import { TbCrown } from "react-icons/tb";

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = () => {
  const menuItems = [
    { icon: FiHome, label: "Home", title: "Home" },
    { icon: FiFile, label: "Document", title: "Document" },
    { icon: FiEdit2, label: "Design", title: "Design" },
    { icon: FiMonitor, label: "Presentation", title: "Presentation" },
    { icon: FiImage, label: "Image", title: "Image" },
    { icon: FiVideo, label: "Video", title: "Video" },
    { icon: FiMoreHorizontal, label: "More", title: "More" },
    { icon: FiClipboard, label: "Templates", title: "Templates" },
    { icon: FiDisc, label: "Brand", title: "Brand" },
    { icon: FiFolder, label: "Projects", title: "Projects" },
  ];

  return (
    <div className="w-20 bg-gray-100 flex flex-col h-screen">
      {/* Menu Items - Scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center my-4 gap-4 scrollbar-thin">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center gap-1 cursor-pointer group"
            title={item.title}
          >
            <div
              className={`rounded-full px-4 py-1 transition ${
                idx === 0
                  ? "bg-gray-200 text-blue-600"
                  : "text-gray-600 group-hover:bg-gray-200 group-hover:text-blue-600"
              }`}
            >
              <item.icon size={20} />
            </div>
            <span className={`text-xs font-sm  group-hover:text-blue-600 transition ${
                idx === 0 ? "text-blue-600" : "text-gray-700"
            }
            `}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Footer Buttons - Fixed */}
      <div className="flex-shrink-0 flex flex-col items-center gap-4 py-6 border-t border-gray-200">
        {/* Sign in button */}
        <button
          className="w-12 h-12 rounded-lg flex items-center justify-center text-xl transition hover:bg-gray-100 text-gray-600"
          title="Sign in"
        >
          <BiLogInCircle />
        </button>

        {/* Upgrade button */}
        <button
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-800 text-white text-xl font-bold transition hover:opacity-90"
          title="Upgrade"
        >
          <TbCrown />
        </button>
      </div>
    </div>
  );
};

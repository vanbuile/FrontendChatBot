import React from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  isDarkMode: boolean;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ isDarkMode, children }) => {
  return (
    <div className={`flex h-screen ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* Sidebar */}
      <Sidebar isDarkMode={isDarkMode} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  );
};

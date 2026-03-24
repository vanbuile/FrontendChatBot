import React from "react";
import { FiSearch } from "react-icons/fi";

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-50 px-6 py-3 sm:px-10 lg:px-14">
      <div className="flex items-center justify-between">
        <div className="text-xl leading-none font-extrabold tracking-[-0.04em] text-blue-700 sm:text-2xl">
          TEMPLATE<span className="font-medium tracking-[-0.03em]">.NET</span>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-900 sm:gap-10 sm:text-base">
          <button
            type="button"
            className="p-1 text-slate-950 transition hover:opacity-70"
            aria-label="Search"
            title="Search"
          >
            <FiSearch />
          </button>
          <button type="button" className="transition hover:opacity-70">
            Pricing
          </button>
          <button type="button" className="transition hover:opacity-70">
            Sign up
          </button>
        </nav>
      </div>
    </header>
  );
};

import React from 'react';
import { Menu, X, Wallet } from 'lucide-react';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center space-x-3">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-sm">
            <Wallet size={20} />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              SpendWise
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-md">
              Expense Tracker
            </span>
          </div>
        </div>
      </div>

      {/* User profile */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5 pl-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            MS
          </div>
          <div className="hidden sm:block text-left text-xs">
            <p className="font-semibold text-gray-800 leading-none">Medha Srinath</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Student Account</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  User,
  PieChart,
  BookOpen,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Income',
    path: '/income',
    icon: TrendingUp,
  },
  {
    name: 'Expenses',
    path: '/expenses',
    icon: TrendingDown,
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: PieChart,
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: User,
  },
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-60 bg-white border-r border-gray-200 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">
            Menu
          </p>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-semibold shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500">
          <div className="flex items-center space-x-1.5 text-teal-700 font-semibold mb-1">
            <BookOpen size={14} />
            <span>CS3301 Mini Project</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Full Stack React & Express Implementation.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

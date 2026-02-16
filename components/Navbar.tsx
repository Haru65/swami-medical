
import React from 'react';
import { View, User } from '../types';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onViewChange: (v: View) => void;
  onCartToggle: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, cartCount, onViewChange, onCartToggle, onLogout }) => {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onViewChange(View.HOME)}
        >
          <div className="bg-teal-600 p-2 rounded-lg group-hover:bg-teal-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Swami <span className="text-teal-600">Medical</span></span>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          <button 
            onClick={() => onViewChange(View.HOME)}
            className="hidden md:block text-slate-600 hover:text-teal-600 font-medium transition-colors"
          >
            Home
          </button>

          {user?.isAdmin && (
            <button 
              onClick={() => onViewChange(View.ADMIN)}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              Admin Panel
            </button>
          )}
          
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{user.isAdmin ? 'Administrator' : 'Active User'}</p>
                  <p className="text-sm font-semibold text-slate-700 leading-none">{user.username}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg hover:bg-red-50 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onViewChange(View.LOGIN)}
                className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                Login
              </button>
            )}

            {!user?.isAdmin && (
              <button 
                onClick={onCartToggle}
                className="relative p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-all ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

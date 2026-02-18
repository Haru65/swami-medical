
import React from 'react';
import { View, User } from '../types';

interface BottomNavProps {
  activeView: View;
  onViewChange: (v: View) => void;
  cartCount: number;
  user: User | null;
  onCartOpen: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onViewChange, cartCount, user, onCartOpen }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around z-50 safe-area-bottom shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-4">
      <button 
        onClick={() => onViewChange(View.HOME)}
        className={`flex flex-col items-center gap-1 transition-all ${activeView === View.HOME ? 'text-teal-600' : 'text-slate-400'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeView === View.HOME ? 3 : 2}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
      </button>

      {user?.isAdmin ? (
        <button 
          onClick={() => onViewChange(View.ADMIN)}
          className={`flex flex-col items-center gap-1 transition-all ${activeView === View.ADMIN ? 'text-teal-600' : 'text-slate-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeView === View.ADMIN ? 3 : 2}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
        </button>
      ) : null}

      <button 
        onClick={onCartOpen}
        className="relative flex flex-col items-center gap-1 text-slate-400"
      >
        {!user?.isAdmin && (
          <div className="bg-slate-900 w-14 h-14 -mt-10 rounded-full flex items-center justify-center shadow-xl text-white active:scale-90 transition-transform border-[5px] border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </div>
        )}
      </button>

      <button 
        onClick={() => onViewChange(View.ACCOUNT)}
        className={`flex flex-col items-center gap-1 transition-all ${activeView === View.ACCOUNT ? 'text-teal-600' : 'text-slate-400'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeView === View.ACCOUNT ? 3 : 2}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span className="text-[9px] font-black uppercase tracking-widest">Account</span>
      </button>
    </nav>
  );
};

export default BottomNav;

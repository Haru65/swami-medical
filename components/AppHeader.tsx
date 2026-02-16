
import React from 'react';
import { User } from '../types';

interface AppHeaderProps {
  user: User | null;
  onProfileClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ user, onProfileClick }) => {
  return (
    <header className="bg-white px-5 h-14 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="bg-teal-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
        </div>
        <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Swami <span className="text-teal-600">Medical</span></h1>
      </div>
      
      <button 
        onClick={onProfileClick}
        className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200"
      >
        {user ? (
          <span className="text-sm font-bold text-teal-700">{user.username.charAt(0).toUpperCase()}</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        )}
      </button>
    </header>
  );
};

export default AppHeader;

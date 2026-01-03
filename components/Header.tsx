
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onOpenSettings: () => void;
  syncStatus: { isSyncing: boolean, error: string | null };
}

const Header: React.FC<HeaderProps> = ({ user, onOpenSettings, syncStatus }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={user.profilePic || 'https://picsum.photos/100/100'} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover"
            />
            <div 
              title={syncStatus.isSyncing ? "Cloud Sync Active" : "Local Mode - No Sync"}
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] ${
                syncStatus.isSyncing ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            >
              {syncStatus.isSyncing ? '✓' : '!'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-slate-800 text-sm leading-tight">{user.name}</h1>
              {user.phone === '999' && (
                <span className="bg-indigo-100 text-indigo-600 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Admin</span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${syncStatus.isSyncing ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
              {syncStatus.isSyncing ? 'Synced with Appwrite' : 'Local Storage Mode'}
            </p>
          </div>
        </div>

        <button 
          onClick={onOpenSettings}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;

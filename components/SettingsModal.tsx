
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { UserService } from '../services/userService';

interface SettingsModalProps {
  user: User;
  onClose: () => void;
  onLogout: () => void;
  onUpdateUser: (updatedFields: Partial<User>) => void;
  onOpenAdmin?: () => void;
  isAdminAccount?: boolean;
  isProcessing?: boolean;
  syncStatus?: any;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  user, onClose, onLogout, onUpdateUser, onOpenAdmin, isAdminAccount, isProcessing, syncStatus: initialSyncStatus 
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'data' | 'help'>('main');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const syncStatus = UserService.getSyncStatus();

  const handleExport = () => {
    UserService.exportData();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await UserService.importData(file);
      if (success) {
        setImportStatus('success');
        setTimeout(() => window.location.reload(), 1000); // Reload to apply imported state
      } else {
        setImportStatus('error');
      }
    }
  };

  // Define tabs and filter based on admin status
  const tabs = [
    { id: 'main', label: 'Profile', icon: '👤' },
    ...(isAdminAccount ? [{ id: 'data', label: 'Local Backup', icon: '💾' }] : []),
    { id: 'help', label: 'Help', icon: '❓' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Navigation Tabs */}
        <div className="bg-slate-50/50 backdrop-blur-xl border-b border-slate-200 flex p-3 gap-2">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                ? 'bg-white shadow-lg shadow-slate-200 text-indigo-600 scale-105' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'main' && (
            <div className="space-y-8">
              <div className="flex items-center gap-6 p-8 bg-gradient-to-br from-slate-50 to-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="relative">
                  <img src={user.profilePic} className="w-24 h-24 rounded-full border-4 border-white shadow-xl" alt="Profile" />
                  <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow-lg bg-indigo-500">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h3>
                  <p className="text-sm text-slate-400 font-mono tracking-widest uppercase">{user.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {isAdminAccount && (
                  <button onClick={onOpenAdmin} className="w-full flex items-center justify-between p-6 bg-indigo-600 text-white rounded-[2rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-2xl">🛡️</div>
                      <div className="text-left">
                        <p className="font-black text-sm uppercase tracking-widest">Admin Control</p>
                        <p className="text-[10px] text-indigo-100">Global System Management</p>
                      </div>
                    </div>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                  </button>
                )}

                <button onClick={onLogout} className="w-full p-6 bg-white border-2 border-slate-100 text-slate-600 rounded-[2rem] font-black hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-2">
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === 'data' && isAdminAccount && (
            <div className="space-y-6">
              <div className="p-6 rounded-[2rem] border-2 bg-indigo-50 border-indigo-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600">
                    📂
                  </div>
                  <div>
                    <h4 className="text-base font-black mb-1 text-indigo-900">Local Privacy Mode</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Your data is stored securely on this browser. To transfer your profile to a new device or PC, use the backup tools below.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={handleExport}
                  className="p-8 bg-slate-900 text-white rounded-[2.5rem] hover:bg-slate-800 transition-all group flex flex-col items-center text-center gap-4 shadow-xl"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📥</div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-widest">Download Backup</p>
                    <p className="text-[10px] text-slate-400 mt-1">Save to your Local PC</p>
                  </div>
                </button>

                <button 
                  onClick={handleImportClick}
                  className="p-8 bg-white border-2 border-slate-100 text-slate-900 rounded-[2.5rem] hover:border-indigo-500 transition-all group flex flex-col items-center text-center gap-4 shadow-sm"
                >
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📤</div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-widest">Restore Backup</p>
                    <p className="text-[10px] text-slate-400 mt-1">Upload .json from PC</p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".json" 
                    onChange={handleFileChange} 
                  />
                </button>
              </div>

              {importStatus === 'success' && (
                <div className="p-4 bg-emerald-500 text-white text-center rounded-2xl font-bold animate-bounce">
                  Restored Successfully! Refreshing...
                </div>
              )}

              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Last PC Backup</span>
                  <span>{syncStatus.lastBackup}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-[3rem] space-y-4">
                <h4 className="text-xl font-black text-slate-800">Why Local?</h4>
                <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                  <div className="flex gap-3">
                    <span className="shrink-0 text-indigo-600 font-bold">1.</span>
                    <p><strong>Privacy:</strong> Your information never leaves your device unless you manually export it.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="shrink-0 text-indigo-600 font-bold">2.</span>
                    <p><strong>Speed:</strong> Instant saving with zero latency or cloud errors.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="shrink-0 text-indigo-600 font-bold">3.</span>
                    <p><strong>Control:</strong> You own your data file. Store it in Google Drive, Dropbox, or a USB stick.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end items-center px-10">
          <button onClick={onClose} className="px-10 py-4 bg-white border-2 border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-100 active:scale-95 transition-all text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

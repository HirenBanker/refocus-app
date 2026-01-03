
import React, { useState } from 'react';
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
  syncStatus?: { isSyncing: boolean, error: string | null, errorCode?: number, errorType?: string, hostname: string, origin: string, isCors?: boolean, projectId: string, isSandbox: boolean };
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  user, onClose, onLogout, onUpdateUser, onOpenAdmin, isAdminAccount, isProcessing, syncStatus: initialSyncStatus 
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'sync' | 'deploy'>('main');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [syncStatus, setSyncStatus] = useState(initialSyncStatus);

  const handleRescan = () => {
    setSyncStatus(UserService.getSyncStatus());
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await UserService.testConnection();
    setTestResult(result);
    setIsTesting(false);
    handleRescan();
  };

  const copyToClipboard = (text: string) => {
    if (!text || text.includes('Failed')) return;
    navigator.clipboard.writeText(text);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const getResolvedHostname = () => {
    if (syncStatus?.hostname && syncStatus.hostname !== 'Detection Failed') return syncStatus.hostname;
    if (manualUrl) {
      try {
        const urlString = manualUrl.startsWith('http') ? manualUrl : `https://${manualUrl}`;
        const url = new URL(urlString);
        return url.hostname;
      } catch (e) {
        return 'Invalid URL format';
      }
    }
    return null;
  };

  const resolvedHostname = getResolvedHostname();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Navigation Tabs */}
        <div className="bg-slate-50/50 backdrop-blur-xl border-b border-slate-200 flex p-3 gap-2">
          {[
            { id: 'main', label: 'Profile', icon: '👤' },
            { id: 'sync', label: 'Cloud Status', icon: '☁️' },
            { id: 'deploy', label: 'Vercel Deploy', icon: '🚀' }
          ].map((tab) => (
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
                  <div className={`absolute bottom-1 right-1 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow-lg ${syncStatus?.isSyncing ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}>
                    <span className="text-white text-[10px] font-bold">{syncStatus?.isSyncing ? '✓' : '!'}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h3>
                  <p className="text-sm text-slate-400 font-mono tracking-widest uppercase">{user.phone}</p>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Standard Member
                  </div>
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

          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-[2rem] border-2 ${syncStatus?.error ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${syncStatus?.error ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {syncStatus?.error ? '🚫' : '✅'}
                  </div>
                  <div>
                    <h4 className={`text-base font-black mb-1 ${syncStatus?.error ? 'text-rose-900' : 'text-emerald-900'}`}>
                      {syncStatus?.error ? 'Sync Connection Blocked' : 'Cloud Connection Active'}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {syncStatus?.error 
                        ? 'Appwrite has detected that your current domain is not on its secure whitelist. This prevents any data from being saved to the cloud.'
                        : 'Your data is securely streaming to the Appwrite Cloud. All changes are persistent across sessions.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[80px]"></div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Required Platform Hostname</p>
                    <button onClick={handleRescan} className="text-[10px] text-indigo-300 hover:text-white uppercase font-black flex items-center gap-1">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                      Rescan
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex-grow bg-white/5 border-2 rounded-2xl px-6 py-6 font-mono text-xs break-all min-h-[70px] flex items-center ${!resolvedHostname || resolvedHostname.includes('Failed') ? 'border-rose-500/20 text-rose-200' : 'border-indigo-500/20 text-indigo-100'}`}>
                      {resolvedHostname || 'Scanning for address...'}
                    </div>
                    <button 
                      onClick={() => copyToClipboard(resolvedHostname || '')}
                      disabled={!resolvedHostname || resolvedHostname.includes('Failed')}
                      className={`p-6 rounded-2xl transition-all active:scale-90 shadow-xl ${showCopyFeedback ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-20 disabled:grayscale shadow-indigo-900/40'}`}
                    >
                      {showCopyFeedback ? '✓' : 'Copy'}
                    </button>
                  </div>

                  {(!resolvedHostname || resolvedHostname.includes('Failed')) && (
                    <div className="mt-6 p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3 animate-in fade-in duration-500">
                      <p className="text-[11px] text-indigo-200 font-bold">🛠️ Sandbox Mode Detected</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed italic">
                        Security settings are hiding the address. Please copy the URL from your browser's top address bar and paste it below to resolve the hostname:
                      </p>
                      <input 
                        type="text"
                        placeholder="Paste browser URL here..."
                        value={manualUrl}
                        onChange={(e) => setManualUrl(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 focus:bg-white/20 transition-all text-white font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/10"></div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Project ID</p>
                    <p className="text-xs font-mono text-slate-300">{syncStatus?.projectId}</p>
                  </div>
                  <div className="text-right">
                    <button 
                      onClick={handleRunTest} 
                      disabled={isTesting}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                      {isTesting ? 'Verifying...' : 'Test Sync'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-2xl font-black mb-3">Host for Free on Vercel</h4>
                  <p className="text-sm text-indigo-100 leading-relaxed mb-8">
                    To fix CORS errors permanently and get a real domain, move this project to GitHub then connect it to Vercel.
                  </p>
                  
                  <div className="space-y-6">
                    {[
                      { step: 1, text: "Create a GitHub Repo and upload all current project files." },
                      { step: 2, text: "Import your repo into Vercel.com (1-click integration)." },
                      { step: 3, text: "Add your Gemini API Key in Vercel 'Environment Variables'." }
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-2xl bg-white/20 flex items-center justify-center text-xs font-black shrink-0 border border-white/30">
                          {item.step}
                        </div>
                        <p className="text-xs font-medium leading-tight pt-1">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Decorative SVG */}
                <svg className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>

              <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] space-y-4">
                <h5 className="font-black text-slate-800 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Why Vercel Hosting?
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-indigo-600 text-lg">🔗</span>
                    <p className="text-[11px] font-bold text-slate-600">Stable, non-changing domain name.</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-indigo-600 text-lg">🔒</span>
                    <p className="text-[11px] font-bold text-slate-600">Full SSL/HTTPS encryption automatically.</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-indigo-600 text-lg">⚙️</span>
                    <p className="text-[11px] font-bold text-slate-600">Native support for Vite & React build steps.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center px-10">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Version 1.4.2 (Stable)</p>
          <button onClick={onClose} className="px-10 py-4 bg-white border-2 border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-100 active:scale-95 transition-all text-sm">
            Exit Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

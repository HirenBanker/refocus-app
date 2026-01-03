
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BlockTimer from './components/BlockTimer';
import SiteList from './components/SiteList';
import AdBanner from './components/AdBanner';
import AuthScreen from './components/AuthScreen';
import SettingsModal from './components/SettingsModal';
import AdminDashboard from './components/AdminDashboard';
import FocusShield from './components/FocusShield';
import { UserService } from './services/userService';
import { User, Site } from './types';

const INITIAL_SITES: Site[] = [
  { id: '1', name: 'Instagram', url: 'instagram.com', icon: '📸' },
  { id: '2', name: 'TikTok', url: 'tiktok.com', icon: '🎵' },
  { id: '3', name: 'Facebook', url: 'facebook.com', icon: '👤' },
  { id: '4', name: 'X (Twitter)', url: 'x.com', icon: '🐦' },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [sites, setSites] = useState<Site[]>(INITIAL_SITES);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(UserService.getSyncStatus());
  
  // Focus Session State
  const [activeSession, setActiveSession] = useState<{ duration: number; tip: string } | null>(null);

  useEffect(() => {
    const init = async () => {
      const timer = setTimeout(() => setIsLoading(false), 800);
      try {
        const session = UserService.getCurrentSession();
        if (session) {
          setCurrentUser(session);
        }
        const users = await UserService.getAllUsers();
        setAllUsers(users);
        setSyncStatus(UserService.getSyncStatus());
      } catch (err) {
        console.warn("Init fallback used.");
      } finally {
        setIsLoading(false);
        clearTimeout(timer);
      }
    };
    init();

    // Periodic sync check
    const syncCheck = setInterval(() => {
      setSyncStatus(UserService.getSyncStatus());
    }, 5000);

    return () => clearInterval(syncCheck);
  }, []);

  const handleLogin = async (phone: string, name?: string) => {
    setIsProcessing(true);
    try {
      const user = await UserService.authenticate(phone, name);
      setCurrentUser(user);
      const users = await UserService.getAllUsers();
      setAllUsers(users);
      setSyncStatus(UserService.getSyncStatus());
    } catch (e) {
      const mockUser = {
        id: 'local-' + Date.now(),
        name: name || 'User',
        phone: phone,
        email: 'local@refocus.app',
        profilePic: `https://picsum.photos/seed/${phone}/200`,
        isLoggedIn: true
      };
      setCurrentUser(mockUser);
    }
    setIsProcessing(false);
  };

  const handleLogout = () => {
    UserService.clearSession();
    setCurrentUser(null);
    setIsAdminOpen(false);
    setIsSettingsOpen(false);
  };

  const handleStartSession = (duration: number, tip: string) => {
    setActiveSession({ duration, tip });
  };

  const handleUpdateUser = async (userId: string, updatedFields: Partial<User>) => {
    setIsProcessing(true);
    try {
      const users = await UserService.getAllUsers();
      const user = users.find(u => u.id === userId);
      if (user) {
        const updatedUser = await UserService.saveUser({ ...user, ...updatedFields });
        setAllUsers(await UserService.getAllUsers());
        if (currentUser?.id === userId) setCurrentUser(updatedUser);
        setSyncStatus(UserService.getSyncStatus());
      }
    } catch (e) {}
    setIsProcessing(false);
  };

  const handleDeleteUser = async (userId: string) => {
    setIsProcessing(true);
    try {
      await UserService.deleteUser(userId);
      setAllUsers(await UserService.getAllUsers());
      if (currentUser?.id === userId) handleLogout();
      setSyncStatus(UserService.getSyncStatus());
    } catch (e) {}
    setIsProcessing(false);
  };

  const handleAddUser = async (newUser: User) => {
    setIsProcessing(true);
    try {
      await UserService.saveUser(newUser);
      setAllUsers(await UserService.getAllUsers());
      setSyncStatus(UserService.getSyncStatus());
    } catch (e) {}
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse mb-4">
          <svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
        </div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Refocus</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-10">
      {activeSession && (
        <FocusShield 
          durationMinutes={activeSession.duration} 
          tip={activeSession.tip}
          onComplete={() => setActiveSession(null)} 
        />
      )}

      {!currentUser ? (
        <AuthScreen onLogin={handleLogin} isProcessing={isProcessing} />
      ) : isAdminOpen ? (
        <AdminDashboard 
          users={allUsers} 
          onClose={() => setIsAdminOpen(false)}
          onDeleteUser={handleDeleteUser}
          onUpdateUser={handleUpdateUser}
          onAddUser={handleAddUser}
          isProcessing={isProcessing}
        />
      ) : (
        <>
          <Header 
            user={currentUser} 
            onOpenSettings={() => setIsSettingsOpen(true)} 
            syncStatus={syncStatus}
          />
          
          {isProcessing && (
            <div className="bg-indigo-600 text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest animate-pulse sticky top-16 z-20">
              {syncStatus.isSyncing ? 'Cloud Syncing...' : 'Saving Locally...'}
            </div>
          )}

          <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600 text-sm">⏱️</span>
                  Block Schedule
                </h2>
                <BlockTimer onStartSession={handleStartSession} />
              </div>
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="p-2 bg-rose-100 rounded-lg text-rose-600 text-sm">🚫</span>
                  Managed Sites
                </h2>
                <SiteList 
                  sites={sites} 
                  onAddSite={(site) => setSites([...sites, site])}
                  onDeleteSite={(id) => setSites(sites.filter(s => s.id !== id))}
                />
              </div>
            </div>
          </main>
          
          <div className="container mx-auto px-4 mt-8">
            <AdBanner />
          </div>
        </>
      )}

      {isSettingsOpen && (
        <SettingsModal 
          user={currentUser!} 
          onClose={() => setIsSettingsOpen(false)} 
          onLogout={handleLogout}
          onUpdateUser={(fields) => handleUpdateUser(currentUser!.id, fields)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          isAdminAccount={currentUser!.name.toLowerCase().includes('admin') || currentUser!.phone === '999'}
          isProcessing={isProcessing}
          syncStatus={syncStatus}
        />
      )}
    </div>
  );
};

export default App;

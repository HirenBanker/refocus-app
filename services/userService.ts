
import { User } from '../types';

const SESSION_KEY = 'refocus_auth_session';
const LOCAL_USERS_KEY = 'refocus_local_users';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@refocus.app', phone: '999', profilePic: 'https://i.pravatar.cc/150?u=999', isLoggedIn: false },
  { id: '2', name: 'Demo User', email: 'user@refocus.app', phone: '123', profilePic: 'https://i.pravatar.cc/150?u=123', isLoggedIn: false }
];

export const UserService = {
  getSyncStatus() {
    return {
      isSyncing: false,
      isLocal: true,
      storageUsed: JSON.stringify(localStorage).length,
      lastBackup: localStorage.getItem('refocus_last_backup') || 'Never'
    };
  },

  async getAllUsers(): Promise<User[]> {
    const local = localStorage.getItem(LOCAL_USERS_KEY);
    return local ? JSON.parse(local) : MOCK_USERS;
  },

  async saveUser(user: User): Promise<User> {
    const users = await this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    
    const current = this.getCurrentSession();
    if (current && current.id === user.id) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }
    
    return user;
  },

  async deleteUser(userId: string): Promise<void> {
    const users = await this.getAllUsers();
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users.filter(u => u.id !== userId)));
  },

  async authenticate(phone: string, name?: string): Promise<User> {
    const localUsers = await this.getAllUsers();
    let user = localUsers.find(u => u.phone === phone) || null;

    if (!user) {
      user = { 
        id: 'local-' + Math.random().toString(36).substr(2, 9), 
        name: name || 'New User', 
        phone: phone, 
        email: (name ? name.toLowerCase().replace(/\s+/g, '.') : 'user') + '@refocus.app', 
        profilePic: `https://picsum.photos/seed/${phone}/200`, 
        isLoggedIn: true 
      };
    } else {
      user.isLoggedIn = true;
      if (name) user.name = name;
    }

    const savedUser = await this.saveUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(savedUser));
    return savedUser;
  },

  getCurrentSession(): User | null {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  async clearSession() {
    const session = this.getCurrentSession();
    if (session) {
      session.isLoggedIn = false;
      await this.saveUser(session);
    }
    localStorage.removeItem(SESSION_KEY);
  },

  exportData() {
    const data = {
      users: JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]'),
      session: JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'),
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `refocus-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    localStorage.setItem('refocus_last_backup', new Date().toLocaleString());
  },

  async importData(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.users) localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(data.users));
          if (data.session) localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
          resolve(true);
        } catch (err) {
          console.error("Import failed:", err);
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }
};

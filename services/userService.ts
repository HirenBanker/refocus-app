
import { User } from '../types';
// @ts-ignore
import { Client, Databases, ID, Query, Permission, Role } from 'appwrite';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = 'refocus312026';
const APPWRITE_DB_ID = '69593cb2001538d12136';
const APPWRITE_TABLE_ID = 'users';

let client: any = null;
let databases: any = null;
let isOfflineMode = false;
let lastSyncError: { message: string, code?: number, type?: string, isCors?: boolean } | null = null;

const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@refocus.app', phone: '999', profilePic: 'https://i.pravatar.cc/150?u=999', isLoggedIn: false },
  { id: '2', name: 'Demo User', email: 'user@refocus.app', phone: '123', profilePic: 'https://i.pravatar.cc/150?u=123', isLoggedIn: false }
];

const initAppwrite = () => {
  try {
    if (APPWRITE_PROJECT_ID && !APPWRITE_PROJECT_ID.includes('YOUR_')) {
      client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID);
      databases = new Databases(client);
      return true;
    }
  } catch (e) {
    console.error("Appwrite Init Error:", e);
    isOfflineMode = true;
  }
  return false;
};

initAppwrite();

const SESSION_KEY = 'refocus_auth_session';
const LOCAL_USERS_KEY = 'refocus_local_users';

export const UserService = {
  getSyncStatus() {
    let host = '';
    try {
      host = window.location.hostname;
    } catch (e) {
      host = 'Detection Failed';
    }

    const isSandbox = host.includes('usercontent.goog') || 
                      host.includes('preview') ||
                      host.includes('stackblitz');

    return {
      isSyncing: !isOfflineMode && !!databases && !lastSyncError,
      error: lastSyncError?.message || null,
      errorCode: lastSyncError?.code,
      errorType: lastSyncError?.type,
      isCors: lastSyncError?.isCors || lastSyncError?.code === 0,
      hostname: host,
      origin: window.location.origin,
      projectId: APPWRITE_PROJECT_ID,
      isSandbox: isSandbox
    };
  },

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!databases) return { success: false, message: "Appwrite not initialized" };
    try {
      const testId = 'ping_' + Math.random().toString(36).substr(2, 5);
      const payload = {
        name: "Ping",
        email: "ping@refocus.app",
        phone: "000",
        profilePic: "",
        isLoggedIn: false
      };
      
      await databases.createDocument(APPWRITE_DB_ID, APPWRITE_TABLE_ID, testId, payload, [Permission.read(Role.any()), Permission.write(Role.any())]);
      await databases.deleteDocument(APPWRITE_DB_ID, APPWRITE_TABLE_ID, testId);
      
      lastSyncError = null;
      return { success: true, message: "Handshake Successful!" };
    } catch (e: any) {
      const isCors = e.code === 0 || e.message?.toLowerCase().includes('fetch') || e.message?.includes('CORS');
      lastSyncError = { 
        message: e.message, 
        code: e.code, 
        type: e.type,
        isCors: isCors
      };
      
      if (isCors) return { success: false, message: `CORS ERROR: Hostname "${window.location.hostname}" is not whitelisted in Appwrite.` };
      return { success: false, message: e.message };
    }
  },

  async getAllUsers(): Promise<User[]> {
    const local = localStorage.getItem(LOCAL_USERS_KEY);
    const localData = local ? JSON.parse(local) : MOCK_USERS;
    if (!databases || isOfflineMode) return localData;

    try {
      const response: any = await databases.listDocuments(APPWRITE_DB_ID, APPWRITE_TABLE_ID);
      const users = response.documents.map((doc: any) => ({
        id: doc.$id,
        name: doc.name || 'Unknown',
        email: doc.email || '',
        phone: doc.phone || '',
        profilePic: doc.profilePic || '',
        isLoggedIn: !!doc.isLoggedIn
      }));
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      lastSyncError = null;
      return users;
    } catch (error: any) {
      if (error.code === 0 || error.message?.toLowerCase().includes('fetch')) {
        lastSyncError = { message: error.message, code: error.code, type: error.type, isCors: true };
      }
      return localData;
    }
  },

  async saveUser(user: User): Promise<User> {
    const users = await this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) users[index] = user; else users.push(user);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

    if (!databases || isOfflineMode) return user;

    const payload = {
      name: (user.name || 'Anonymous').trim().substring(0, 100),
      email: (user.email || `${user.id}@refocus.app`).trim().substring(0, 100),
      phone: (user.phone || '000').trim().substring(0, 20),
      profilePic: (user.profilePic || '').substring(0, 255),
      isLoggedIn: Boolean(user.isLoggedIn)
    };

    try {
      try {
        await databases.updateDocument(APPWRITE_DB_ID, APPWRITE_TABLE_ID, user.id, payload);
      } catch (e: any) {
        const result = await databases.createDocument(
          APPWRITE_DB_ID, 
          APPWRITE_TABLE_ID, 
          user.id.length > 36 || user.id.startsWith('local-') ? ID.unique() : user.id, 
          payload,
          [Permission.read(Role.any()), Permission.write(Role.any())]
        );
        user.id = result.$id;
      }
      lastSyncError = null;
      return user;
    } catch (error: any) {
      if (error.code === 0 || error.message?.toLowerCase().includes('fetch')) {
        lastSyncError = { message: error.message, code: error.code, type: error.type, isCors: true };
      }
      return user;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    const users = await this.getAllUsers();
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users.filter(u => u.id !== userId)));
    if (!databases || isOfflineMode) return;
    try {
      await databases.deleteDocument(APPWRITE_DB_ID, APPWRITE_TABLE_ID, userId);
      lastSyncError = null;
    } catch (error: any) {
      if (error.code === 0 || error.message?.toLowerCase().includes('fetch')) {
        lastSyncError = { message: error.message, code: error.code, type: error.type, isCors: true };
      }
    }
  },

  async authenticate(phone: string, name?: string): Promise<User> {
    let user: User | null = null;
    if (databases && !isOfflineMode) {
      try {
        const response = await databases.listDocuments(APPWRITE_DB_ID, APPWRITE_TABLE_ID, [Query.equal('phone', phone)]);
        if (response.documents.length > 0) {
          const doc = response.documents[0];
          user = { id: doc.$id, name: doc.name, email: doc.email, phone: doc.phone, profilePic: doc.profilePic, isLoggedIn: true };
        }
      } catch (e: any) {}
    }
    if (!user) {
      const localUsers = await this.getAllUsers();
      user = localUsers.find(u => u.phone === phone) || null;
    }
    if (!user) {
      user = { 
        id: ID.unique(), 
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
      await this.saveUser(session).catch(() => {});
    }
    localStorage.removeItem(SESSION_KEY);
  }
};

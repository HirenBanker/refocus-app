
import React, { useState } from 'react';
import { User } from '../types';

interface AdminDashboardProps {
  users: User[];
  onClose: () => void;
  onDeleteUser: (id: string) => void;
  onUpdateUser: (id: string, fields: Partial<User>) => void;
  onAddUser: (user: User) => void;
  isProcessing: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, onClose, onDeleteUser, onUpdateUser, onAddUser, isProcessing }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone.includes(searchQuery) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdateUser(editingId, { name: editName, email: editEmail, phone: editPhone });
      setEditingId(null);
    }
  };

  const handleCreateUser = () => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: editName || 'New User',
      email: editEmail || 'user@example.com',
      phone: editPhone || '000',
      profilePic: `https://picsum.photos/seed/${editPhone}/200`,
      isLoggedIn: false
    };
    onAddUser(newUser);
    setIsAdding(false);
    setEditName(''); setEditEmail(''); setEditPhone('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {isProcessing && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-[100] animate-pulse"></div>
      )}
      
      <div className="flex-grow p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Admin Console</h1>
              <p className="text-slate-500">Managing {users.length} registered accounts</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => { setIsAdding(true); setEditingId(null); setEditName(''); setEditEmail(''); setEditPhone(''); }}
                className="flex-grow md:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                New User
              </button>
              <button 
                onClick={onClose}
                className="flex-grow md:flex-none px-6 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Exit Dashboard
              </button>
            </div>
          </header>

          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input 
              type="text"
              placeholder="Search by name, phone or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {isAdding && (
            <div className="mb-8 p-6 bg-white border-2 border-indigo-100 rounded-3xl shadow-xl animate-in slide-in-from-top-4">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="p-1 bg-indigo-100 text-indigo-600 rounded">👤</span>
                Account Registration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Name</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Email</label>
                  <input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Phone</label>
                  <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCreateUser} className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Add Account</button>
                <button onClick={() => setIsAdding(false)} className="px-8 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200">Cancel</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Identity</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Contact Information</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.profilePic} className="w-10 h-10 rounded-full border border-slate-200 bg-slate-100" alt="" />
                          {editingId === user.id ? (
                            <input value={editName} onChange={e => setEditName(e.target.value)} className="p-1 border border-indigo-300 rounded outline-none w-32" />
                          ) : (
                            <div>
                              <p className="font-bold text-slate-800 whitespace-nowrap">{user.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: {user.id}</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === user.id ? (
                          <div className="space-y-1">
                            <input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="block p-1 border border-indigo-300 rounded text-xs w-full" />
                            <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="block p-1 border border-indigo-300 rounded text-xs w-full" />
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-slate-600 font-medium">{user.email}</p>
                            <p className="text-sm text-slate-400 font-mono">{user.phone}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.isLoggedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                          {user.isLoggedIn ? 'Active' : 'Offline'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId === user.id ? (
                          <div className="flex justify-end gap-3">
                            <button onClick={saveEdit} className="text-indigo-600 font-bold text-sm hover:underline">Save Changes</button>
                            <button onClick={() => setEditingId(null)} className="text-slate-400 font-bold text-sm hover:underline">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-4">
                            <button onClick={() => startEdit(user)} className="text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors">Edit</button>
                            <button 
                              onClick={() => { if(window.confirm('Delete this user?')) onDeleteUser(user.id); }} 
                              className="text-rose-600 font-bold text-sm hover:text-rose-800 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <p className="text-slate-400 font-medium">No accounts found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

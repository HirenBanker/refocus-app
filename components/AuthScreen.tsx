
import React, { useState } from 'react';

interface AuthScreenProps {
  onLogin: (phone: string, name?: string) => void;
  isProcessing: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, isProcessing }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    onLogin(phone, isSignUp ? name : undefined);
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center text-white">
        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
          <svg width="40" height="40" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
        </div>
        <h1 className="text-3xl font-black tracking-tight">Refocus</h1>
        <p className="text-indigo-100 mt-2">Reclaim your digital life.</p>
        <p className="text-[10px] text-white/50 mt-1 uppercase tracking-widest font-bold">(Tip: Phone "999" for Admin Access)</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-xs font-bold text-indigo-600">Verifying...</p>
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setIsSignUp(false)}
            className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${!isSignUp ? 'border-indigo-600 text-indigo-600' : 'border-slate-100 text-slate-400'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsSignUp(true)}
            className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${isSignUp ? 'border-indigo-600 text-indigo-600' : 'border-slate-100 text-slate-400'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Phone Number</label>
            <input 
              type="tel" 
              required 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            Authentication is frictionless. We prioritize your privacy and time.
          </p>

          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSignUp ? 'Create Account' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;

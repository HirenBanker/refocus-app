
import React from 'react';

const AdBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
            Premium Offer
          </span>
          <h3 className="text-xl md:text-2xl font-bold mb-2">Upgrade to Refocus Pro</h3>
          <p className="text-slate-300 text-sm max-w-md">
            Unlock cross-device synchronization, advanced analytics, and AI-powered productivity coaching.
          </p>
        </div>
        <button className="whitespace-nowrap px-8 py-3 bg-white text-slate-900 rounded-xl font-extrabold shadow-xl transition-transform hover:scale-105 active:scale-95">
          Get 50% Off Now
        </button>
      </div>
      
      {/* Decorative background circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-100/5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default AdBanner;

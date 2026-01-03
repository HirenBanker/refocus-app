
import React, { useState } from 'react';
import { Site } from '../types';

interface SiteListProps {
  sites: Site[];
  onAddSite: (site: Site) => void;
  onDeleteSite: (id: string) => void;
}

const SiteList: React.FC<SiteListProps> = ({ sites, onAddSite, onDeleteSite }) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');

  const handleAdd = () => {
    if (!newSiteName || !newSiteUrl) return;
    const newSite: Site = {
      id: Date.now().toString(),
      name: newSiteName,
      url: newSiteUrl,
      icon: '🌐'
    };
    onAddSite(newSite);
    setNewSiteName('');
    setNewSiteUrl('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="flex-grow">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Active List</label>
        <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {sites.length === 0 ? (
            <p className="text-slate-400 text-center py-8 italic">No sites restricted yet.</p>
          ) : (
            sites.map((site) => (
              <div 
                key={site.id}
                onClick={() => setSelectedId(site.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedId === site.id 
                    ? 'border-indigo-600 bg-indigo-50' 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{site.icon}</span>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{site.name}</h3>
                    <p className="text-xs text-slate-500">{site.url}</p>
                  </div>
                </div>
                {selectedId === site.id && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                )}
              </div>
            ))
          )}
        </div>

        {isAdding && (
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 animate-in fade-in slide-in-from-bottom-4">
            <input 
              placeholder="Site Name (e.g. Reddit)" 
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              className="w-full mb-2 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input 
              placeholder="Domain (e.g. reddit.com)" 
              value={newSiteUrl}
              onChange={(e) => setNewSiteUrl(e.target.value)}
              className="w-full mb-3 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleAdd}
                className="flex-grow py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
              >
                Save Site
              </button>
              <button 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm border border-indigo-100 hover:bg-indigo-100 transition-all"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Add New
        </button>
        <button
          disabled={!selectedId}
          onClick={() => {
            if (selectedId) onDeleteSite(selectedId);
            setSelectedId('');
          }}
          className="flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-700 rounded-xl font-bold text-sm border border-rose-100 hover:bg-rose-100 disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100 transition-all"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          Remove
        </button>
      </div>
    </div>
  );
};

export default SiteList;

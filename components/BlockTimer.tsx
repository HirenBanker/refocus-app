
import React, { useState } from 'react';
import { getFocusTip } from '../services/geminiService';

interface BlockTimerProps {
  onStartSession: (duration: number, tip: string) => void;
}

const PRESETS = [
  { label: '1 Hr', value: 60 },
  { label: '2 Hr', value: 120 },
  { label: '3 Hr', value: 180 },
  { label: '4 Hr', value: 240 },
];

const BlockTimer: React.FC<BlockTimerProps> = ({ onStartSession }) => {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(60);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isCustom, setIsCustom] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    setIsActivating(true);
    let finalDuration = selectedPreset || 60;
    
    if (isCustom) {
      // Very simple calculation for custom duration (not production-ready logic but works for prototype)
      const startParts = startTime.split(':').map(Number);
      const endParts = endTime.split(':').map(Number);
      const diffMins = (endParts[0] * 60 + endParts[1]) - (startParts[0] * 60 + startParts[1]);
      finalDuration = diffMins > 0 ? diffMins : 60;
    }

    const label = isCustom ? `${startTime} to ${endTime}` : `${finalDuration} minutes`;
    const tip = await getFocusTip(label);
    
    onStartSession(finalDuration, tip);
    setIsActivating(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => {
              setSelectedPreset(preset.value);
              setIsCustom(false);
            }}
            className={`py-4 px-2 rounded-xl border-2 transition-all font-semibold ${
              selectedPreset === preset.value && !isCustom
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-indigo-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={isCustom}
            onChange={(e) => {
              setIsCustom(e.target.checked);
              if (e.target.checked) setSelectedPreset(null);
            }}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="font-medium text-slate-700">Custom Schedule</span>
        </label>

        {isCustom && (
          <div className="mt-4 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Start Time</label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">End Time</label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleActivate}
        disabled={isActivating || (!selectedPreset && !isCustom)}
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none transition-all active:scale-[0.98]"
      >
        {isActivating ? 'Initializing...' : 'Start Focused Session'}
      </button>
    </div>
  );
};

export default BlockTimer;

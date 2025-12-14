"use client";
import { useState } from "react";
import Link from "next/link";

export default function Settings() {
  // State for username
  const [username, setUsername] = useState("sid_travels");
  const [isEditing, setIsEditing] = useState(false);
  
  // State for Privacy Toggles
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showStatus: true,
    allowSearch: true,
  });

  const togglePrivacy = (key) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] });
  };

  return (
    <div className="min-h-screen p-4 pb-32 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <Link href="/profile" className="text-2xl font-bold hover:scale-110 transition">🔙</Link>
        <h1 className="text-3xl font-black dark:text-white text-slate-900">Settings</h1>
      </div>

      <div className="max-w-lg mx-auto space-y-6">

        {/* 1. ACCOUNT SETTINGS (Username) */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white text-slate-800">
            👤 Account
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Username</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={username}
                  disabled={!isEditing}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`flex-1 bg-slate-50 dark:bg-black/20 p-4 rounded-xl font-bold outline-none border transition-colors ${isEditing ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-slate-500 dark:text-slate-300'}`}
                />
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-slate-100 dark:bg-zinc-800 px-4 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-zinc-700 transition"
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                This is your unique handle. You can change it once every 14 days.
              </p>
            </div>
          </div>
        </div>

        {/* 2. PRIVACY SETTINGS */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white text-slate-800">
            🔒 Privacy
          </h2>
          
          <div className="space-y-4">
            <ToggleRow 
              label="Public Profile" 
              desc="Allow anyone to see your trips" 
              isOn={privacy.profilePublic} 
              onToggle={() => togglePrivacy('profilePublic')} 
            />
            <ToggleRow 
              label="Online Status" 
              desc="Show when you are active" 
              isOn={privacy.showStatus} 
              onToggle={() => togglePrivacy('showStatus')} 
            />
            <ToggleRow 
              label="Searchability" 
              desc="Allow people to find you by phone" 
              isOn={privacy.allowSearch} 
              onToggle={() => togglePrivacy('allowSearch')} 
            />
          </div>
        </div>

        {/* 3. HELP & SUPPORT */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white text-slate-800">
            ❓ Help & Support
          </h2>
          
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-xl bg-slate-50 dark:bg-black/20 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition flex justify-between">
              Report a Problem <span>›</span>
            </button>
            <button className="w-full text-left p-4 rounded-xl bg-slate-50 dark:bg-black/20 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition flex justify-between">
              Safety Guidelines <span>›</span>
            </button>
            <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-500/20">
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-1">Need urgent help?</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Email us at support@solotrip.com</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Toggle Component
function ToggleRow({ label, desc, isOn, onToggle }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-bold text-slate-800 dark:text-white">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-zinc-700'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );
}
"use client";
import Link from "next/link";

export default function TripDetails() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* 1. Hero Image */}
      <div className="h-64 bg-cyan-700 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <Link href="/dashboard" className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold hover:bg-white/40 transition">
          ←
        </Link>
        <div className="absolute bottom-4 left-4 text-white">
          <span className="bg-orange-500 text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">Workation</span>
          <h1 className="text-3xl font-black shadow-black drop-shadow-md">Kasol, Himachal</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10">
        
        {/* 2. Host Info Card */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xl">
            RK
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-1">
              Rohan K. <span className="text-green-500 text-sm">✔</span>
            </h3>
            <p className="text-xs text-slate-400">Verified User • 24 years old</p>
          </div>
          <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-200">
            View Profile
          </button>
        </div>

        {/* 3. Trip Details */}
        <div className="space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Dates</p>
              <p className="font-bold text-slate-800 text-sm">Oct 12-19</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Budget</p>
              <p className="font-bold text-slate-800 text-sm">₹8k - 10k</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Looking For</p>
              <p className="font-bold text-slate-800 text-sm">2 People</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-2">The Plan</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              I am planning to work remotely from Kasol for a week. I have booked a hostel (The Hosteller). 
              <br /><br />
              Looking for chill people to explore cafes in the evening and maybe do the Kheerganga trek on the weekend.
              We can share a cab from Delhi or Chandigarh.
            </p>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-3">Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {["🚭 Non-Smoking", "🎵 Music Lovers", "🐕 Pet Friendly"].map(tag => (
                <span key={tag} className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4. Sticky Footer Action */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button className="flex-1 bg-slate-100 text-slate-800 font-bold py-4 rounded-xl hover:bg-slate-200 transition">
            Share
          </button>
          <button className="flex-[2] bg-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-cyan-800 transition">
            Request to Join
          </button>
        </div>
      </div>

    </div>
  );
}
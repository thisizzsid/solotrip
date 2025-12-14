"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- PROFESSIONAL DATA WITH REAL IMAGES ---
const INITIAL_PLACES = [
  { id: 1, name: "Goa", type: "Beaches", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80", desc: "North Goa Nightlife & Beaches", coords: "Goa, India" },
  { id: 2, name: "Manali", type: "Mountains", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80", desc: "Solang Valley & Rohtang Pass", coords: "Manali, Himachal Pradesh" },
  { id: 3, name: "Kerala", type: "Nature", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80", desc: "Alleppey Backwaters", coords: "Kerala, India" },
  { id: 4, name: "Ladakh", type: "Adventure", img: "https://images.unsplash.com/photo-1581793434119-94424c810fb8?w=800&q=80", desc: "Pangong Lake & Nubra Valley", coords: "Ladakh, India" },
  { id: 5, name: "Jaipur", type: "Culture", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80", desc: "Hawa Mahal & City Palace", coords: "Jaipur, Rajasthan" },
  { id: 6, name: "Varanasi", type: "Spiritual", img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80", desc: "Ganga Ghats & Temples", coords: "Varanasi, India" },
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState(INITIAL_PLACES);
  const [userPoints, setUserPoints] = useState(120); // Starting Points
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlace, setNewPlace] = useState({ name: "", desc: "", type: "Hidden Gem" });

  // Filter Logic
  const filteredPlaces = places.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.type.toLowerCase().includes(query.toLowerCase())
  );

  // Handle "Add Place"
  const handleSubmitPlace = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      name: newPlace.name,
      type: "Hidden Gem 💎",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", // Default nice travel image
      desc: newPlace.desc,
      coords: newPlace.name
    };
    
    setPlaces([newEntry, ...places]); // Add to top
    setUserPoints(userPoints + 50); // Add Points
    setShowAddModal(false);
    setNewPlace({ name: "", desc: "", type: "Hidden Gem" });
    alert("Place Added! You earned 50 Karma Points 🌟");
  };

  return (
    <div className="space-y-12 py-10 pb-32">
      
      {/* 1. HERO SECTION */}
      <div className="text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-4">
          <span className="text-cyan-400 font-bold">💎 Your Karma:</span>
          <span className="font-black text-white">{userPoints} Points</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight drop-shadow-2xl">
          DISCOVER <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            HIDDEN INDIA
          </span>
        </h1>
        <p className="text-lg opacity-70 max-w-lg mx-auto font-medium">
          Explore top destinations or contribute hidden gems to the community.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button onClick={() => setShowAddModal(true)} className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full text-lg shadow-[0_0_30px_rgba(6,182,212,0.5)] transition hover:scale-105 flex items-center gap-2">
            <span>📍</span> Add Hidden Place
          </button>
          <button onClick={() => router.push("/dashboard")} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 font-bold rounded-full text-lg transition">
            Explore Feed
          </button>
        </div>
      </div>

      {/* 2. SEARCH & DISCOVER */}
      <div className="bg-white/5 dark:bg-black/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Popular Destinations</h2>
          <span className="text-xs font-bold px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
            {filteredPlaces.length} Results
          </span>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <svg className="absolute left-5 top-5 w-5 h-5 opacity-50" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path></svg>
          <input 
            type="text"
            placeholder="Search 'Goa', 'Mountains', 'Kerala'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 font-bold text-lg focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition placeholder:text-white/30"
          />
        </div>

        {/* Real Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div 
              key={place.id} 
              onClick={() => setQuery(place.name)} // Click to Filter
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer border border-white/10 shadow-lg"
            >
              <img 
                src={place.img} 
                alt={place.name} 
                className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-black text-2xl text-white mb-1">{place.name}</h3>
                    <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">{place.type}</p>
                    <p className="text-sm text-white/70 mt-1 line-clamp-1">{place.desc}</p>
                  </div>
                  
                  {/* Google Maps Link Simulation */}
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${place.coords}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} 
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-cyan-500 transition text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- ADD PLACE MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white font-bold"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-black mb-1">Add Hidden Gem 💎</h2>
            <p className="text-sm text-white/50 mb-6">Share a secret spot and earn 50 Karma Points.</p>
            
            <form onSubmit={handleSubmitPlace} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-cyan-500 uppercase">Place Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Secret Waterfall, Manali"
                  value={newPlace.name}
                  onChange={(e) => setNewPlace({...newPlace, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 mt-1 focus:border-cyan-500 outline-none font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-cyan-500 uppercase">Description & Location</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Describe how to reach there..."
                  value={newPlace.desc}
                  onChange={(e) => setNewPlace({...newPlace, desc: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 mt-1 focus:border-cyan-500 outline-none font-medium text-sm"
                />
              </div>
              
              <button type="submit" className="w-full bg-cyan-500 text-black font-bold py-4 rounded-xl hover:bg-cyan-400 transition mt-2">
                Submit & Earn Points 🚀
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
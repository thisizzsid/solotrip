"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function RealDashboard() {
  const [activeTab, setActiveTab] = useState("explore");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // FETCH TRIPS IN REAL-TIME
  useEffect(() => {
    const q = query(collection(db, "trips"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrips(tripsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 py-6 pb-32">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">Dashboard</h2>
          <p className="text-cyan-400 font-bold">Latest Community Trips</p>
        </div>
        <button 
          onClick={() => router.push("/create-trip")}
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:scale-105 flex items-center gap-2"
        >
          <span>➕</span> <span className="hidden sm:inline">New Trip</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
        <button 
          onClick={() => setActiveTab("explore")}
          className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === "explore" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/20" : "opacity-50 hover:bg-white/5"}`}
        >
          Community Trips
        </button>
        <button 
          onClick={() => setActiveTab("mytrips")}
          className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === "mytrips" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/20" : "opacity-50 hover:bg-white/5"}`}
        >
          My Plans
        </button>
      </div>

      {/* FEED */}
      {loading ? (
        <div className="text-center text-white/50 py-20">Loading amazing trips...</div>
      ) : (
        <div className="grid gap-6">
          {trips.length > 0 ? (
            trips.map((trip) => (
              <div key={trip.id} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition duration-300">
                
                {/* Header: User & Date */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      {/* First Letter of Host Name */}
                      {(trip.hostName || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Traveler</h4>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">{trip.location}</p>
                    </div>
                  </div>
                  <span className="bg-white/10 text-[10px] font-bold px-3 py-1 rounded-full border border-white/5 text-white/70">
                    {trip.startDate}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-black text-xl mb-2 text-white">{trip.title}</h3>
                <p className="text-sm text-white/60 mb-6 leading-relaxed line-clamp-2">{trip.description}</p>
                
                {/* Footer: Tags & Join */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {trip.tags && trip.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 bg-black/20 text-cyan-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs hover:scale-105 transition shadow-lg">
                    Join ↗
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl border-dashed">
              <p className="text-4xl mb-4">🌍</p>
              <p className="text-white/50 font-bold text-lg">No trips found.</p>
              <p className="text-white/30 text-sm mb-4">Be the first to create one!</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
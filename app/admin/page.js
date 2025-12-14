"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useUserAuth } from "../context/AuthContext";

export default function AdminPanel() {
  // --- 🔒 SECURITY SETTINGS ---
  const ADMIN_EMAIL = "siddhant.anand17@gmail.com"; // <--- CHANGE THIS TO YOUR EMAIL!
  // ----------------------------

  const { user, loading: authLoading } = useUserAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  // 1. SECURITY CHECK
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.email !== ADMIN_EMAIL) {
        alert("ACCESS DENIED: Admins only.");
        router.push("/"); // Kick them out
      } else {
        fetchData(); // Allow access
      }
    }
  }, [user, authLoading]);

  // 2. FETCH ALL DATA
  const fetchData = async () => {
    try {
      // Get Users
      const usersSnap = await getDocs(collection(db, "users"));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Get Trips
      const tripsSnap = await getDocs(collection(db, "trips"));
      setTrips(tripsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 3. DELETE FUNCTIONS
  const handleDeleteUser = async (userId) => {
    if (confirm("Are you sure? This deletes the user PERMANENTLY.")) {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (confirm("Delete this trip?")) {
      await deleteDoc(doc(db, "trips", tripId));
      setTrips(trips.filter(t => t.id !== tripId));
    }
  };

  if (loading || authLoading) return <div className="text-white text-center mt-20 font-bold text-xl">Verifying Admin Access... 🔒</div>;

  return (
    <div className="min-h-screen p-8 text-white">
      
      <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-4">
        <h1 className="text-4xl font-black text-red-500">ADMIN <span className="text-white">PANEL</span></h1>
        <div className="text-right">
          <p className="font-bold text-sm text-white/50">Logged in as</p>
          <p className="text-cyan-400 font-mono">{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab("users")} className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === "users" ? "bg-cyan-500 text-black" : "bg-white/10"}`}>
          Users ({users.length})
        </button>
        <button onClick={() => setActiveTab("trips")} className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === "trips" ? "bg-orange-500 text-black" : "bg-white/10"}`}>
          Trips ({trips.length})
        </button>
      </div>

      {/* --- USERS LIST --- */}
      {activeTab === "users" && (
        <div className="grid gap-4">
          {users.map(u => (
            <div key={u.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={u.photoURL || "https://via.placeholder.com/50"} className="w-12 h-12 rounded-full bg-white/10" />
                <div>
                  <h3 className="font-bold text-lg">{u.name || "Unknown"}</h3>
                  <p className="text-xs text-white/50">{u.email}</p>
                  <p className="text-xs text-white/30 font-mono">{u.id}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteUser(u.id)}
                className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold text-xs transition border border-red-500/30"
              >
                BAN USER 🚫
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- TRIPS LIST --- */}
      {activeTab === "trips" && (
        <div className="grid gap-4">
          {trips.map(t => (
            <div key={t.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-cyan-400">{t.title}</h3>
                <p className="text-sm text-white/70">{t.location} • {t.startDate}</p>
                <p className="text-xs text-white/30 mt-1">Host: {t.hostName}</p>
              </div>
              <button 
                onClick={() => handleDeleteTrip(t.id)}
                className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold text-xs transition border border-red-500/30"
              >
                DELETE TRIP 🗑️
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
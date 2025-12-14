"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useUserAuth } from "../context/AuthContext";

export default function AdminPanel() {
  // --- 🔒 UPDATE THIS EMAIL EXACTLY ---
  const ADMIN_EMAIL = "YOUR_GMAIL_HERE"; 
  // ------------------------------------

  const { user, loading: authLoading } = useUserAuth();
  const router = useRouter();
  const [dataLoading, setDataLoading] = useState(true); // Loading data state
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false); // Permission state

  useEffect(() => {
    // 1. Wait for Auth to finish loading
    if (authLoading) return;

    // 2. Check User
    if (!user) {
      router.push("/"); // Not logged in -> Go Home
      return;
    }

    // 3. Check Email
    if (user.email !== ADMIN_EMAIL) {
      alert(`ACCESS DENIED.\nLogged in as: ${user.email}\nRequired: ${ADMIN_EMAIL}`);
      router.push("/"); // Wrong email -> Go Home
    } else {
      // 4. Success! Allow access and fetch data
      setIsAuthorized(true);
      fetchData();
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const tripsSnap = await getDocs(collection(db, "trips"));
      setTrips(tripsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setDataLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id) => {
    if(confirm("Ban user?")) { await deleteDoc(doc(db, "users", id)); setUsers(users.filter(u=>u.id!==id)); }
  };
  
  const handleDeleteTrip = async (id) => {
    if(confirm("Delete trip?")) { await deleteDoc(doc(db, "trips", id)); setTrips(trips.filter(t=>t.id!==id)); }
  };

  // --- RENDER LOGIC ---

  // 1. Show Loading Screen while checking Auth
  if (authLoading) {
    return <div className="h-screen flex items-center justify-center text-white text-xl font-bold">Checking Identity... 🕵️‍♂️</div>;
  }

  // 2. If not authorized yet (or about to redirect), hide everything
  if (!isAuthorized) {
    return <div className="h-screen flex items-center justify-center text-red-500 font-bold">Verifying Access...</div>;
  }

  // 3. ONLY Show Admin Panel if Authorized
  return (
    <div className="min-h-screen p-8 text-white bg-black">
      <h1 className="text-4xl font-black text-red-500 mb-2">ADMIN PANEL ⚡️</h1>
      <p className="text-green-400 font-mono mb-8">✓ Logged in as {user.email}</p>
      
      {dataLoading ? (
        <p>Loading Data...</p>
      ) : (
        <div className="grid gap-12">
          
          {/* USERS SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-white border-b border-white/20 pb-4 mb-4">Users ({users.length})</h2>
            <div className="grid gap-4">
              {users.map(u => (
                <div key={u.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/10">
                  <div>
                    <p className="font-bold">{u.name || "No Name"}</p>
                    <p className="text-sm text-white/50">{u.email}</p>
                  </div>
                  <button onClick={() => handleDeleteUser(u.id)} className="bg-red-500/20 text-red-400 px-4 py-2 rounded font-bold hover:bg-red-500 hover:text-white transition">Ban 🚫</button>
                </div>
              ))}
            </div>
          </div>

          {/* TRIPS SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-white border-b border-white/20 pb-4 mb-4">Trips ({trips.length})</h2>
            <div className="grid gap-4">
              {trips.map(t => (
                <div key={t.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/10">
                  <div>
                    <p className="font-bold text-cyan-400">{t.title}</p>
                    <p className="text-sm text-white/50">{t.hostName}</p>
                  </div>
                  <button onClick={() => handleDeleteTrip(t.id)} className="bg-red-500/20 text-red-400 px-4 py-2 rounded font-bold hover:bg-red-500 hover:text-white transition">Delete 🗑️</button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
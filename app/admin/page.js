"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useUserAuth } from "../context/AuthContext";

export default function AdminPanel() {
  // --- 🔒 UPDATE THIS EMAIL ---
  const ADMIN_EMAIL = "siddhant.anand17@gmail.com"; // <--- CHANGE THIS
  // ----------------------------

  const { user, loading: authLoading } = useUserAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (!authLoading && user) {
      // DEBUG LOGGING: Open Console (F12) to see this
      console.log("LOGGED IN AS:", user.email);
      console.log("REQUIRED ADMIN:", ADMIN_EMAIL);

      if (user.email !== ADMIN_EMAIL) {
        // Just show an alert instead of kicking out immediately so you can read it
        alert(`ACCESS DENIED.\n\nYou are logged in as: ${user.email}\nThe Admin List allows: ${ADMIN_EMAIL}`);
        router.push("/");
      } else {
        fetchData();
      }
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    const usersSnap = await getDocs(collection(db, "users"));
    setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    const tripsSnap = await getDocs(collection(db, "trips"));
    setTrips(tripsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  if (authLoading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-black text-red-500 mb-6">ADMIN PANEL 🔓</h1>
      <p className="mb-4 text-green-400">Welcome, {user?.email}</p>
      
      <div className="grid gap-8">
        <div>
          <h2 className="text-xl font-bold border-b border-white/20 pb-2 mb-4">Users ({users.length})</h2>
          {users.map(u => <div key={u.id} className="text-sm bg-white/10 p-2 rounded mb-2">{u.email} ({u.name})</div>)}
        </div>
        <div>
          <h2 className="text-xl font-bold border-b border-white/20 pb-2 mb-4">Trips ({trips.length})</h2>
          {trips.map(t => <div key={t.id} className="text-sm bg-white/10 p-2 rounded mb-2">{t.title}</div>)}
        </div>
      </div>
    </div>
  );
}
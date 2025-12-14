"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useUserAuth } from "../context/AuthContext";

export default function Inbox() {
  const { user } = useUserAuth();
  const router = useRouter();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Listen for any chat where YOU are a participant
    const q = query(
      collection(db, "chats"), 
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="py-6 space-y-6">
      <h1 className="text-3xl font-black text-white px-4">Messages 💬</h1>
      
      <div className="space-y-2 px-4">
        {chats.length > 0 ? (
          chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => router.push(`/chat/${chat.id}`)}
              className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                👤
              </div>
              <div className="flex-1">
                {/* Show Trip Title if available, else 'Chat' */}
                <h3 className="font-bold text-white">{chat.tripTitle || "Trip Discussion"}</h3>
                <p className="text-sm text-white/50 truncate">Tap to open chat...</p>
              </div>
              <span className="text-xs text-white/30">Open</span>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed m-4">
            <p className="text-white/50 font-bold">No active chats.</p>
            <p className="text-sm text-white/30 mt-2">Join a trip to start talking!</p>
          </div>
        )}
      </div>
    </div>
  );
}
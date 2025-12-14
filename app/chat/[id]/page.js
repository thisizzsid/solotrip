"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useUserAuth } from "../../context/AuthContext";

export default function ChatRoom() {
  const { id } = useParams(); 
  const { user } = useUserAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const dummyDiv = useRef(null);

  // Listen for Messages
  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, "chats", id, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => dummyDiv.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, [id]);

  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "chats", id, "messages"), {
      text: newMessage,
      senderId: user.uid,
      createdAt: serverTimestamp()
    });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="p-4 bg-white/10 backdrop-blur-md border-b border-white/10 flex items-center gap-3">
        <button onClick={() => router.push("/chat")} className="text-2xl text-white">←</button>
        <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-black">💬</div>
        <h2 className="font-bold text-white">Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm font-medium ${isMe ? "bg-cyan-500 text-black rounded-tr-none" : "bg-white/10 text-white rounded-tl-none border border-white/10"}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={dummyDiv}></div>
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-black/20 backdrop-blur-md border-t border-white/10 flex gap-2">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-white/10 border border-white/10 rounded-full px-6 py-3 text-white outline-none focus:border-cyan-500 transition"/>
        <button type="submit" className="bg-cyan-500 w-12 h-12 rounded-full flex items-center justify-center text-black font-bold shadow-lg">➤</button>
      </form>
    </div>
  );
}
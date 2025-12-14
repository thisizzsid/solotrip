"use client";
import Link from "next/link";

export default function ChatList() {
  const chats = [
    { id: 1, name: "Rohan K.", msg: "Hey! Are you confirmed?", time: "2m ago", unread: 2, avatar: "RK", color: "bg-cyan-700" },
    { id: 2, name: "Goa Trip Group", msg: "Sneha: I booked!", time: "1h ago", unread: 0, avatar: "GT", color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4">
      <Link href="/dashboard" className="text-slate-500 font-bold mb-4 block">← Back</Link>
      <h1 className="text-2xl font-black text-slate-800 mb-6">Messages</h1>

      <div className="space-y-2">
        {chats.map((chat) => (
          // THIS LINK MUST MATCH THE FOLDER NAME
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:bg-slate-50">
              <div className={`w-12 h-12 ${chat.color} rounded-full flex items-center justify-center text-white font-bold`}>{chat.avatar}</div>
              <div>
                <h3 className="font-bold text-slate-800">{chat.name}</h3>
                <p className="text-sm text-slate-500">{chat.msg}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
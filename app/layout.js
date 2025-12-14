"use client";
import "./globals.css";
import { Outfit } from "next/font/google";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContextProvider, useUserAuth } from "./context/AuthContext";
import { auth } from "./firebase"; // Import auth to allow logout

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans min-h-screen flex flex-col bg-black text-white`}>
        <AuthContextProvider>
           <MainLayout>{children}</MainLayout>
        </AuthContextProvider>
      </body>
    </html>
  );
}

function MainLayout({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUserAuth(); 

  const toggleTheme = () => setDarkMode(!darkMode);

  // Hide Navbar only on Login Page
  const showNav = pathname !== "/login";

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? "dark bg-black text-white" : "bg-cyan-50 text-slate-900"}`}>
      
        {/* --- ANIMATED BACKGROUND --- */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 bg-white/5 dark:bg-black/10 backdrop-blur-[1px]"></div>
        </div>

        {/* --- NAVIGATION HEADER --- */}
        {showNav && (
          <header className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-lg transition-all">
            
            {/* 1. Logo */}
            <div onClick={() => router.push("/")} className="cursor-pointer">
              <h1 className="text-2xl font-black tracking-tighter italic">
                SOLO<span className="text-cyan-400">TRIP</span>
              </h1>
            </div>

            {/* 2. Navigation Controls */}
            <div className="flex items-center gap-3">
              
              {!loading && user ? (
                // --- STATE: LOGGED IN ---
                <>
                  <button onClick={() => router.push("/dashboard")} className="w-10 h-10 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30 flex items-center justify-center transition" title="Dashboard">
                    🏠
                  </button>
                  
                  <button onClick={() => router.push("/chat")} className="w-10 h-10 rounded-full bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/30 flex items-center justify-center transition" title="Messages">
                    💬
                  </button>

                  <button onClick={() => router.push("/profile")} className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden hover:border-cyan-400 transition" title="Profile">
                    <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-xs text-white">
                      {user.displayName ? user.displayName[0].toUpperCase() : "ME"}
                    </div>
                  </button>

                  {/* Temporary Log Out Button in Header for Testing */}
                  <button 
                    onClick={() => auth.signOut().then(() => router.push("/"))}
                    className="ml-2 text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-2 rounded-full"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                // --- STATE: LOGGED OUT ---
                <button 
                  onClick={() => router.push("/login")}
                  className="bg-cyan-500 text-black px-6 py-3 rounded-full font-black text-sm hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse"
                >
                  LOG IN →
                </button>
              )}
              
              {/* Theme Toggle */}
              <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition border border-white/10">
                {darkMode ? "☀️" : "🌙"}
              </button>

            </div>
          </header>
        )}

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 z-10 relative pb-20">
          {children}
        </main>

        {/* --- FOOTER --- */}
        {showNav && (
          <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md py-8 text-center z-10 relative">
            <h2 className="font-black text-lg opacity-50 mb-2">SOLO<span className="text-cyan-500">TRIP</span></h2>
            <div className="flex justify-center gap-6 text-sm font-bold opacity-60 mb-4">
              <a href="/info/about" className="hover:text-cyan-400 transition">About</a>
              <a href="/info/safety" className="hover:text-cyan-400 transition">Safety</a>
              <a href="/info/terms" className="hover:text-cyan-400 transition">Terms</a>
              <a href="/info/contact" className="hover:text-cyan-400 transition">Contact</a>
            </div>
            <p className="text-xs opacity-30">© 2025 SoloTrip India.</p>
          </footer>
        )}
    </div>
  );
}
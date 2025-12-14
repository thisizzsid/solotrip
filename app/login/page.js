"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already has a profile
      const docSnap = await getDoc(doc(db, "users", user.uid));
      
      if (docSnap.exists()) {
        // User exists -> Go to Dashboard
        router.push("/dashboard");
      } else {
        // New User -> Go to Create Profile
        router.push("/create-profile");
      }

    } catch (error) {
      console.error("Login Failed:", error);
      alert("Login Failed: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl transition-colors text-center">
        
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2 dark:text-white text-slate-900">
            SOLO<span className="text-cyan-500">TRIP</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">
            Join the community of travelers.
          </p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-black font-bold py-4 rounded-xl shadow-lg hover:scale-105 transition flex items-center justify-center gap-3 border border-slate-200"
        >
          {/* Google Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-xs text-slate-400">
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
        </p>

      </div>
    </div>
  );
}
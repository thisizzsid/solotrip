"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebase"; 
import { doc, setDoc } from "firebase/firestore"; 
import { useUserAuth } from "../context/AuthContext"; 

export default function CreateProfile() {
  const router = useRouter();
  const { user, loading: authLoading } = useUserAuth(); 
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); 

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    interests: []
  });

  const interestsList = ["🏔️ Trekking", "🏍️ Road Trips", "🍜 Foodie", "🧘 Spiritual", "🎒 Backpacking", "📸 Photography", "🏖️ Beach"];

  // AUTO-FILL NAME FROM GOOGLE
  useEffect(() => {
    if (user?.displayName) {
      setFormData(prev => ({ ...prev, name: user.displayName }));
    }
  }, [user]);

  const toggleInterest = (tag) => {
    if (formData.interests.includes(tag)) {
      setFormData({ ...formData, interests: formData.interests.filter(t => t !== tag) });
    } else {
      if (formData.interests.length < 5) setFormData({ ...formData, interests: [...formData.interests, tag] });
    }
  };

  const handleSubmit = async () => {
    setErrorMsg(""); 

    if (!user) {
      setErrorMsg("Error: You are not logged in. Please go back to Login.");
      return;
    }
    if (!formData.name || !formData.bio) {
      setErrorMsg("Error: Please fill in Name and Bio.");
      return;
    }

    setSaving(true);
    try {
      console.log("Attempting to save user:", user.uid);

      // --- UPDATED SAVE LOGIC FOR GOOGLE LOGIN ---
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email, // SAVING EMAIL INSTEAD OF PHONE
        photoURL: user.photoURL || "", // SAVE GOOGLE PHOTO IF AVAILABLE
        name: formData.name,
        bio: formData.bio,
        interests: formData.interests,
        joinedAt: new Date(),
        verified: false,
        trustScore: 3.0
      });

      console.log("Success!");
      router.push("/dashboard");

    } catch (error) {
      console.error("Firestore Error:", error);
      if (error.code === "permission-denied") {
        setErrorMsg("Database Permission Denied. Did you enable 'Test Mode' in Firestore Rules?");
      } else {
        setErrorMsg("Save Failed: " + error.message);
      }
    }
    setSaving(false);
  };

  if (authLoading) return <div className="text-white text-center mt-20">Loading User...</div>;

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center items-center">
      <div className="w-full max-w-2xl p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black text-white">Create Profile</h1>
          <p className="text-white/50 mt-2">Tell the community who you are.</p>
        </div>

        {/* ERROR BOX */}
        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl mb-6 font-bold">
            {errorMsg}
          </div>
        )}

        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-cyan-500 uppercase mb-2">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Siddhant Anand" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-xl font-bold text-white outline-none focus:border-cyan-500 transition" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-cyan-500 uppercase mb-2">Short Bio</label>
            <textarea 
              rows="3"
              placeholder="I love mountains..." 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-xl font-bold text-white outline-none focus:border-cyan-500 transition" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-cyan-500 uppercase mb-2">Interests</label>
            <div className="flex flex-wrap gap-3">
              {interestsList.map((tag) => (
                <button 
                  key={tag}
                  onClick={() => toggleInterest(tag)}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition border ${
                    formData.interests.includes(tag) 
                    ? "bg-cyan-500 text-black border-cyan-500" 
                    : "bg-white/5 text-white/50 border-white/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={saving}
            className={`w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-xl shadow-lg mt-4 ${saving ? "opacity-50" : ""}`}
          >
            {saving ? "Saving..." : "Complete Profile 🚀"}
          </button>

        </div>
      </div>
    </div>
  );
}
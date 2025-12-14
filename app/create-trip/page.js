"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUserAuth } from "../context/AuthContext";

export default function CreateTrip() {
  const router = useRouter();
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(false);

  const [tripData, setTripData] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    tags: []
  });

  const availableTags = ["Trekking", "Beach", "Road Trip", "Relaxing", "Workation", "Party"];

  const toggleTag = (tag) => {
    if (tripData.tags.includes(tag)) {
      setTripData({ ...tripData, tags: tripData.tags.filter(t => t !== tag) });
    } else {
      if (tripData.tags.length < 3) setTripData({ ...tripData, tags: [...tripData.tags, tag] });
    }
  };

  const handlePublish = async () => {
    if (!tripData.title || !tripData.location || !tripData.startDate) {
      alert("Please fill in the main details.");
      return;
    }

    setLoading(true);
    try {
      // 1. Save to "trips" collection
      await addDoc(collection(db, "trips"), {
        ...tripData,
        hostId: user.uid,
        hostName: user.displayName || "Traveler", // Will fix getting real name in Dashboard
        createdAt: serverTimestamp(),
        participants: [user.uid] // Host is the first participant
      });

      // 2. Go back to Dashboard
      alert("Trip Published! 🚀");
      router.push("/dashboard");

    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to publish trip.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-10 flex justify-center items-start">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        
        <h1 className="text-3xl font-black text-white mb-6">Plan a New Trip 🌍</h1>

        <div className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-cyan-500 uppercase">Trip Title</label>
            <input 
              type="text" 
              placeholder="e.g. Weekend in Manali"
              value={tripData.title}
              onChange={(e) => setTripData({...tripData, title: e.target.value})}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-cyan-500 mt-1"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold text-cyan-500 uppercase">Location</label>
            <input 
              type="text" 
              placeholder="e.g. Kasol, Himachal Pradesh"
              value={tripData.location}
              onChange={(e) => setTripData({...tripData, location: e.target.value})}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-cyan-500 mt-1"
            />
          </div>

          {/* Dates */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-cyan-500 uppercase">Start Date</label>
              <input 
                type="date" 
                value={tripData.startDate}
                onChange={(e) => setTripData({...tripData, startDate: e.target.value})}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-cyan-500 mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-cyan-500 uppercase">End Date</label>
              <input 
                type="date" 
                value={tripData.endDate}
                onChange={(e) => setTripData({...tripData, endDate: e.target.value})}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-cyan-500 mt-1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-cyan-500 uppercase">Plan Details</label>
            <textarea 
              rows="3"
              placeholder="What's the plan? Trekking? Partying?"
              value={tripData.description}
              onChange={(e) => setTripData({...tripData, description: e.target.value})}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-medium outline-none focus:border-cyan-500 mt-1"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold text-cyan-500 uppercase mb-2 block">Vibe (Select 3)</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button 
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                    tripData.tags.includes(tag) 
                    ? "bg-cyan-500 text-black border-cyan-500" 
                    : "bg-white/5 text-white/50 border-white/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button 
            onClick={handlePublish}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black py-4 rounded-xl shadow-lg hover:scale-[1.02] transition transform mt-4"
          >
            {loading ? "Publishing..." : "Publish Trip 🚀"}
          </button>

        </div>
      </div>
    </div>
  );
}
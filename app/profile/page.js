"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // To link to Settings

export default function AestheticProfile() {
  const router = useRouter(); // Enable navigation
  const [showCamera, setShowCamera] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [filter, setFilter] = useState("none");
  const [mirror, setMirror] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 1. Start Camera
  const startCamera = async () => {
    setShowCamera(true);
    // Tiny delay to ensure modal is rendered before accessing videoRef
    setTimeout(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error(err);
            alert("Camera failed. Check permissions!");
            setShowCamera(false);
        }
    }, 100);
  };

  // 2. Capture Photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (mirror) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    // Capture the current frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to image
    const imageUrl = canvas.toDataURL("image/png");
    setProfilePic(imageUrl);
    stopCamera();
  };

  // 3. Stop Camera
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach(track => track.stop());
    setShowCamera(false);
  };

  // 4. File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen font-sans pb-32">
      
      {/* Header */}
      <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-600 relative">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-20 relative z-10">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center transition-colors duration-300">
          
          {/* DP Circle */}
          <div className="relative mb-4">
             <div 
               className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-lg ${filter}`}
               style={{ transform: mirror ? "scaleX(-1)" : "none" }}
             >
                {profilePic ? (
                  <img src={profilePic} alt="DP" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-4xl">😎</div>
                )}
             </div>
             
             {/* Camera Button */}
             <button 
               onClick={startCamera}
               className="absolute bottom-0 right-0 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition"
             >
               📷
             </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Siddhant Anand</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">@sid_travels</p>

          {/* Stats */}
          <div className="flex gap-8 mt-6 w-full justify-center border-t border-slate-100 dark:border-white/5 pt-6">
             <div>
               <p className="text-xl font-black text-slate-800 dark:text-white">12</p>
               <p className="text-xs font-bold text-slate-400 uppercase">Trips</p>
             </div>
             <div>
               <p className="text-xl font-black text-orange-500">4.8</p>
               <p className="text-xs font-bold text-slate-400 uppercase">Trust</p>
             </div>
          </div>
        </div>

        {/* --- SETTINGS MENU --- */}
        <div className="mt-6 space-y-3">
          
          {/* Account Settings */}
          <button 
            onClick={() => router.push("/settings")} 
            className="w-full bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 font-bold text-slate-700 dark:text-slate-200 flex justify-between hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
          >
            Account Settings <span>›</span>
          </button>
          
          {/* Privacy */}
          <button 
            onClick={() => router.push("/settings")} 
            className="w-full bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 font-bold text-slate-700 dark:text-slate-200 flex justify-between hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
          >
            Privacy <span>›</span>
          </button>
          
          {/* Help */}
          <button 
            onClick={() => router.push("/settings")} 
            className="w-full bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 font-bold text-slate-700 dark:text-slate-200 flex justify-between hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
          >
            Help & Support <span>›</span>
          </button>

          {/* Logout */}
          <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl font-bold text-red-500 text-center cursor-pointer border border-red-100 dark:border-red-500/10">
            Log Out
          </div>
        </div>

      </div>

      {/* --- CAMERA MODAL --- */}
      {showCamera && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          
          {/* Top Bar */}
          <div className="p-4 flex justify-between items-center bg-black">
            <button onClick={stopCamera} className="text-white font-bold">Cancel</button>
            <span className="text-white/50 text-xs font-bold uppercase">Photo Studio</span>
            <div className="w-10"></div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`h-full w-full object-cover transition-all duration-300 ${filter}`}
              style={{ transform: mirror ? "scaleX(-1)" : "none" }}
            />
          </div>

          {/* Controls */}
          <div className="bg-zinc-900 p-6 pb-24 rounded-t-3xl border-t border-white/10">
             
             {/* Filter Scroll */}
             <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                <button onClick={() => setFilter("none")} className="flex-shrink-0 px-4 py-2 bg-zinc-800 rounded-full text-xs font-bold text-white border border-white/10 hover:bg-white hover:text-black transition">Normal</button>
                <button onClick={() => setFilter("grayscale(100%)")} className="flex-shrink-0 px-4 py-2 bg-zinc-800 rounded-full text-xs font-bold text-white border border-white/10 hover:bg-white hover:text-black transition">B&W</button>
                <button onClick={() => setFilter("saturate(200%)")} className="flex-shrink-0 px-4 py-2 bg-zinc-800 rounded-full text-xs font-bold text-white border border-white/10 hover:bg-lime-400 hover:text-black transition">Vivid</button>
                <button onClick={() => setFilter("sepia(50%) contrast(120%)")} className="flex-shrink-0 px-4 py-2 bg-zinc-800 rounded-full text-xs font-bold text-white border border-white/10 hover:bg-orange-200 hover:text-orange-900 transition">Vintage</button>
             </div>

             <div className="flex justify-between items-center px-4">
                
                {/* Upload */}
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                   <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-white">🖼️</div>
                   <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>

                {/* Shutter */}
                <button 
                  onClick={capturePhoto} 
                  className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-90 transition"
                ></button>

                {/* Mirror */}
                <button onClick={() => setMirror(!mirror)} className="flex flex-col items-center gap-1">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition ${mirror ? 'bg-cyan-500 text-black' : 'bg-zinc-800'}`}>🔄</div>
                </button>
             </div>
          </div>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
      )}

    </div>
  );
}
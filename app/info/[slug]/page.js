"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

// --- CONTENT DATABASE ---
const CONTENT = {
  about: {
    title: "About SoloTrip",
    icon: "🚀",
    text: "SoloTrip is India's largest community for solo travelers. We connect backpackers, digital nomads, and trekkers to explore India together. Founded in Bihar with ❤️."
  },
  safety: {
    title: "Safety First",
    icon: "🛡️",
    text: "We take safety seriously. All users must verify their Government ID. We also have a 24/7 SOS helpline and a 'Trust Score' system to ensure you travel with verified people."
  },
  terms: {
    title: "Terms & Conditions",
    icon: "📜",
    text: "By using SoloTrip, you agree to be respectful to other travelers. Zero tolerance for harassment. We reserve the right to ban users who violate our community guidelines."
  },
  contact: {
    title: "Contact Us",
    icon: "📞",
    text: "Need help? Reach out to us at:\n\nEmail: support@solotrip.in\nPhone: +91 98765 43210\nOffice: Patna, Bihar, India"
  }
};

export default function InfoPage() {
  const params = useParams();
  const slug = params.slug; // e.g., 'about', 'safety'
  const data = CONTENT[slug] || CONTENT.about; // Default to About if not found

  return (
    <div className="min-h-screen py-20 px-4 flex items-center justify-center">
      <div className="bg-white/5 dark:bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-2xl w-full shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{data.icon}</div>
          <h1 className="text-4xl font-black text-white">{data.title}</h1>
          <div className="w-20 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
          <p className="text-lg text-white/80 leading-relaxed whitespace-pre-wrap font-medium">
            {data.text}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
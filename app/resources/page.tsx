"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ResourcesPage() {
  const router = useRouter();

  // Read the link from the environment variable. 
  // We provide a fallback just in case the variable is missing.
  const targetLink = process.env.NEXT_PUBLIC_DASHBOARD_LINK || "https://google.com";

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      router.push("/login");
      router.refresh(); 
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 flex flex-col items-center" style={{ background: "#111", color: "#fff" }}>
      
      <div className="w-full max-w-4xl flex justify-end mb-8">
        <button 
          onClick={handleLogout}
          className="px-6 py-2 rounded-lg font-bold border transition-opacity hover:opacity-80"
          style={{ borderColor: "#fac203", color: "#fac203", background: "transparent" }}
        >
          Log Out
        </button>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: "#fac203" }}>
        Welcome to your Dashboard
      </h1>

      {/* The <a> tag now uses the targetLink variable */}
      <a 
        href={targetLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block transition-transform hover:scale-105 duration-300"
      >
        <Image 
          src="/b2bresources.png" 
          alt="Click to visit link" 
          width={600} 
          height={400} 
          className="rounded-2xl shadow-2xl object-cover"
          style={{ border: "2px solid #fac203" }}
          priority 
        />
      </a>
      
      <p className="mt-6 opacity-70 text-sm">Click the image above to continue</p>
    </div>
  );
}
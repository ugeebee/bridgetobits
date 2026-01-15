"use client";


import Section from "@/components/section";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  return (
    <div className="mt-20 sm:mt-32 min-h-screen px-4" style={{ background: '#111', color: '#fff', fontFamily: 'Inter, Montserrat, Arial, sans-serif' }}>
      <div className="fixed top-4 left-4 sm:top-[-16px] sm:left-6 z-50 hidden lg:block">
        <Link href="/">
          <Image
            src="/logos/b2b_logo.svg"
            alt="Bridge to BITS Logo"
            width={180}
            height={180}
            className="w-32 h-32 sm:w-44 sm:h-44 drop-shadow-2xl"
            priority
            style={{ background: '#111', borderRadius: 'clamp(1rem, 2vw, 1.5rem)', border: '2px solid #fac203' }}
          />
        </Link>
      </div>
      <Section>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg text-center px-4" style={{ color: '#fff', opacity: 0.85, fontFamily: 'Inter, Montserrat, Arial, sans-serif' }}>
          Have a question or want to get in touch? Fill out the form below and our team will get back to you within 24 hours.
        </p>
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start justify-center max-w-6xl mx-auto">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setStatus("sending");
                const res = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(form),
                });

                if (!res.ok) throw new Error("Failed to send");

                setStatus("sent");
                setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
              } catch (err) {
                console.error("Email send failed", err);
                setStatus("error");
              }
            }}
            className="card grid gap-4 w-full max-w-lg p-4 sm:p-6 shadow-lg border border-yellow-400 bg-[#181818]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium" style={{ color: '#fac203' }}>First Name</span>
                <input required className="input bg-black text-white border border-yellow-400 min-h-[48px] text-base" placeholder="First name" autoComplete="given-name" value={form.firstName} onChange={(e)=>setForm(f=>({...f, firstName:e.target.value}))} />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium" style={{ color: '#fac203' }}>Last Name</span>
                <input required className="input bg-black text-white border border-yellow-400 min-h-[48px] text-base" placeholder="Last name" autoComplete="family-name" value={form.lastName} onChange={(e)=>setForm(f=>({...f, lastName:e.target.value}))} />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium" style={{ color: '#fac203' }}>Email Address</span>
              <input type="email" required className="input bg-black text-white border border-yellow-400 min-h-[48px] text-base" placeholder="you@example.com" autoComplete="email" pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$" value={form.email} onChange={(e)=>setForm(f=>({...f, email:e.target.value}))} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium" style={{ color: '#fac203' }}>Phone Number</span>
              <input type="tel" required className="input bg-black text-white border border-yellow-400 min-h-[48px] text-base" placeholder="+91 9876543210" autoComplete="tel" pattern="^\+\d{1,4}\s?\d{10}$" maxLength={15} minLength={10} value={form.phone} onChange={(e)=>setForm(f=>({...f, phone:e.target.value}))} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium" style={{ color: '#fac203' }}>Message</span>
              <textarea required className="input bg-black text-white border border-yellow-400 min-h-[120px] text-base resize-y" rows={5} placeholder="How can we help?" value={form.message} onChange={(e)=>setForm(f=>({...f, message:e.target.value}))} />
            </label>
            <button disabled={status==="sending"} className="btn btn-primary w-full py-3 text-base sm:text-lg mt-2 min-h-[52px] disabled:opacity-70 disabled:cursor-not-allowed" style={{ background: '#FFD600', color: '#111', border: 'none', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 'bold' }}>{status==="sending"?"Sending…":"Send Message"}</button>
            {status === "sent" && (
              <div className="bg-green-50 border border-green-200 rounded p-3 text-green-700 text-center mt-2">
                <div className="font-semibold mb-1">Thank you for reaching out!</div>
                <div>We’ve received your message and will reply within 24 hours.</div>
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-center mt-2">
                <div className="font-semibold mb-1">We couldn't send your message.</div>
                <div>Please email us directly at <a className="underline" href="mailto:bridgetobits@gmail.com">bridgetobits@gmail.com</a> while we fix this.</div>
              </div>
            )}
          </form>
          <div className="flex-1 flex flex-col gap-6 items-center lg:items-start mt-6 lg:mt-0 w-full max-w-lg">
            <div className="card p-4 sm:p-6 w-full h-full flex flex-col justify-between bg-[#181818] border border-yellow-400 shadow-lg min-h-[400px]">
              <div>
                <div className="font-semibold text-lg sm:text-xl mb-3 text-center lg:text-left" style={{ color: '#fac203' }}>Alternative Contact</div>
                <div className="text-sm sm:text-base mb-4 text-center lg:text-left break-words" style={{ color: '#fff', opacity: 0.85 }}>
                  Email: <a href="mailto:bridgetobits@gmail.com" className="underline font-medium break-all" style={{ color: '#FFD600' }}>bridgetobits@gmail.com</a>
                </div>
                <div className="flex flex-row gap-4 sm:gap-6 justify-center lg:justify-start mb-6">
                  <a href="https://instagram.com/bridgetobits" target="_blank" rel="noopener" title="Instagram" className="text-white hover:text-yellow-400 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <FaInstagram size={28} />
                  </a>
                  <a href="https://www.linkedin.com/company/bridge-to-bits/" target="_blank" rel="noopener" title="LinkedIn" className="text-white hover:text-yellow-400 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <FaLinkedin size={28} />
                  </a>
                  <a href="https://www.youtube.com/@BridgetoBITS22" target="_blank" rel="noopener" title="YouTube" className="text-white hover:text-yellow-400 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <FaYoutube size={28} />
                  </a>
                </div>
                <div className="text-sm sm:text-base font-medium mb-2 text-center lg:text-left" style={{ color: '#fac203' }}>Location</div>
                <div className="rounded-lg overflow-hidden border border-yellow-400 shadow-sm w-full h-40 mb-2">
                  <iframe
                    title="BITS Pilani Hyderabad Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=78.574%2C17.544%2C78.578%2C17.548&amp;layer=mapnik&amp;marker=17.546%2C78.576"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="text-xs text-gray-400 text-center md:text-left">BITS Pilani, Hyderabad Campus</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center md:text-left">
              We’ll also send a confirmation email: “We got your message, we’ll reply within 24 hours.”
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

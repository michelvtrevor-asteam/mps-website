"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Sparkles } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Programs" },
  { href: "/facilities", label: "Facilities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/admissions", label: "Admissions" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled
        ? "py-3 bg-white/80 backdrop-blur-xl shadow-lg shadow-zinc-200/30"
        : "py-5 bg-transparent"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
        <Link href="/" className="group flex items-center gap-2 sm:gap-3">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 transition-transform duration-500 group-hover:scale-105 drop-shadow-md">
            <Image src="/logo.png" alt="Maanvi's Preschool Logo" fill className="object-contain" priority />
          </div>
          <div className="leading-none flex flex-col justify-center">
            <div className="font-display text-lg font-extrabold tracking-tight text-zinc-900 md:text-xl">
              Maanvi’s <span className="text-brand-pink">Preschool</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              <span className="h-1 w-1 rounded-full bg-brand-yellow"></span>
              Kakinada Excellence
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 rounded-full border border-zinc-200/50 bg-white/50 p-1.5 backdrop-blur-sm lg:flex">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-4 py-2 text-sm font-bold tracking-tight transition-all duration-300 ${isActive
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-white"
                  }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admissions"
            className="group relative hidden overflow-hidden rounded-2xl bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-pink/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-pink/40 sm:flex"
          >
            <span className="relative z-10 flex items-center gap-2">
              Apply Now <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </Link>

          <Link
            href="/login"
            className="hidden rounded-2xl border-2 border-zinc-900/5 bg-white px-5 py-2 text-sm font-bold text-zinc-900 transition-all duration-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white md:flex"
          >
            Portal
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-full z-50 h-screen bg-white/95 p-6 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-white p-4 text-lg font-bold text-zinc-900 shadow-sm"
              >
                {l.label}
                <ChevronRight className="h-5 w-5 text-brand-pink" />
              </Link>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/admissions"
                className="flex items-center justify-center rounded-2xl bg-brand-pink p-4 font-bold text-white shadow-lg shadow-brand-pink/20"
              >
                Apply Now
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center rounded-2xl bg-zinc-900 p-4 font-bold text-white shadow-lg shadow-zinc-900/20"
              >
                Portal
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

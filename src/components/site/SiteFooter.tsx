import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Sparkles,
  ChevronRight
} from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-zinc-200 bg-white pt-24 pb-12">
      {/* Background Ornaments */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-pink/5 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-brand-sky/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative h-20 w-20 shrink-0 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 drop-shadow-sm">
                <Image src="/logo.png" alt="Maanvi's Preschool Logo" fill className="object-contain" />
              </div>
              <div className="font-display text-lg font-extrabold tracking-tight text-zinc-900 flex flex-col justify-center">
                Maanvi’s <span className="text-brand-pink">Preschool</span>
              </div>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-zinc-600">
              A premium, world-class early learning environment in Kakinada.
              We blend international standards with heartfelt care to nurture
              tomorrow&apos;s leaders.
            </p>
            <div className="mt-8 flex items-center gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 transition-all hover:bg-brand-pink hover:text-white hover:shadow-lg hover:shadow-brand-pink/20"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-black uppercase tracking-widest text-zinc-900">Explore</h3>
            <nav className="mt-6 grid gap-4">
              {["About Us", "Programs", "Facilities", "Gallery", "Admissions"].map((l) => (
                <Link
                  key={l}
                  href={`/${l.toLowerCase().replace(" ", "")}`}
                  className="group flex items-center gap-2 text-sm font-bold text-zinc-600 transition-colors hover:text-brand-pink"
                >
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  {l}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-sm font-black uppercase tracking-widest text-zinc-900">Get in Touch</h3>
            <div className="mt-6 space-y-6">
              <a href="https://maps.app.goo.gl/Eep5QdMAjAtS2DMc8" target="_blank" rel="noopener noreferrer" className="flex gap-4 group hover:bg-zinc-50 rounded-xl p-2 -ml-2 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink transition-transform group-hover:scale-110 group-hover:-rotate-6">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-brand-pink transition-colors">Visit Us</div>
                  <div className="mt-1 text-sm font-bold text-zinc-900 leading-snug">
                    Near Santhi Nursing, Beside SBI ATM<br />
                    Dairy Farm Center, Kakinada – 533001
                  </div>
                </div>
              </a>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-sky/10 text-brand-sky">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">Call Us</div>
                  <div className="mt-1 flex flex-col gap-1 text-sm font-bold text-zinc-900">
                    <a href="tel:+919948888966" className="hover:text-brand-sky transition-colors">+91 99488 88966</a>
                    <a href="tel:+919948888677" className="hover:text-brand-sky transition-colors">+91 99488 88677</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter / CTA */}
          <div className="rounded-[2rem] bg-zinc-900 p-8 text-white shadow-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pink/20 text-brand-pink">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="mt-6 font-display text-xl font-black">Stay Updated</h3>
            <p className="mt-2 text-xs text-zinc-400">Get the latest news and event updates from Maanvi’s Preschool.</p>
            <Link
              href="/admissions"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-pink py-3 text-sm font-bold text-white transition-transform hover:scale-105"
            >
              Enroll Now <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-20 border-t border-zinc-100 pt-8">
          <div className="flex flex-col gap-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 md:flex-row md:justify-between md:text-left">
            <div>© {new Date().getFullYear()} Maanvi’s Preschool. Crafted with Love.</div>
            <div className="flex justify-center gap-8">
              <Link href="/privacy" className="hover:text-brand-pink">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-brand-pink">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  ArrowRight,
  Send,
  ExternalLink
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="bg-brand-sky py-16 md:py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/80">
              Get in Touch
            </div>
            <h1 className="mt-8 font-display text-5xl font-black tracking-tight md:text-5xl">
              We’d Love to <br />
              <span className="text-zinc-900">Hear from You.</span>
            </h1>
            <p className="mt-8 text-lg opacity-90 md:text-xl text-sky-900">
              Whether you have a question about admissions, daycare timings,
              or just want to say hello, our team is ready to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-12 ">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Info Cards */}
          <div className="space-y-6 lg:col-span-1">
            <div className="group rounded-[2rem] border border-zinc-200 bg-white p-8 transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-pink/10 text-brand-pink transition-transform group-hover:rotate-12">
                <Phone className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">Call Us</h3>
              <p className="mt-2 text-zinc-500">Available Mon-Sat, 8am - 6pm</p>
              <a href="tel:+919948888966" className="mt-4 block font-bold text-zinc-900 hover:text-brand-pink transition-colors">
                +91 99488 88966
              </a>
              <a href="tel:+919948888677" className="mt-2 block font-bold text-zinc-900 hover:text-brand-pink transition-colors">
                +91 99488 88677
              </a>
            </div>

            <div className="group rounded-[2rem] border border-zinc-200 bg-white p-8 transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-sky/10 text-brand-sky transition-transform group-hover:rotate-12">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">Email Us</h3>
              <p className="mt-2 text-zinc-500">We usually reply within 24 hours</p>
              <a href="mailto:info@maanvispreschool.com" className="mt-4 block font-bold text-zinc-900 hover:text-brand-pink transition-colors">
                info@maanvispreschool.com
              </a>
            </div>

            <div className="group rounded-[2rem] border border-zinc-200 bg-white p-8 transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow/10 text-brand-yellow transition-transform group-hover:rotate-12">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900">Visit Us</h3>
              <p className="mt-2 text-zinc-500 text-sm">Near Santhi Nursing, Beside SBI ATM<br />Dairy Farm Center, Kakinada – 533001</p>
              <a href="https://maps.app.goo.gl/Eep5QdMAjAtS2DMc8" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 font-bold text-zinc-900 hover:text-brand-pink transition-colors">
                Get Directions <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact Form Placeholder / Map */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-[3rem] border border-zinc-200 bg-white p-8 shadow-2xl md:p-10">
              <div className="mb-10">
                <h2 className="font-display text-5xl font-black text-zinc-900">Send a Message</h2>
                <p className="mt-2 text-zinc-500">Have a specific inquiry? Drop us a line below.</p>
              </div>

              <form className="space-y-6">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Full Name</label>
                    <input className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-pink focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email Address</label>
                    <input className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-pink focus:bg-white" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Subject</label>
                  <input className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-pink focus:bg-white" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Message</label>
                  <textarea rows={4} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-brand-pink focus:bg-white" />
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-[2rem] bg-zinc-900 py-5 text-lg font-bold text-white shadow-xl transition-all hover:bg-brand-pink">
                  Send Message <Send className="h-5 w-5" />
                </button>
              </form>
            </div>

            <div className="relative overflow-hidden rounded-[3rem] border border-zinc-200 bg-zinc-100 aspect-[21/9]">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
                  <MapPin className="h-8 w-8 text-brand-pink" />
                </div>
                <h3 className="font-display text-xl font-bold text-zinc-900">Find Us on the Map</h3>
                <p className="mt-2 text-sm text-zinc-500 max-w-xs mx-auto">Click to open Google Maps and find the best route to our campus.</p>
                <a href="https://maps.app.goo.gl/Eep5QdMAjAtS2DMc8" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-bold shadow-md border border-zinc-100 hover:bg-zinc-50">
                  Open Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919948888966"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl transition-transform hover:scale-110 hover:rotate-12 active:scale-95"
      >
        <MessageCircle className="h-8 w-8" />
      </a>
    </div>
  );
}

import Link from "next/link";
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  FileText, 
  UserPlus, 
  MailCheck,
  Sparkles
} from "lucide-react";
import { AdmissionForm } from "@/app/(public)/admissions/AdmissionForm";

export default function AdmissionsPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="bg-brand-pink py-16 md:py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/80">
              Join Our Family
            </div>
            <h1 className="mt-8 font-display text-5xl font-black tracking-tight md:text-5xl">
              Start Your Child’s <br />
              <span className="text-brand-yellow">Journey Here.</span>
            </h1>
            <p className="mt-8 text-lg opacity-90 md:text-xl">
              Our admission process is simple, transparent, and designed to help 
              us understand your child’s unique needs from day one.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-12 ">
        <div className="grid gap-20 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-5xl font-black tracking-tight text-zinc-900">
              The Admission <span className="text-brand-pink">Process</span>
            </h2>
            <p className="mt-6 text-lg text-zinc-600">
              Follow these simple steps to secure a place for your little one 
              at Kakinada’s most loved preschool.
            </p>

            <div className="mt-12 space-y-8">
              {[
                {
                  step: "01",
                  title: "Online Inquiry",
                  desc: "Fill out the digital form on this page with your child's basic details.",
                  icon: FileText,
                  color: "text-brand-pink"
                },
                {
                  step: "02",
                  title: "Admin Review",
                  desc: "Our admissions team will review your application and check for seat availability.",
                  icon: ShieldCheck,
                  color: "text-brand-sky"
                },
                {
                  step: "03",
                  title: "Interaction & Tour",
                  desc: "We’ll invite you and your child for a joyful interaction and a tour of our facilities.",
                  icon: Sparkles,
                  color: "text-brand-yellow"
                },
                {
                  step: "04",
                  title: "Enrollment",
                  desc: "Once approved, you'll receive your portal login and a welcome kit to start the journey!",
                  icon: MailCheck,
                  color: "text-emerald-500"
                }
              ].map((item) => (
                <div key={item.step} className="group flex gap-8">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-zinc-50 font-display text-2xl font-black text-zinc-300 transition-colors group-hover:bg-brand-pink group-hover:text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 font-display text-xl font-bold text-zinc-900">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 rounded-[2.5rem] bg-zinc-900 p-10 text-white shadow-2xl">
              <h3 className="font-display text-2xl font-bold">Need assistance?</h3>
              <p className="mt-4 text-zinc-400">Our admissions officer is here to help you through the process.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a href="tel:+91XXXXXXXXXX" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-zinc-900 transition-transform hover:scale-105">
                  Call Now
                </a>
                <Link href="/contact" className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 px-6 py-3 font-bold transition-all hover:border-white">
                  Message Us
                </Link>
              </div>
            </div>
          </div>

          <div id="apply" className="relative scroll-mt-16 md:mt-12">
            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-brand-pink/20 via-transparent to-brand-sky/20 blur-2xl" />
            <div className="relative rounded-[3rem] border border-zinc-200 bg-white p-8 shadow-2xl md:p-10">
              <div className="mb-10">
                <h2 className="font-display text-5xl font-black tracking-tight text-zinc-900">Online Admission Inquiry</h2>
                <p className="mt-2 text-zinc-500">Fill the form below and we will get back to you within 24 hours.</p>
              </div>
              <AdmissionForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

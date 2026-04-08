import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  GraduationCap,
  Baby,
  Heart,
  Users,
  Puzzle,
  BookOpen,
  Pencil
} from "lucide-react";

const programs = [
  {
    id: "daycare",
    title: "Premium Daycare",
    age: "Full-day care",
    icon: Baby,
    color: "bg-brand-pink",
    textColor: "text-brand-pink",
    bgSoft: "bg-brand-pink/10",
    bgMedium: "bg-brand-pink/20",
    bullets: [
      "Safe and supervised environment",
      "Indoor play and activity areas",
      "Nap and rest-time arrangements",
      "Learning through play activities",
      "CCTV monitored classrooms",
      "Supportive staff for childcare",
    ],
  },
  {
    id: "play-group",
    title: "Play Group",
    age: "Age 2–3",
    icon: Puzzle,
    color: "bg-brand-yellow",
    textColor: "text-brand-yellow",
    bgSoft: "bg-brand-yellow/10",
    bgMedium: "bg-brand-yellow/20",
    bullets: [
      "Social interaction & sharing",
      "Sensory play and movement",
      "Language exposure and songs",
      "Early routines and confidence",
    ],
  },
  {
    id: "nursery",
    title: "Nursery",
    age: "Age 3–4",
    icon: BookOpen,
    color: "bg-brand-sky",
    textColor: "text-brand-sky",
    bgSoft: "bg-brand-sky/10",
    bgMedium: "bg-brand-sky/20",
    bullets: [
      "Pre-literacy and pre-numeracy",
      "Storytime, art, music",
      "Fine motor skill development",
      "Learning through activities",
    ],
  },
  {
    id: "lkg",
    title: "LKG",
    age: "Age 4–5",
    icon: Pencil,
    color: "bg-brand-indigo",
    textColor: "text-brand-indigo",
    bgSoft: "bg-brand-indigo/10",
    bgMedium: "bg-brand-indigo/20",
    bullets: [
      "Phonics and early reading",
      "Numbers and patterns",
      "Writing readiness",
      "Classroom habits and confidence",
    ],
  },
  {
    id: "ukg",
    title: "UKG",
    age: "Age 5–6",
    icon: GraduationCap,
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    bgSoft: "bg-emerald-500/10",
    bgMedium: "bg-emerald-500/20",
    bullets: [
      "School readiness",
      "Reading and math basics",
      "Communication skills",
      "Independent learning routines",
    ],
  },
];

export default function ProgramsPage() {
  // Tailwind Safelist for dynamic classes used via .replace('bg-', 'text-')
  // text-brand-pink text-brand-yellow text-brand-sky text-brand-indigo text-emerald-500

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="bg-zinc-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-pink">
                Learning Paths
              </div>
              <h1 className="mt-8 font-display text-5xl font-black tracking-tight text-zinc-900 md:text-5xl">
                Programs Built for <span className="text-brand-pink">Success.</span>
              </h1>
              <p className="mt-8 text-lg text-zinc-600 md:text-xl">
                From their first steps to school readiness, we guide every child
                with a curriculum that inspires curiosity.
              </p>
            </div>
            <Link
              href="/admissions"
              className="group inline-flex items-center gap-2 rounded-[2rem] bg-brand-pink px-8 py-5 text-lg font-bold text-white shadow-xl shadow-brand-pink/20 transition-all hover:scale-105 hover:bg-zinc-900 hover:shadow-zinc-900/20"
            >
              Start Admission <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {programs.map((p) => (
            <section
              key={p.id}
              id={p.id}
              className="group relative scroll-mt-16 md:mt-12 overflow-hidden rounded-[3rem] border border-zinc-200 bg-white p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50 md:p-10"
            >
              <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-5 transition-transform duration-700 group-hover:scale-150 ${p.color}`} />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${p.color} transition-transform duration-500 group-hover:rotate-12`}>
                    <p.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest ${p.bgSoft} ${p.textColor}`}>
                    {p.age}
                  </span>
                </div>

                <h2 className="mt-8 font-display text-5xl font-black tracking-tight text-zinc-900 md:text-5xl">{p.title}</h2>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {p.bullets.map((b) => (
                    <div key={b} className="flex items-start gap-3">
                      <div className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${p.bgMedium}`}>
                        <CheckCircle2 className={`h-3 w-3 ${p.textColor}`} />
                      </div>
                      <span className="text-sm font-medium leading-relaxed text-zinc-600">{b}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 flex justify-start">
                  <Link
                    href="/admissions"
                    className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all ${p.bgSoft} ${p.textColor} hover:${p.color} hover:text-white`}
                  >
                    Inquire for {p.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* Curriculum CTA */}
      <section className="bg-brand-indigo py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="font-display text-5xl font-black tracking-tight md:text-5xl">
            Integrated <span className="text-brand-pink">Curriculum</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-brand-indigo-100/80">
            Our unique teaching methodology combines Montessori principles with
            modern activity-based learning to foster 360-degree development.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Cognitive Skills", icon: GraduationCap },
              { label: "Social Skills", icon: Users },
              { label: "Physical Play", icon: Play },
              { label: "Creative Arts", icon: Sparkles },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10">
                <item.icon className="h-10 w-10 text-brand-pink" />
                <span className="font-bold tracking-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

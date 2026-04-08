import { 
  Wind, 
  ShieldCheck, 
  Gamepad2, 
  BookOpen, 
  Soup, 
  Stethoscope,
  Tv,
  ThermometerSnowflake,
  Cctv
} from "lucide-react";

export default function FacilitiesPage() {
  const facilities = [
    {
      title: "AC Classrooms",
      desc: "Temperature-controlled environments for maximum comfort during learning.",
      icon: ThermometerSnowflake,
      color: "bg-brand-sky"
    },
    {
      title: "CCTV Surveillance",
      desc: "24/7 monitoring of all areas to ensure the highest safety standards.",
      icon: Cctv,
      color: "bg-brand-pink"
    },
    {
      title: "Indoor Play Area",
      desc: "Safe, cushioned play zones for physical activity regardless of weather.",
      icon: Gamepad2,
      color: "bg-brand-yellow"
    },
    {
      title: "Library Corner",
      desc: "A cozy spot filled with age-appropriate stories and picture books.",
      icon: BookOpen,
      color: "bg-brand-indigo"
    },
    {
      title: "Smart Learning",
      desc: "Interactive displays and audio-visual tools for modern education.",
      icon: Tv,
      color: "bg-emerald-500"
    },
    {
      title: "Health & Hygiene",
      desc: "Regular sanitization and basic first-aid availability on campus.",
      icon: Stethoscope,
      color: "bg-rose-500"
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="bg-brand-indigo py-16 md:py-12 ">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/80">
            Our Campus
          </div>
          <h1 className="mt-8 font-display text-5xl font-black tracking-tight text-white md:text-5xl">
            World-Class <span className="text-brand-pink">Facilities</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-brand-indigo-100/80">
            We provide a modern, safe, and stimulating environment designed specifically 
            for the needs of early learners.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-12 ">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f, i) => (
            <div 
              key={f.title}
              className="group rounded-[2.5rem] border border-zinc-200 bg-white p-10 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50"
            >
              <div className={`mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl ${f.color} shadow-xl shadow-zinc-200/20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110`}>
                <f.icon className="h-10 w-10 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-2xl font-extrabold text-zinc-900">{f.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">{f.desc}</p>
              
              <div className="mt-8 h-1 w-12 rounded-full bg-zinc-100 transition-all duration-500 group-hover:w-full group-hover:bg-brand-pink" />
            </div>
          ))}
        </div>
      </section>

      {/* Safety Banner */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="relative overflow-hidden rounded-[3rem] bg-brand-pink p-12 text-white md:p-24">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <h2 className="font-display text-5xl font-black tracking-tight md:text-5xl">
              Safety is Our Priority
            </h2>
            <p className="mt-8 max-w-2xl text-lg opacity-90">
              From verified staff members to secure entry points and regular safety drills, 
              we ensure your child is in the safest hands in Kakinada.
            </p>
          </div>
          {/* Background decoration */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>
    </div>
  );
}

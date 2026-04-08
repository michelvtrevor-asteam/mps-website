import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Clock, 
  Users, 
  Heart, 
  Sparkles,
  Camera,
  Play,
  GraduationCap
} from "lucide-react";

function Stat({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-150 ${color}`} />
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${color} text-xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-zinc-200/20`}>
        <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
      </div>
      <div className="font-display text-xl font-bold tracking-tight text-zinc-900">{value}</div>
      <div className="mt-1 text-sm font-medium text-zinc-500">{label}</div>
    </div>
  );
}

function ProgramCard({
  title,
  age,
  desc,
  icon: Icon,
  color,
  delay
}: {
  title: string;
  age: string;
  desc: string;
  icon: any;
  color: string;
  delay: string;
}) {
  return (
    <div className={`group relative rounded-[2.5rem] border border-zinc-200 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] ${delay}`}>
      <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl ${color} text-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-xl shadow-zinc-200/20`}>
        <Icon className="h-8 w-8 text-white" strokeWidth={2.5} />
      </div>
      <div className="mb-1 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{age}</span>
      </div>
      <h3 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 group-hover:text-brand-pink transition-colors">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-zinc-600">{desc}</p>
      <div className="mt-8 flex items-center gap-2 text-sm font-bold text-zinc-900">
        Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background Ornaments */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-brand-pink/5 blur-3xl animate-pulse" />
        <div className="absolute -right-20 top-1/2 h-96 w-96 rounded-full bg-brand-sky/5 blur-3xl" />
        <div className="absolute left-1/3 bottom-20 h-96 w-96 rounded-full bg-brand-yellow/5 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-10 pb-24 md:pt-20 md:pb-32">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-600 backdrop-blur-sm shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-pink opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-pink"></span>
              </span>
              Admissions Open 2026-27
            </div>
            
            <h1 className="mt-8 font-display text-5xl font-black leading-[1.1] tracking-tight text-zinc-900 md:text-5xl">
              Where <span className="text-brand-pink">Little Hearts</span> <br />
              <span className="relative inline-block">
                Learn Big Things.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9C118.5 2.5 239.5 2.5 355 9" stroke="#FF2D85" strokeWidth="5" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            <p className="mt-10 max-w-xl text-lg leading-relaxed text-zinc-600 md:text-xl">
              At Maanvi’s Preschool, we blend international teaching standards with 
              heartfelt care to create a joyful foundation for your child's future.
            </p>
            
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/admissions"
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-[2rem] bg-zinc-900 px-8 py-5 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:bg-brand-pink hover:scale-105"
              >
                Enroll Your Child <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/programs"
                className="flex items-center justify-center gap-2 rounded-[2rem] border-2 border-zinc-200 bg-white px-8 py-5 text-base font-bold text-zinc-900 transition-all duration-300 hover:border-zinc-900 hover:bg-zinc-50"
              >
                Explore Programs
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-zinc-100 shadow-sm" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-brand-yellow text-brand-yellow" />)}
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-900">Loved by 200+ Kakinada Parents</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 overflow-hidden rounded-[3rem] border-[12px] border-white bg-zinc-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
              <div className="aspect-[4/5] bg-gradient-to-br from-pink-100 via-amber-50 to-sky-100 flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="mx-auto mb-6 flex h-20 w-20 animate-float items-center justify-center rounded-[2rem] bg-white shadow-xl">
                    <Sparkles className="h-10 w-10 text-brand-pink" />
                  </div>
                  <h3 className="font-display text-5xl font-black tracking-tight text-zinc-900">Modern Learning Space</h3>
                  <p className="mt-4 text-zinc-600">Our campus is designed to inspire creativity and curiosity in every corner.</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/5" />
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -right-8 top-1/4 z-20 animate-float rounded-3xl bg-white p-4 shadow-2xl shadow-zinc-200/50 border border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">Safety First</div>
                  <div className="text-sm font-black text-zinc-900">CCTV Monitored</div>
                </div>
              </div>
            </div>

            <div className="absolute -left-8 bottom-1/4 z-20 animate-float [animation-delay:1s] rounded-3xl bg-white p-4 shadow-2xl shadow-zinc-200/50 border border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sky/10 text-brand-sky">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">Full Day</div>
                  <div className="text-sm font-black text-zinc-900">Care Routines</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bento */}
      <section className="bg-zinc-50 py-16 md:py-12 ">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat icon={Heart} label="Loving Environment" value="Child-First" color="bg-brand-pink" />
            <Stat icon={ShieldCheck} label="Secure Premises" value="Safe & Secure" color="bg-brand-sky" />
            <Stat icon={Clock} label="Nap & Meals" value="Healthy Routines" color="bg-brand-yellow" />
            <Stat icon={Users} label="Expert Teachers" value="Certified Staff" color="bg-brand-indigo" />
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="relative overflow-hidden py-16 md:py-12 ">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-5xl font-black tracking-tight text-zinc-900 md:text-5xl">
              Programs for <span className="text-brand-pink">Every Stage</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
              Tailored learning paths designed to nurture cognitive, social, and physical growth.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ProgramCard
              title="Daycare"
              age="Full-day care"
              color="bg-brand-pink"
              icon={Clock}
              delay="[animation-delay:0ms]"
              desc="Extended supervision, indoor play, rest time, and learning activities for working parents."
            />
            <ProgramCard
              title="Play Group"
              age="Age 2–3"
              color="bg-brand-yellow"
              icon={Sparkles}
              delay="[animation-delay:100ms]"
              desc="Social skills, sensory play, early routines, and language exposure through fun activities."
            />
            <ProgramCard
              title="Nursery"
              age="Age 3–4"
              color="bg-brand-sky"
              icon={Play}
              delay="[animation-delay:200ms]"
              desc="Pre-literacy and pre-numeracy foundations with creativity, music, and movement."
            />
            <ProgramCard
              title="LKG"
              age="Age 4–5"
              color="bg-brand-indigo"
              icon={CheckCircle2}
              delay="[animation-delay:300ms]"
              desc="Structured learning with phonics, numbers, fine motor skills, and confidence building."
            />
            <ProgramCard
              title="UKG"
              age="Age 5–6"
              color="bg-emerald-500"
              icon={GraduationCap}
              delay="[animation-delay:400ms]"
              desc="School readiness with reading readiness, math basics, and classroom habits."
            />
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] bg-brand-pink p-8 text-center text-white shadow-2xl shadow-brand-pink/30">
              <h3 className="font-display text-2xl font-black leading-tight">Ready to join the family?</h3>
              <p className="mt-4 text-sm opacity-90">Book a visit to our campus today.</p>
              <Link href="/admissions" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-brand-pink transition-transform hover:scale-105">
                Book a Tour <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="relative overflow-hidden rounded-[3rem] bg-zinc-900 p-8 md:p-12">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/5 to-transparent" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-display text-5xl font-black tracking-tight text-white md:text-5xl">
              World-Class <span className="text-brand-pink">Facilities</span> for Your Child
            </h2>
            <p className="mt-8 text-lg text-zinc-400">
              From AC classrooms to safe indoor play areas and CCTV monitoring, we provide the best 
              environment for growth.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/facilities" className="rounded-2xl bg-brand-pink px-8 py-4 font-bold text-white shadow-lg shadow-brand-pink/20 transition-transform hover:scale-105">
                View All Facilities
              </Link>
              <Link href="/gallery" className="flex items-center gap-2 rounded-2xl border-2 border-zinc-700 px-8 py-4 font-bold text-white transition-all hover:border-white">
                <Camera className="h-5 w-5" /> Take a Virtual Tour
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

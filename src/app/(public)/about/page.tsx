import { Heart, ShieldCheck, Users, Sparkles, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-zinc-50 py-16 md:py-12 ">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-pink">
              Our Story
            </div>
            <h1 className="mt-8 font-display text-5xl font-black tracking-tight text-zinc-900 md:text-5xl">
              Nurturing Tomorrow’s <br />
              <span className="text-brand-pink">Leaders Today.</span>
            </h1>
            <p className="mt-10 text-lg leading-relaxed text-zinc-600 md:text-xl">
              Maanvi’s Preschool was founded in Kakinada with a singular vision: 
              to create a world-class early learning environment that feels like a 
              second home.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-12 ">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              {
                title: "Our approach",
                desc: "Activity-based learning that balances fun, structure, and skill building.",
                icon: Sparkles,
                color: "bg-brand-pink"
              },
              {
                title: "Safety & care",
                desc: "Supervised classrooms with supportive staff and child-friendly routines.",
                icon: ShieldCheck,
                color: "bg-brand-sky"
              },
              {
                title: "Communication",
                desc: "Clear updates for parents on attendance, fees, results, and announcements.",
                icon: Users,
                color: "bg-brand-yellow"
              },
              {
                title: "Our Mission",
                desc: "To foster curiosity and confidence in every child through personalized attention.",
                icon: Heart,
                color: "bg-brand-indigo"
              },
            ].map((c) => (
              <div
                key={c.title}
                className="group rounded-[2.5rem] border border-zinc-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl hover:shadow-zinc-200/50"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${c.color} shadow-lg shadow-zinc-200/20 transition-transform group-hover:rotate-12`}>
                  <c.icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-display text-xl font-extrabold text-zinc-900">{c.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[3rem] bg-zinc-100 shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-pink-50 to-sky-50 flex items-center justify-center p-12">
                 <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-xl">
                      <Heart className="h-12 w-12 text-brand-pink animate-pulse" />
                    </div>
                    <h3 className="font-display text-5xl font-black text-zinc-900">Built with Love</h3>
                    <p className="mt-4 text-zinc-600">Every corner of Maanvi’s Preschool is designed to inspire and protect.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-zinc-900 py-16 md:py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="font-display text-5xl font-black tracking-tight md:text-5xl">
            The Maanvi <span className="text-brand-pink">Difference</span>
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "International Curriculum Standards",
              "Child-Friendly Modern Infrastructure",
              "Highly Trained & Caring Educators",
              "Nutritious Meal Planning & Guidance",
              "Real-time Digital Parent Portal",
              "Safe & CCTV Monitored Campus"
            ].map(item => (
              <div key={item} className="flex items-center gap-4 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-pink/20 text-brand-pink">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <span className="text-lg font-bold tracking-tight text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

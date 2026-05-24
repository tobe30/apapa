import React from 'react'
import { Search, MessageSquareText, Sparkles, ArrowRight, MapPin, CircleQuestionMark, StepForward } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Search,
    title: "Search a place",
    desc: "Type any city, area, school or landmark. We'll surface what people are already asking.",
    visual: (
      <div className="glass rounded-2xl p-3 flex items-center gap-2 shadow-card">
        <Search className="w-4 h-4 text-muted-foreground ml-1" />
        <span className="text-sm text-foreground/70 flex-1">Apapa, Lagos</span>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gradient-hero text-primary-foreground">Go</span>
      </div>
    ),
  },
  {
    n: "02",
    icon: MessageSquareText,
    title: "See real questions",
    desc: "Browse what locals and explorers want to know. Ask your own in one tap.",
    visual: (
      <div className="space-y-2">
        <div className="glass rounded-xl p-3 text-xs font-semibold flex items-center gap-2 shadow-soft">
          <MapPin className="w-3.5 h-3.5 text-coral" /> Best route in the morning?
        </div>
        <div className="glass rounded-xl p-3 text-xs font-semibold flex items-center gap-2 shadow-soft ml-4">
          <MapPin className="w-3.5 h-3.5 text-primary" /> Where to eat under ₦2k?
        </div>
      </div>
    ),
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Get answers that matter",
    desc: "Helpful, voted-up answers from people who actually live, work or grew up there.",
    visual: (
      <div className="glass rounded-2xl p-4 shadow-card">
        <p className="text-xs font-semibold text-primary">✓ Top answer</p>
        <p className="text-xs text-foreground/80 mt-1 leading-relaxed">
          "Mile 2 before 6:30am, otherwise expect 2hr+ traffic."
        </p>
      </div>
    ),
  },
];
const HowItWorks = () => {
  return (
   <section id="how" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
               {/* Header */}
        <div className="relative text-center mb-20">
          <p
            className="text-secondary text-2xl mb-3"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            How it works
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight">
          Three steps to
            <br />
            knowing any place.
          </h2>

          {/* Decorative backpack illustration */}
          <StepForward
            className="hidden md:block absolute right-0 top-0 w-40 h-40 text-gray-300"
            strokeWidth={1}
          />
        </div>

        <div className="relative grid lg:grid-cols-3 gap-6 lg:gap-8">

  {/* connector line */}
 <div className="hidden lg:block absolute top-24 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

  {steps.map((s, i) => (
    <div key={s.n} className="relative">

      <div className="lift relative bg-white/70 backdrop-blur-md rounded-3xl p-7 shadow-[0_10px_40px_rgba(0,2,110,0.08)] hover:shadow-[0_20px_60px_rgba(0,2,110,0.12)] transition-all h-full">

        {/* top */}
        <div className="flex items-center justify-between mb-6">

          <div className="w-12 h-12 rounded-2xl grid place-items-center bg-primary text-white shadow-glow">
            <s.icon className="w-5 h-5" />
          </div>

          <span className="font-display text-3xl font-extrabold text-primary/10">
            {s.n}
          </span>

        </div>

        {/* title */}
        <h3 className="font-display text-xl font-bold text-primary">
          {s.title}
        </h3>

        {/* desc */}
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          {s.desc}
        </p>

        {/* inner visual (cleaned) */}
        <div className="mt-6 p-4 rounded-2xl bg-white/40 backdrop-blur-sm shadow-inner">
          {s.visual}
        </div>

      </div>

      {/* arrow */}
      {i < steps.length - 1 && (
        <div className="hidden lg:grid absolute -right-5 top-24 -translate-y-1/2 w-10 h-10 place-items-center rounded-full bg-white/80 backdrop-blur-md shadow-md z-10">
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>
      )}

    </div>
  ))}
</div>
      </div>
    </section>
  )
}

export default HowItWorks
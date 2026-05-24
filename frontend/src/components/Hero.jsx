import { useState } from "react";
import {
  Search,
  ArrowRight,
  Sparkles,
  Star,
  Play,
  Plane,
  Briefcase,
  Compass,
} from "lucide-react";

import travel1 from "../assets/lagos.jpg";
import travel2 from "../assets/keke.jpg";
import avatar1 from "../assets/avatar-1.jpg";
import avatar2 from "../assets/avatar-2.jpg";
import avatar3 from "../assets/avatar-3.jpg";

const chips = ["Apapa", "Awka", "Festac", "Lekki", "Yaba"];

const Hero = () => {
  return (
    <section id="places" className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden ">
      
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary-glow/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute inset-0 grid-overlay opacity-30" />
      </div>

      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-12 items-center">

        {/* LEFT */}
        <div className="lg:col-span-6">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-black/5 shadow-sm text-xs font-semibold mb-6">
  <Sparkles className="w-4 h-4 text-primary" />
  <span className="text-primary">Place intelligence</span>
  <span className="text-muted-foreground">powered by people</span>
</div>
          <p className="text-3xl text-secondary mb-3">What people say</p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-primary">
            Know a place <br /> before you go.
          </h1>

          <p className="mt-6 text-gray-600 max-w-xl">
            Search any city, neighborhood or landmark and get real answers from people who actually live, work and explore there schools, routes, food spots, the lot.
          </p>

          {/* SEARCH */}
         <div className="mt-8 flex items-center gap-2 max-w-xl rounded-2xl bg-white/70 backdrop-blur-md border border-black/5 shadow-md px-3 py-2">
  
  <Search className="w-5 h-5 text-muted-foreground ml-2" />

  <input
    type="text"
    placeholder="Search a city, area, school or landmark..."
    className="flex-1 bg-transparent outline-none py-3 text-sm placeholder:text-muted-foreground"
  />

  <button className="px-5 py-2 rounded-xl bg-secondary text-white hover:opacity-90 flex items-center gap-2 text-sm font-medium">
    Explore <ArrowRight className="w-4 h-4" />
  </button>

</div>
<div className="mt-5 flex flex-wrap items-center gap-2">

  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
    Trending
  </span>

  {chips.map((c) => (
    <button
      key={c}
      className="px-4 py-2 font-bold rounded-full bg-white/70 backdrop-blur-md border border-black/5 text-sm text-primary hover:bg-primary hover:text-white hover:border-primary transition-all"
    >
      {c}
    </button>
  ))}
</div>

          {/* CTA */}
          <div className="mt-10 flex items-center gap-6">

            <button className="px-7 py-3 rounded-full bg-secondary text-white hover:bg-black/90 flex items-center gap-2">
              Start exploring <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">

              <div className="flex -space-x-3">
                {[avatar1, avatar2, avatar3].map((a, i) => (
                  <img
                    key={i}
                    src={a}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>

              <div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />
                  ))}
                  <span className="ml-1">4.9</span>
                </div>
                <p className="text-xs text-gray-500">
                  Trusted by 28k+ explorers across Nigeria
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-6 relative animate-fade-in-slow">
          <div className="relative aspect-[4/5] max-w-[560px] mx-auto">
            {/* dotted accent frame */}
            <div className="absolute top-6 right-2 w-[55%] h-[70%] border-2 border-dotted border-primary/30 rounded-[2rem] -z-10" />

            {/* Main tall image */}
            <div className="absolute top-0 left-0 w-[62%] h-[78%] rounded-[2rem] overflow-hidden shadow-elevated">
              <img
                src={travel1}
                alt="Explorer overlooking a coastal landscape"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Watch video card */}

            {/* Secondary image card */}
            <div className="absolute right-0 top-[28%] w-[55%] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-elevated border-4 border-white">
              <img
                src={travel2}
                alt="Traveler at a scenic viewpoint"
                className="w-full h-full object-cover"
              />
              {/* badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-3 py-2 shadow-coral">
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-primary-foreground/15">
                  <Briefcase className="w-4 h-4 text-white" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm text-white font-bold">Local Guides</p>
                  <p className="text-[10px] text-white opacity-80">28k+ trusted voices</p>
                </div>
              </div>
            </div>

            {/* Floating Trip Insight card */}
          <div className="absolute top-[8%] -left-2 sm:-left-6 w-[58%] max-w-[240px] bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-100 animate-float">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Compass className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Trip insight</p>
                  <p className="text-sm font-bold text-primary leading-tight mt-0.5">Best time to visit Lekki Beach?</p>
                  <div className="flex items-center gap-2 mt-2">
                    <img src={avatar1} alt="" className="w-5 h-5 rounded-full object-cover border border-background" />
                    <p className="text-[11px] text-white">Tunde · local guide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plane with dotted path */}
            <svg className="absolute -top-2 right-4 w-32 h-24 text-primary/50" viewBox="0 0 120 80" fill="none">
              <path d="M5 70 Q 60 -10, 110 30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
            </svg>
            <Plane className="absolute top-4 right-2 w-8 h-8 text-primary -rotate-12" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
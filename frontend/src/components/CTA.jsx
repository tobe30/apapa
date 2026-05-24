import { ArrowUpRight, MapPin } from "lucide-react";
import ctaBg from "../assets/opey.jpg";

const CTA = () => {
  return (
    <section className="relative py-24 lg:py-32 px-6">
      <div className="mx-auto max-w-7xl relative rounded-[2.5rem] overflow-hidden shadow-elevated">
        <img src={ctaBg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-foreground/80" />
        <div className="absolute inset-0 grid-overlay opacity-20" />
        <div className="absolute -top-32 -right-20 w-[400px] h-[400px] rounded-full bg-primary-glow/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-coral/30 blur-3xl" />

        <div className="relative px-8 py-20 lg:px-20 lg:py-28 text-center text-primary-foreground">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md bg-white/10 border-white/20">
            <MapPin className="w-3.5 h-3.5" /> Start with any place
          </div>
          <h2 className="font-display text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-6 max-w-3xl mx-auto leading-[1.05]">
            Start exploring places
            <br />
            with <span className="italic font-display text-primary-glow">real insight.</span>
          </h2>
          <p className="mt-6 text-base text-white lg:text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Search a place and see what people already know. No fluff, no ads just answers from humans who've been there.
          </p>
         <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">

  {/* Primary button */}
  <button className="rounded-full bg-primary text-white shadow-lg h-14 px-8 text-base font-semibold flex items-center gap-2 hover:opacity-90 transition">
    Explore Apapa
    <ArrowUpRight className="w-5 h-5" />
  </button>

  {/* Secondary button */}
  <button className="rounded-full h-14 px-8 text-base font-semibold border border-primary/30 text-primary bg-white/60 backdrop-blur hover:bg-primary/5 hover:text-white transition">
    Browse all places
  </button>

</div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

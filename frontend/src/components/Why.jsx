import { Compass, MapPinned, BadgeCheck, Briefcase } from "lucide-react";

const steps = [
  {
    icon: Compass,
    title: "Ask anything about a place",
    desc: "From safety to street food drop a question and let people who know it answer.",
  },
  {
    icon: MapPinned,
    title: "Real answers from locals",
    desc: "Every reply is from someone who lives, works or grew up in the area you're exploring.",
  },
  {
    icon: BadgeCheck,
    title: "Smarter decisions, faster",
    desc: "Skip the guesswork. Get the inside track before you commute, move, study or visit.",
  },
];

const Why = () => {
  return (
    <section id="why" className="relative py-24 lg:py-32  overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="relative text-center mb-20">
          <p
            className="text-secondary text-2xl mb-3"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            WHY APAPA
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight">
            The fastest way 
            <br />
            to understand a place
          </h2>

          {/* Decorative backpack illustration */}
          <Briefcase
            className="hidden md:block absolute right-0 top-0 w-40 h-40 text-gray-300"
            strokeWidth={1}
          />
        </div>

        {/* Steps with curved dashed line */}
        <div className="relative">
          {/* Curved dashed connector (desktop only) */}
 <svg
  className="hidden lg:block absolute left-0 right-0 top-8 w-full h-32 pointer-events-none z-0"
  viewBox="0 0 1200 120"
  preserveAspectRatio="none"
  fill="none"
>
  <path
    d="M 20 60 Q 300 -20 600 60 T 1180 60"
    stroke="#00026e"
    strokeWidth="2"
    strokeDasharray="8 10"
    opacity="0.8"
  />

  <circle cx="20" cy="60" r="5" fill="#00026e" opacity="0.9" />
  <circle cx="1180" cy="60" r="5" fill="#00026e" opacity="0.9" />
</svg>

          <div className="relative grid md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`flex flex-col items-center text-center px-4 ${
                  i === 1 ? "md:mt-16" : ""
                }`}
              >
                <div className="w-20 h-20 rounded-full grid place-items-center bg-secondary text-white shadow-card mb-6">
                  <s.icon className="w-9 h-9" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-bold text-primary mb-3">
                  {s.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed max-w-xs">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Why;
import {
  ThumbsUp,
  Award,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function RecognitionSection() {
  return (
    <section  className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT SIDE */}
        <div>
            <p
            className="text-secondary text-2xl mb-3"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
           Recognition that matters
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold text-primary leading-tight mb-6">
            Helpful answers earn{" "}
            <span className="text-primary">
              real status
            </span>
          </h1>

          <p className="text-gray-600 mb-8 max-w-lg">
            Contributors earn points, badges, and Local Expert status when their
            answers actually help people. No noise, no vanity metrics — just
            trust built over time.
          </p>

          {/* FEATURES */}
          <div className="space-y-5 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-[#00026e]/10 p-3 rounded-full">
                <ThumbsUp className="text-[#00026e]" size={20} />
              </div>
              <div>
                <p className="font-medium text-[#00026e]">
                  Helpful Points
                </p>
                <p className="text-sm text-gray-500">
                  Earned when an answer truly helps
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#00026e]/10 p-3 rounded-full">
                <Award className="text-[#00026e]" size={20} />
              </div>
              <div>
                <p className="font-medium text-[#00026e]">
                  Local Expert
                </p>
                <p className="text-sm text-gray-500">
                  Trusted in a specific area
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#00026e]/10 p-3 rounded-full">
                <TrendingUp className="text-[#00026e]" size={20} />
              </div>
              <div>
                <p className="font-medium text-[#00026e]">
                  Weekly Leaderboard
                </p>
                <p className="text-sm text-gray-500">
                  Compete with the most active locals
                </p>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button className="flex items-center gap-2 bg-[#00026e] text-white px-6 py-3 rounded-full hover:opacity-90 transition">
            Explore Rewards
            <ArrowRight size={18} />
          </button>
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 relative shadow-[0_10px_40px_rgba(0,2,110,0.08)] hover:shadow-[0_20px_60px_rgba(0,2,110,0.12)] transition-all">
          
          {/* USER HEADER */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-[#00026e] text-white rounded-full font-semibold">
              CO
            </div>
            <div>
              <p className="font-medium text-[#00026e]">
                Chinedu O.
              </p>
              <p className="text-sm text-gray-500">
                Local Expert · Apapa
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { value: "184", label: "ANSWERS" },
              { value: "612", label: "HELPFUL" },
              { value: "12d", label: "STREAK" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl text-center py-4 bg-white/60 shadow-sm"
              >
                <p className="font-semibold text-[#00026e]">
                  {item.value}
                </p>
                <p className="text-xs text-gray-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* LEADERBOARD */}
          <div>
            <p className="text-sm text-[#00026e] mb-4">
              This week's leaders
            </p>

            <div className="space-y-4">
              {[
                { name: "Chinedu O.", role: "Local Expert", score: 2840 },
                { name: "Amaka I.", role: "Top Contributor", score: 2410 },
                { name: "Emeka N.", role: "Route Guide", score: 1980 },
                { name: "Ngozi P.", role: "Local Expert", score: 1720 },
              ].map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-4">
                      {index + 1}
                    </span>

                    <div className="w-8 h-8 flex items-center justify-center bg-[#00026e]/10 text-[#00026e] rounded-full text-xs font-semibold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#00026e]">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-[#00026e]">
                    {user.score}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TOP ANSWER BADGE */}
          <div className="absolute top-4 right-4 
bg-white/80 backdrop-blur-md 
shadow-[0_10px_30px_rgba(0,2,110,0.15)]
px-4 py-2 rounded-2xl 
flex items-center gap-2
animate-float
hover:-translate-y-1 transition-all">

  {/* trophy icon */}
  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary grid place-items-center">
    🏆
  </div>

  <div className="leading-tight">
    <p className="text-xs font-semibold text-primary">
      Top Answerer
    </p>
    <p className="text-[10px] text-gray-500">
      Just unlocked
    </p>
  </div>
</div>
        </div>
      </div>
    </section>
  );
}
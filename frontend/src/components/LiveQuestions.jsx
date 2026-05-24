import { ThumbsUp, MessageCircle, MapPin, Briefcase, FileQuestionMark, CircleQuestionMark } from "lucide-react";
import a1 from "../assets/avatar-1.jpg";
import a2 from "../assets/avatar-2.jpg";
import a3 from "../assets/avatar-3.jpg";
const questions = [
  {
    avatar: a2, name: "Tunde", time: "2h ago", place: "Apapa",
    q: "Best route from Festac to Apapa in the morning?",
    a: "Take Mile 2 before 6:30am — after that, Oshodi-Apapa Expressway turns into a parking lot.",
    answers: 12, helpful: 89,
  },
  {
    avatar: a3, name: "Ifeoma", time: "5h ago", place: "Awka",
    q: "Is Awka safe for students staying off-campus?",
    a: "Generally yes — Ifite and Iyiagu are popular. Avoid isolated streets after 10pm and you'll be fine.",
    answers: 24, helpful: 142,
  },
  {
    avatar: a1, name: "Chiamaka", time: "1d ago", place: "Yaba",
    q: "Where can I get cheap, good food around Yaba?",
    a: "Iya Eba on Herbert Macaulay slaps. Also try the local spots near Sabo for jollof under ₦1,500.",
    answers: 38, helpful: 211,
  },
  {
    avatar: a2, name: "David", time: "1d ago", place: "Lekki",
    q: "Honest take — is Lekki Phase 1 worth the rent in 2025?",
    a: "If you work on the island, yes. Traffic is calmer than the mainland, and amenities are everywhere.",
    answers: 51, helpful: 274,
  },
];

const LiveQuestions = () => {
  return (
    <section id="questions" className="relative py-24 lg:py-32">
    <div className="absolute inset-0 -z-10 mesh-bg opacity-60" />
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="relative text-center mb-20">
          <p
            className="text-secondary text-2xl mb-3"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            From the community
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight">
           Real questions.
            <br />
            Real people. Real answers.
          </h2>

          {/* Decorative backpack illustration */}
          <CircleQuestionMark
            className="hidden md:block absolute right-0 top-0 w-40 h-40 text-gray-300"
            strokeWidth={1}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {questions.map((item) => (
            <article
              key={item.q}
              className="lift bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,2,110,0.08)] border border-black/5 hover:shadow-[0_20px_60px_rgba(0,2,110,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt="" loading="lazy" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm text-primary font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-white">
                  <MapPin className="w-3 h-3" /> {item.place}
                </span>
              </div>

              <h3 className="font-display text-lg  font-bold mt-5 leading-snug">{item.q}</h3>

              <div className="mt-4 rounded-2xl bg-secondary/10 p-4 border border-gray-200">
                <p className="text-xs text-black font-semibold  mb-1.5">Top answer</p>
                <p className="text-sm text-foreground leading-relaxed">{item.a}</p>
              </div>

              <div className="mt-5 flex items-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> {item.answers} answers</span>
                <span className="flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5" /> {item.helpful} helpful</span>
              </div>
            </article>
          ))}
        </div>
      </div>
      
    </section>
  )
}

export default LiveQuestions
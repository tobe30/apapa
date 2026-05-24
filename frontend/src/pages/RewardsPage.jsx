import { useMemo } from "react";
import {
  Trophy,
  Star,
  Zap,
  Globe,
  Award,
  TrendingUp,
  Medal, 
  MapPin,
  ShieldCheck
} from "lucide-react";
import { getAuthUser, getLeaderboard } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

export default function RewardsPage() {
  // 🔥 Mock users (replace with backend later)
const { data: leaderboardData = [] } = useQuery({
  queryKey: ["leaderboard"],
  queryFn: getLeaderboard,
});

console.log("leaderboardData:", leaderboardData);

const sortedUsers = useMemo(() => {
  return [...(leaderboardData?.leaderboard ?? [])].sort(
    (a, b) => b.points - a.points
  );
}, [leaderboardData]);

  // 🧠 Current user mock
const { data: authUser } = useQuery({
  queryKey: ["authUser"],
  queryFn: getAuthUser,
});

const currentUser = authUser?.user;

const getLevel = (points) => {
  if (points >= 300) return "Top Contributor";
  if (points >= 100) return "Active Contributor";
  if (points >= 50) return "Rising Contributor";
  return "Newbie";
};

const levels = [
  { name: "Newbie", range: "0 - 20", icon: Star },
  { name: "Helper", range: "21 - 100", icon: Medal },
  { name: "Local Guide", range: "101 - 300", icon: MapPin },
  { name: "Trusted Voice", range: "300+", icon: ShieldCheck },
];

  const badges = [
    {
      name: "Top Contributor",
      desc: "Most active in the community",
      req: "300+ points",
      icon: Trophy,
    },
    {
      name: "Active Contributor",
      desc: "Consistently helpful user",
      req: "100+ points",
      icon: Award,
    },
    {
      name: "Rising Contributor",
      desc: "Getting started in the community",
      req: "50+ points",
      icon: Star,
    },
    {
      name: "Fast Helper",
      desc: "Quick responses to questions",
      req: "Response under 10 mins",
      icon: Zap,
    },
  ];
  
  const currentPoints = currentUser?.points || 0;
  const currentLevel = getLevel(currentPoints);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

      {/* ================= HEADER ================= */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Rewards & Contributions
        </h1>
        <p className="text-gray-500 text-sm">
          Earn points by asking questions, answering, and helping people in your area.
        </p>
      </div>

     {/* ================= HOW IT WORKS ================= */}
<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">

  {/* HEADER */}
  <div>
    <h2 className="font-semibold text-lg">How It Works</h2>
    <p className="text-sm text-gray-500">
      Rewards for contributing to the community
    </p>
  </div>

  {/* ACTION CARDS */}
  <div className="grid sm:grid-cols-2 gap-4 text-sm">

    {/* ASK */}
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
          <Star size={18} />
        </div>
        <span className="font-medium text-gray-800">Ask a question</span>
      </div>
      <span className="font-semibold text-primary">+2 pts</span>
    </div>

    {/* ANSWER */}
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
          <Zap size={18} />
        </div>
        <span className="font-medium text-gray-800">Answer a question</span>
      </div>
      <span className="font-semibold text-primary">+5 pts</span>
    </div>

    {/* UPVOTE */}
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
          <TrendingUp size={18} />
        </div>
        <span className="font-medium text-gray-800">Upvote received</span>
      </div>
      <span className="font-semibold text-primary">+3 pts</span>
    </div>

    {/* ACCEPTED */}
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
          <Award size={18} />
        </div>
        <span className="font-medium text-gray-800">Accepted answer</span>
      </div>
      <span className="font-semibold text-primary">+10 pts</span>
    </div>

  </div>
</div>
      
      {/* LEVELS */}
<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">

  {/* HEADER */}
  <div className="flex justify-between items-center">
    <div>
      <h2 className="font-semibold text-lg">Levels</h2>
      <p className="text-sm text-gray-500">
        Progress through ranks as you contribute.
      </p>
    </div>

    <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
      {currentLevel}
    </span>
  </div>

  {/* PROGRESS */}
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span className="font-medium text-gray-800">
        {currentPoints} points
      </span>
      <span className="text-gray-500">
        {300 - currentPoints} pts to next level
      </span>
    </div>

    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{
         width: `${Math.min((currentPoints / 300) * 100, 100)}%`,
        }}
      />
    </div>
  </div>

  {/* LEVEL CARDS */}
  <div className="grid grid-cols-2 gap-4">
    {levels.map((lvl) => {
      const isActive = currentLevel === lvl.name;

      return (
        <div
          key={lvl.name}
          className={`rounded-xl border p-4 flex justify-between items-center transition
          ${
            isActive
              ? "border-primary bg-primary/5"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div>
            <p className="font-medium text-gray-900">{lvl.name}</p>
            <p className="text-xs text-gray-500">{lvl.range} pts</p>
          </div>

          {/* ICON */}
        
<div
  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
  ${
    isActive
      ? "bg-primary text-white scale-110 shadow-sm"
      : "bg-gray-200 text-gray-500"
  }`}
>
  {lvl.icon && <lvl.icon size={18} />}
</div>
        </div>
      );
    })}
  </div>
</div>

      {/* ================= BADGES ================= */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Badges</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b, i) => {
            const Icon = b.icon;

            return (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <Icon className="w-6 h-6 mb-2 text-primary" />

                <h3 className="font-semibold">{b.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{b.desc}</p>

                <p className="text-xs mt-2 text-gray-400">
                  {b.req}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= LEADERBOARD ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">
          Leaderboard (Top Contributors)
        </h2>

        <div className="space-y-3">
          {sortedUsers?.map((user, index) => (
            <div
              key={user.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-secondary">
                  #{index + 1}
                </span>

                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {user.badge}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="font-semibold">
                  {user.points}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
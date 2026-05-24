import { useMemo } from "react";
import {
  Trophy,
  Star,
  Zap,
  Globe,
  TrendingUp,
  Award,
} from "lucide-react";
import { getAuthUser, getLeaderboard } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

export default function RewardsPage() {
  // ================= LEADERBOARD =================
  const { data: leaderboardData } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });

  const sortedUsers = useMemo(() => {
    return [...(leaderboardData?.leaderboard ?? [])].sort(
      (a, b) => b.points - a.points
    );
  }, [leaderboardData]);

  // ================= AUTH USER =================
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
  });

  const currentUser = authUser?.user;

  const currentPoints = currentUser?.points || 0;

  // ================= BACKEND BADGES =================
  const badgeMeta = {
    "Rising Contributor": {
      icon: Star,
      color: "text-yellow-500",
      desc: "Earned at 50+ points",
    },
    "Active Contributor": {
      icon: Award,
      color: "text-blue-500",
      desc: "Earned at 100+ points",
    },
    "Top Contributor": {
      icon: Trophy,
      color: "text-purple-500",
      desc: "Earned at 300+ points",
    },
  };

  const userBadges = currentUser?.badges || [];

  // ================= BADGES LIST =================
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
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="font-semibold text-lg">How It Works</h2>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">

          <div className="flex justify-between bg-gray-50 p-4 rounded-xl">
            <span>Ask a question</span>
            <span className="font-semibold text-primary">+2 pts</span>
          </div>

          <div className="flex justify-between bg-gray-50 p-4 rounded-xl">
            <span>Answer a question</span>
            <span className="font-semibold text-primary">+5 pts</span>
          </div>

          <div className="flex justify-between bg-gray-50 p-4 rounded-xl">
            <span>Upvote received</span>
            <span className="font-semibold text-primary">+3 pts</span>
          </div>

          <div className="flex justify-between bg-gray-50 p-4 rounded-xl">
            <span>Accepted answer</span>
            <span className="font-semibold text-primary">+10 pts</span>
          </div>

        </div>
      </div>

      {/* ================= YOUR BADGES ================= */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Your Badges</h2>

        {userBadges.length === 0 ? (
          <p className="text-sm text-gray-500">No badges yet. Keep contributing 👀</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userBadges.map((badge, i) => {
              const meta = badgeMeta[badge];

              const Icon = meta?.icon || Star;

              return (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm"
                >
                  <Icon className={`w-4 h-4 ${meta?.color || "text-gray-500"}`} />
                  {badge}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= BADGE REQUIREMENTS ================= */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Badge Requirements</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b, i) => {
            const Icon = b.icon;

            return (
              <div
                key={i}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >
                <Icon className="w-6 h-6 mb-2 text-primary" />
                <h3 className="font-semibold">{b.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{b.desc}</p>
                <p className="text-xs mt-2 text-gray-400">{b.req}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= LEADERBOARD ================= */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">
          Leaderboard (Top Contributors)
        </h2>

        <div className="space-y-3">
          {sortedUsers.map((user, index) => (
            <div
              key={user._id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-secondary">
                  #{index + 1}
                </span>

                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {(user.badges || []).join(", ")}
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
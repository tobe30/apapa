import { TrendingUp, MessageCircle } from "lucide-react";

const DiscoverSidebar = ({
  trendingPlaces,
  popularQuestions,
  setSearchQuery,
  setSelectedPlace,
  onClose, // optional (for mobile usage)
}) => {
  return (
    <div className="space-y-6">

      {/* Trending Places */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-orange-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">
                Trending Places
              </h3>
              <p className="text-[11px] text-gray-500">
                Most discussed this week
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-3 space-y-1">
          {trendingPlaces.map((place, idx) => (
            <button
              key={place.name}
              onClick={() => {
                setSelectedPlace(place.id);
                onClose?.();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                
                {/* 🔥 pointer + #1 style */}
                <span className="text-xs font-bold text-gray-400 w-4 group-hover:text-primary transition">
                  #{idx + 1}
                </span>

                <span className="text-sm font-medium group-hover:text-primary transition">
                  {place.name}
                </span>
              </div>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 group-hover:bg-primary group-hover:text-white transition">
                {place.questions} posts
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Questions */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">
                Popular Questions
              </h3>
              <p className="text-[11px] text-gray-500">
                What people are asking
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-3 space-y-1">
          {popularQuestions.map((q) => (
            <button
              key={q}
              onClick={() => {
                setSearchQuery(q);
                onClose?.();
              }}
              className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition text-left group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 group-hover:bg-primary transition" />

              <span className="text-sm leading-snug group-hover:text-primary transition">
                {q}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DiscoverSidebar;
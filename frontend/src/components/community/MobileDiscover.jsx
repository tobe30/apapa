import { X, Compass } from "lucide-react";
import DiscoverSidebar from "./DiscoverSidebar";

const MobileDiscover = ({
  open,
  setOpen,
  trendingPlaces,
  popularQuestions,
  setSelectedPlace,
  setSearchQuery,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end lg:hidden">

      <div className="bg-base-100 w-full rounded-t-2xl max-h-[85vh] overflow-y-auto p-4 animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            Discover
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENT (reused component) */}
        <DiscoverSidebar
  trendingPlaces={trendingPlaces}
  popularQuestions={popularQuestions}
  setSearchQuery={(val) => {
    setSearchQuery(val);
    setOpen(false);
  }}
  setSelectedPlace={(val) => {
    setSelectedPlace(val);
    setOpen(false);
  }}
/>
      </div>
    </div>
  );
};

export default MobileDiscover;
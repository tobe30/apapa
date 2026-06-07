import { useEffect, useState } from "react";
import { 
  Search, ThumbsUp, MessageCircle, MapPin, Clock, Eye,
  CheckCircle, ChevronDown, Users, Award, Compass, Route, Map, Plus, Share2, Bookmark,
  NavigationIcon,
  ThumbsDown,
  BadgeCheck,
  X,
  TrendingUp,
  Loader2
} from "lucide-react";
import AskQuestionModal from "./AskQuestionModal";
import MobileDiscover from "./MobileDiscover";
import { useNavigate, useSearchParams } from "react-router-dom";
import DiscoverSidebar from "./DiscoverSidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllQuestions, getAuthUser, getLeaderboard, QuestionDownvote, questionUpvote, SaveQuestion } from "../../lib/api";
import { formatDistanceToNow } from "date-fns";
import FeedSkeleton from "./skeletons/FeedSkeleton";
import toast from "react-hot-toast";


const FeedPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openAskModal, setOpenAskModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [openDiscover, setOpenDiscover] = useState(false);
  const [searchParams] = useSearchParams();
  const [loadingUpvoteId, setLoadingUpvoteId] = useState(null);
  const [loadingDownvoteId, setLoadingDownvoteId] = useState(null);

useEffect(() => {
  const q = searchParams.get("query");
  if (q) setSearchQuery(q);
}, [searchParams])

  const queryClient = useQueryClient();
const [selectedPlace, setSelectedPlace] = useState(null);
    const { data: authData } = useQuery({
      queryKey: ["authUser"],
      queryFn: getAuthUser,
    });
  const currentUserId = authData?.user?._id;

  const openQuestion = (questionId) => {
  navigate(`/feed/${questionId}`);
};

const openProfile = (id) => {
  navigate(`/profile/${id}`);
};


const { data, isLoading, error } = useQuery({
  queryKey: ["questions"],
  queryFn: getAllQuestions,
});

  const questions =
    (data?.questions || []).map((q) => ({
      ...q,
      isUpvoted: q.upvotedBy?.some((id) => id === currentUserId),
      isDownvoted: q.downvotedBy?.some((id) => id === currentUserId),
    })) || [];


const trendingPlacesMap = questions.reduce((acc, q) => {
  const placeId = q?.place?._id;
  const placeName = q?.place?.name?.trim();

  if (!placeId) return acc;

  if (!acc[placeId]) {
    acc[placeId] = {
  id: placeId,
  name: placeName,
  questions: 0,
  upvotes: 0,
};
  }

  acc[placeId].questions += 1;
  acc[placeId].upvotes += q.stats?.upvotes || 0;

  return acc;
}, {});

const trendingPlaces = Object.values(trendingPlacesMap).sort(
  (a, b) => b.questions - a.questions || b.upvotes - a.upvotes
);


const popularQuestions = [...questions]
  .sort((a, b) => {
    const scoreA = (a.stats?.upvotes || 0) + (a.answers?.length || 0) * 2;
    const scoreB = (b.stats?.upvotes || 0) + (b.answers?.length || 0) * 2;
    return scoreB - scoreA;
  })
  .slice(0, 8)
  .map(q => q.question); // ✅ IMPORTANT

// if (isLoading) {
//   return <FeedSkeleton />;
// }
// console.log("Fetched questions:", questions);

const { mutate: upvoteMutation } = useMutation({
  mutationFn: questionUpvote,

  onMutate: (id) => {
    setLoadingUpvoteId(id); // 👈 track which one is loading
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["questions"] });
  },

  onError: (error) => {
    toast.error(error.message);
  },

  onSettled: () => {
    setLoadingUpvoteId(null); // 👈 reset after done
  },
});

  const categories = ["All", "Navigation", "Housing", "Safety", "Services", "Student Life", "General"];



const downvoteMutation = useMutation({
  mutationFn: QuestionDownvote,

  onMutate: (id) => {
    setLoadingDownvoteId(id); // track which question is loading
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["questions"] });
  },

  onError: (error) => {
    toast.error(error.message);
  },

  onSettled: () => {
    setLoadingDownvoteId(null); // reset after request finishes
  },
});

  const { data: leaderboardData } = useQuery({
  queryKey: ["leaderboard"],
  queryFn: getLeaderboard,
});

const saveMutation = useMutation({
  mutationFn: SaveQuestion,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["questions"] });
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
  },
  onError: (error) => {
      toast.error(error.message);
    },
});

// const topContributors = leaderboardData?.leaderboard ?? [];

const topContributors =
  leaderboardData?.leaderboard
    ?.slice(0, 5) // ✅ only show top 5
    .map((u) => ({
      id: u._id,
      name: u.name,
      image: u.profilePic || "/default.jpg",
      points: u.points,
      answers: 0,
      badge: u.badges?.[u.badges.length - 1] || "Newbie",
      verified: u.points >= 100,
    })) ?? [];

  const handleTagClick = (tag) => {
  setSelectedTag((prev) => (prev === tag ? null : tag));
};

const filteredQuestions = questions.filter((q) => {
  const matchesSearch =
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.place?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.description.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesCategory =
    activeCategory === "All" || q.category === activeCategory;

  const matchesPlace =
  !selectedPlace || q.place?._id === selectedPlace;

  const matchesTag =
    !selectedTag || q.tags?.includes(selectedTag);

  return matchesSearch && matchesCategory && matchesTag && matchesPlace;
});

const handleShare = async (question) => {
  const url = `${window.location.origin}/feed/${question._id}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: question.question,
        text: question.description,
        url,
      });
    } catch (err) {
      console.log("Share cancelled", err);
    }
  } else {
    // fallback
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard");
  }
};

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="min-h-screen bg-base-100">

{/* Community Hero */}
<div className="border-b border-base-300 bg-base-100">
  <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">

    {/* Create Post Box */}
    <div
      onClick={() => setOpenAskModal(true)}
      className="
        flex items-center gap-3 p-3 md:p-4
        border border-base-300 rounded-lg
        hover:border-primary cursor-pointer transition
      "
    >
      {/* Avatar */}
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden">
        <img
          src={authData?.user?.profilePic || "/default.jpg"}
          alt="User"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Fake input */}
      <div className="flex-1 bg-base-200 rounded-full px-4 py-2.5 text-sm md:text-base text-base-content/60">
        What’s on your mind? Ask a question…
      </div>
    </div>

    {/* Quick Actions */}
    <div className="flex items-center justify-between mt-3 px-1">

      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpenAskModal(true)}
          className="btn btn-ghost btn-xs md:btn-sm text-base-content/60"
        >
          <MessageCircle className="w-4 h-4" />
          Ask
        </button>

        <button
          onClick={() => setOpenAskModal(true)}
          className="btn btn-ghost btn-xs md:btn-sm text-base-content/60"
        >
          <MapPin className="w-4 h-4" />
          Location
        </button>

        <button
          onClick={() => setOpenAskModal(true)}
          className="btn btn-ghost btn-xs md:btn-sm text-base-content/60"
        >
          <Route className="w-4 h-4" />
          Route Help
        </button>
      </div>

      <button
        onClick={() => setOpenAskModal(true)}
        className="btn bg-primary text-white btn-xs md:btn-sm"
      >
        Post
      </button>
    </div>

    {/* Search & Filters */}
    <div className="mt-5 pt-4 border-t border-base-300">

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            input input-bordered w-full
            pl-9 h-9 text-sm rounded-full
          "
        />

        
      </div>

      {/* Categories */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              px-3 py-1.5 rounded-full text-xs md:text-sm font-medium
              border transition whitespace-nowrap
              ${
                activeCategory === category
                  ? "bg-primary text-primary-content border-primary"
                  : "bg-base-200 text-base-content/70 border-base-300 hover:bg-base-300"
              }
            `}
          >
            {category}
          </button>
        ))}

        
      </div>
      

    </div>
    
  </div>
  
</div>

       {/* Mobile Top Contributors - Horizontal Scroll */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center gap-2 mb-3 px-4">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Top Contributors</h3>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide px-4">
              {topContributors.map((contributor, index) => (
                <div
                  key={index}
                  onClick={() => openProfile(contributor.id)} 
                  className="flex-shrink-0 w-32 bg-base-100 rounded-xl p-3 border border-base-300 shadow-sm hover:shadow-md transition"
                >
                  {/* Image */}
                  <div className="relative mx-auto w-14 h-14 mb-2">
                    <img
                      src={contributor.image}
                      alt={contributor.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                    />

                    {/* Rank */}
                    <div
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                        ${
                          index === 0
                            ? "bg-yellow-400 text-black"
                            : index === 1
                            ? "bg-gray-300 text-black"
                            : index === 2
                            ? "bg-orange-400 text-white"
                            : "bg-primary text-primary-content"
                        }
                      `}
                    >
                      {index + 1}
                    </div>

                    {/* Verified */}
                    {contributor.verified && (
                      <CheckCircle className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-secondary bg-base-100 rounded-full" />
                    )}
                  </div>

                  {/* Name */}
                  <p className="font-medium text-xs text-center truncate">
                    {contributor.name}
                  </p>

                  {/* Points */}
                  <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 mt-0.5">
                    <span>{contributor.points.toLocaleString()} pts</span>
                  </div>

                  {/* Badge */}
                  <div className="mt-2 text-[9px] text-center badge badge-outline w-full justify-center truncate">
                    {contributor.badge}
                  </div>
                </div>
              ))}
            </div>
          </div>

<div className="container mx-auto px-4 mt-4">
  {selectedTag && (
    <div className="mb-4 flex flex-wrap items-center gap-2 bg-base-100 p-3 rounded-lg border border-base-300">
      
      <span className="text-sm text-gray-600">
        Filtering by:
      </span>

      <span className="badge bg-primary text-white">
        #{selectedTag}
      </span>

      <button
        onClick={() => setSelectedTag(null)}
        className="text-xs text-red-500 hover:underline"
      >
        Clear
      </button>

    </div>
  )}
</div>

      {/* Questions Feed */}
      <div className="container mx-auto px-4 grid mt-7 lg:grid-cols-[1fr_380px] gap-8">
        
        <div className="space-y-4">
          {filteredQuestions.length === 0 && (
            <div className="card bg-base-200 p-8 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No questions found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or category filter</p>
              <button  onClick={() => setOpenAskModal(true)} className="btn bg-primary text-white inline-flex items-center">
                <Plus className="w-4 h-4 mr-2" /> Ask a Question
              </button>
            </div>
          )}

         {filteredQuestions.map(q => {

  // ✅ SORT ANSWERS BY MOST UPVOTES
  const topAnswer = [...(q.answers || [])].sort(
    (a, b) => (b.stats?.upvotes || 0) - (a.stats?.upvotes || 0)
  )[0];

  

  return (
  <div
    key={q._id}
    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
  >

    <div className="p-4">
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full"
          onClick={() => openProfile(q.author._id)}
          >
            <img
  src={q.author?.profilePic ? q.author.profilePic : "/default.jpg"}
  alt={q.author?.name || "User"}
/>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{q.author?.name}</span>

            {q.verified && (
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <BadgeCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="w-3 h-3" /> {q.place?.name} • <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
          </div>
        </div>

        <span className="badge bg-primary text-white hidden sm:inline-flex text-xs">{q.category}</span>
      </div>

      <h3 className="text-base md:text-lg font-semibold mb-2">{q.question}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{q.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {q.tags.map((tag) => (
  <span
    key={tag}
    onClick={() => handleTagClick(tag)}
    className={`badge text-xs cursor-pointer border transition
      ${
        selectedTag === tag
          ? "bg-primary text-white border-primary"
          : "border-gray-300 text-gray-700 hover:bg-primary hover:text-white"
      }
    `}
  >
    #{tag}
  </span>
))}
      </div>

       {topAnswer && (
          <div
            className="mt-4 bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            onClick={() => openQuestion(q._id)}
          >
            <div className="flex items-center gap-2 mb-2">
              <img
                src={topAnswer?.author?.profilePic || "/default.jpg"}
                className="w-7 h-7 rounded-full"
                alt="author"
              />
              <span className="font-medium text-sm">
                {topAnswer?.author?.name}
              </span>

              <span className="ml-auto text-xs text-gray-400">
                Top Answer
              </span>
            </div>

            <p className="text-sm text-gray-700">
              {topAnswer?.text}
            </p>

            {/* VOTES */}
            <div className="flex gap-4 mt-3 text-sm text-gray-500 items-center">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {topAnswer?.stats?.upvotes || 0}
              </span>

              <span className="flex items-center gap-1">
                <ThumbsDown className="w-4 h-4" />
                {topAnswer?.stats?.downvotes || 0}
              </span>

              <span className="ml-auto text-black">
                View all answers →
              </span>
            </div>
          </div>
        )}


                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-300 gap-2">
                  <div className="flex items-center gap-1">
                    {/* Upvote */}
<button
  onClick={() => upvoteMutation(q._id)}
  disabled={loadingUpvoteId === q._id}
  className="btn btn-ghost btn-sm flex items-center gap-1"
>
  {loadingUpvoteId === q._id ? (
    <Loader2 className="w-4 h-4 animate-spin text-primary" />
  ) : (
    <ThumbsUp
      className={`w-4 h-4 transition ${
        q.isUpvoted ? "text-primary" : "text-gray-400"
      }`}
      fill={q.isUpvoted ? "currentColor" : "none"}
    />
  )}

  <span>{q.stats?.upvotes ?? 0}</span>
</button>

<button
  onClick={() => downvoteMutation.mutate(q._id)}
  disabled={loadingDownvoteId === q._id}
  className="btn btn-ghost btn-sm flex items-center gap-1"
>
  {loadingDownvoteId === q._id ? (
    <Loader2 className="w-4 h-4 animate-spin text-red-500" />
  ) : (
    <ThumbsDown
      className={`w-4 h-4 transition ${
        q.isDownvoted ? "text-red-500" : "text-gray-400"
      }`}
      fill={q.isDownvoted ? "currentColor" : "none"}
    />
  )}

  <span>{q.stats?.downvotes ?? 0}</span>
</button>

                    {/* Comments */}
                    <button
  className="btn btn-ghost btn-sm flex items-center gap-1"
  onClick={() => openQuestion(q._id)}
>
  <MessageCircle className="w-4 h-4" />
  {q.answers?.length ?? 0}
</button>

                    {/* Views */}
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" /> {q.stats?.views ?? 0}
                    </span>
                  </div>

  <div className="flex items-center gap-2">
    <button
  className={`btn btn-ghost btn-sm ${
   authData?.user?.savedQuestions?.includes(q._id) ? "text-primary" : ""
  }`}
  onClick={() => saveMutation.mutate(q._id)}
>
  <Bookmark
  className={`w-4 h-4 transition-colors duration-200 ${
    authData?.user?.savedQuestions?.includes(q._id)
      ? "text-primary fill-primary"
      : "text-gray-400"
  }`}
/>
</button>
    <button
  className="btn btn-ghost btn-sm"
  onClick={() => handleShare(q)}
>
  <Share2 className="w-4 h-4" />
</button>
    
  </div>
            </div>
    </div>
  </div>

    );
})}

        </div>

        {/* Sidebar */}
          <div className="hidden lg:block">
  <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl overflow-hidden bg-base-100 border border-base-300 shadow-sm">

              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary p-4 flex items-center gap-2 text-primary-content">
                <Award className="w-5 h-5" />
                <h3 className="font-semibold">Top Contributors</h3>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                {topContributors.map((contributor, index) => (
                  <div
                  onClick={() => openProfile(contributor.id)}
                    key={index}
                    className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-2 rounded-xl transition"
                  >
                    {/* Avatar + Rank */}
                    <div className="relative">
                      <img
                        src={contributor.image}
                        alt={contributor.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                      />

                      {/* Rank Badge */}
                      <div
  className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shadow
    ${
      index === 0
        ? "bg-slate-900 text-white"        // 1st – premium black
        : index === 1
        ? "bg-slate-600 text-white"        // 2nd – muted steel
        : index === 2
        ? "bg-slate-400 text-white"        // 3rd – soft gray
        : "bg-gray-200 text-gray-700"      // others
    }
  `}
>
  {index + 1}
</div>

                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm truncate hover:text-primary transition">
                          {contributor.name}
                        </p>
                        {contributor.verified && (
                          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <BadgeCheck className="w-3 h-3 text-white" />
              </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span>{contributor.points.toLocaleString()} pts</span>
                        <span>•</span>
                        <span>{contributor.answers} answers</span>
                      </div>
                    </div>

                    {/* Badge */}
                    <span className="badge text-xs hidden sm:inline-flex border border-gray-300 text-gray-600 bg-gray-50">
  {contributor.badge}
</span>

                  </div>
                ))}
              </div>
            </div>

<DiscoverSidebar
  trendingPlaces={trendingPlaces}
  popularQuestions={popularQuestions}
  setSelectedPlace={setSelectedPlace}
  setSearchQuery={setSearchQuery}
/>
          </div>

      </div>
      </div>
      
      
        <button
  onClick={() => setOpenDiscover(true)}
  className="fixed bottom-6 right-6 z-50 lg:hidden btn btn-primary btn-circle shadow-lg hover:scale-105 transition"
>
  <Compass className="w-5 h-5" />
</button>

        {/* Ask Navigation Modal */}
           <AskQuestionModal
            open={openAskModal}
            setOpen={setOpenAskModal}
            />

        

<MobileDiscover
  open={openDiscover}
  setOpen={setOpenDiscover}
  trendingPlaces={trendingPlaces}
  popularQuestions={popularQuestions}
  setSelectedPlace={setSelectedPlace}
  setSearchQuery={setSearchQuery}
/>




    </div>
  );
};

export default FeedPage;

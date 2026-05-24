import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MapPin,
  CheckCircle,
  Share2,
  Bookmark,
  Clock,
  Eye,
  Send,
  Compass,
} from "lucide-react";
import { trendingPlaces, popularQuestions } from "../../data/discoverData"; // 🔥 move to a separate file later
import MobileDiscover from "./MobileDiscover";
import { addAnswer, answerDownvote, answerUpvote, getAuthUser, getQuestionById, incrementQuestionView, QuestionDownvote, questionUpvote, SaveQuestion } from "../../lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import FeedSkeleton from "./skeletons/FeedSkeleton";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();


   const [openDiscover, setOpenDiscover] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [saved, setSaved] = useState(false);
  const [answerFilter, setAnswerFilter] = useState("newest");
  const { data: authData } = useQuery({
  queryKey: ["authUser"],
  queryFn: getAuthUser,
});
  const currentUserId = authData?.user?._id;
  const queryClient = useQueryClient();


  const { data, isLoading, error } = useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestionById(id),
  });

  const question = data?.question;


const isUpvoted = question?.upvotedBy?.some(
  id => id?.toString() === currentUserId
);
const isDownvoted = question?.downvotedBy?.some(
  id => id?.toString() === currentUserId
);

  const answers = question?.answers ?? [];

    const enrichedAnswers = useMemo(() => {
    return answers.map((a) => ({
      ...a,

      isUpvoted: a.upvotedBy?.some(
        (userId) => userId?.toString() === currentUserId
      ),

      isDownvoted: a.downvotedBy?.some(
        (userId) => userId?.toString() === currentUserId
      ),
    }));
  }, [answers, currentUserId]);

const sortedAnswers = useMemo(() => {
    const sorted = [...enrichedAnswers];

    if (answerFilter === "top") {
      return sorted.sort(
        (a, b) => (b.upvotes || 0) - (a.upvotes || 0)
      );
    }

    if (answerFilter === "newest") {
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    return sorted;
  }, [enrichedAnswers, answerFilter]);


const upvoteMutation = useMutation({
  mutationFn: () => questionUpvote(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["question", id] });
  },
});

const downvoteMutation = useMutation({
  mutationFn: () => QuestionDownvote(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["question", id] });
  },
});

const saveMutation = useMutation({
  mutationFn: SaveQuestion,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["questions"] });
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
  },
});

const isSaved = authData?.user?.savedQuestions?.includes(question?._id);//

const addAnswerMutation = useMutation({
  mutationFn: addAnswer,
  onSuccess: () => {
     toast.success("Answer added successfully");
    queryClient.invalidateQueries({ queryKey: ["question", id] });
    setAnswerText("");
  },
});


const answerUpvoteMutation = useMutation({
  mutationFn: ({ answerId }) => answerUpvote(answerId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["question", id] });
  },

    onError: () => {
        toast.error("Failed to downvote answer");
      },
});

const answerDownvoteMutation = useMutation({
  mutationFn: ({ answerId }) => answerDownvote(answerId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["question", id] });
  },

    onError: () => {
      toast.error("Failed to downvote answer");
    },
});

const incrementViewMutation = useMutation({
  mutationFn: incrementQuestionView,
});

useEffect(() => {
  if (!id) return;

  const timer = setTimeout(() => {
    incrementViewMutation.mutate(id);
  }, 800); // small delay

  return () => clearTimeout(timer);
}, [id]);

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

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return;
    addAnswerMutation.mutate({
    questionId: id,
    text: answerText,
});
  };

  if (isLoading) return <FeedSkeleton />;


  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Failed to load question Refresh the page and try again.</div>;
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Question not found
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Back */}
        <button
          onClick={() => navigate("/feed")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* QUESTION CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">

          <div className="p-6 border-b border-gray-100">
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <img
  src={question.author?.profilePic || "/default.jpg"}
  className="w-11 h-11 rounded-full object-cover"
/>

              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <Link className="font-semibold text-sm">
                  {question.author?.name}
                  </Link>
                  {question.verified && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                </div>

                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {question.place?.name} •
                  <Clock className="w-3 h-3 ml-1" />
                  {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                </div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                {question.category}
              </span>
            </div>

            {/* Content */}
            <h1 className="text-xl font-semibold mb-2 leading-snug">
              {question.question}
            </h1>

            <p className="text-sm text-gray-600 leading-relaxed">
              {question.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {question.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex gap-3">
             <button
  onClick={() => upvoteMutation.mutate()}
  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition ${
    isUpvoted ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
  }`}
>
  <ThumbsUp className="w-4 h-4" />
  {question.stats?.upvotes ?? 0}
</button>

<button
  onClick={() => downvoteMutation.mutate()}
  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition ${
    isDownvoted ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700"
  }`}
>
  <ThumbsDown className="w-4 h-4" />
  {question.stats?.downvotes ?? 0}
</button>

              <span className="flex items-center gap-1 text-sm text-gray-500">
                <MessageCircle className="w-4 h-4" />
                {question.answers?.length ?? 0}
              </span>

              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                {question.stats.views}
              </span>
            </div>

            <div className="flex gap-2">
              <button
  onClick={() => saveMutation.mutate(question._id)}
  className="p-2 rounded-full hover:bg-gray-100"
>
  <Bookmark
    className={`w-4 h-4 transition-colors duration-200 ${
      isSaved ? "text-primary fill-primary" : "text-gray-400"
    }`}
  />
</button>

              <button className="p-2 rounded-full hover:bg-gray-100">
                <Share2 
                className="w-4 h-4"
                 onClick={() => handleShare(question)}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ANSWER INPUT */}
<div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
  <div className="flex gap-3">
    <img
      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
      className="w-10 h-10 rounded-full object-cover"
      alt="user"
    />

    <div className="flex-1">
      {/* TEXTAREA */}
      <textarea
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        placeholder="Write your answer..."
        className="w-full min-h-[120px] border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
      />

      {/* HELPER TEXT */}
      <p className="text-xs text-gray-500 mt-2">
        Be respectful and helpful. Verified answers earn trust badges.
      </p>

      {/* ACTIONS */}
      <div className="flex justify-end mt-3">
        <button
          disabled={addAnswerMutation.isPending}
          onClick={handleSubmitAnswer}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Send className="w-4 h-4" />
          {addAnswerMutation.isPending ? "Posting..." : "Post Answer"}
        </button>
      </div>
    </div>
  </div>
</div>

<div className="mt-8 flex items-center justify-between">
  {/* LEFT: ANSWER COUNT */}
  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
    <MessageCircle className="w-4 h-4 text-gray-500" />
    <span>{question.answers?.length || 0} Answers</span>
  </div>

  {/* RIGHT: FILTER TABS */}
  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
    
    <button
      onClick={() => setAnswerFilter("top")}
      className={`px-3 py-1 text-sm rounded-md transition ${
        answerFilter === "top"
          ? "bg-primary shadow text-white font-medium"
          : "text-gray-600 hover:text-black"
      }`}
    >
      Top
    </button>

    <button
      onClick={() => setAnswerFilter("newest")}
      className={`px-3 py-1 text-sm rounded-md transition ${
        answerFilter === "newest"
          ? "bg-primary shadow text-white font-medium"
          : "text-gray-600 hover:text-black"
      }`}
    >
      Newest
    </button>
  </div>
</div>
        {/* ANSWERS */}
       <div className="mt-6 space-y-4">
  {sortedAnswers.map((a) => (
    <div
      key={a._id || a.id}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-5"
    >
      {/* AUTHOR */}
      <div className="flex gap-3 mb-3">
        <img
          src={a.author?.profilePic || "/default.jpg"}
          className="w-9 h-9 rounded-full"
          alt="author"
        />

        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-medium text-sm">
              {a.author?.name}
            </span>
          </div>

          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* ANSWER TEXT */}
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        {a.text}
      </p>

      {/* DIVIDER */}
      <div className="border-t border-gray-200 my-3" />

      {/* VOTES */}
      <div className="flex items-center gap-6 pt-1">
         <button
  onClick={() =>
    answerUpvoteMutation.mutate({ answerId: a._id })
  }
  className={`flex items-center gap-2 text-sm transition ${
    a.isUpvoted
      ? "text-primary"
      : "text-gray-600 hover:text-primary"
  }`}
>
  <ThumbsUp
    className={`w-5 h-5 ${
      a.isUpvoted ? "fill-current" : ""
    }`}
  />

  <span className="font-medium">
    {a.stats?.upvotes ?? 0}
  </span>
</button>
<button
  onClick={() =>
    answerDownvoteMutation.mutate({ answerId: a._id })
  }
  className={`flex items-center gap-2 text-sm transition ${
    a.isDownvoted
      ? "text-red-500"
      : "text-gray-600 hover:text-red-500"
  }`}
>
  <ThumbsDown
    className={`w-5 h-5 ${
      a.isDownvoted ? "fill-current" : ""
    }`}
  />

  <span className="font-medium">
    {a.stats?.downvotes ?? 0}
  </span>
</button>
      </div>
    </div>
  ))}
</div>

      </div>

      <button
  onClick={() => setOpenDiscover(true)}
  className="fixed bottom-6 right-6 z-50 lg:hidden btn btn-primary btn-circle shadow-lg hover:scale-105 transition"
>
  <Compass className="w-5 h-5" />
</button>

<MobileDiscover
  open={openDiscover}
  setOpen={setOpenDiscover}
  trendingPlaces={trendingPlaces}
  popularQuestions={popularQuestions}
  
/>
    </div>
  );
};

export default QuestionDetail;
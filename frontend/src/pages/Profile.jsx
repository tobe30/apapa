import { useState } from "react";
import {
  MapPin,
  Calendar,
  Trophy,
  Edit,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeUserPassword, deleteanswer, deletequestion, getAuthUser, getSavedQuestions, getUserAnswers, getUserProfile, getUserQuestions, SaveQuestion, updateAnswer, updateQuestion, updateUserProfile } from "../lib/api";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import FeedSkeleton from "../components/community/skeletons/FeedSkeleton";

export default function Profile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("answers");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");
  const [editForm, setEditForm] = useState({
  question: "",
  description: "",
});
const navigate = useNavigate();

const [passwords, setPasswords] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

  const queryClient = useQueryClient();

  

  const { data: authUser } = useQuery({
  queryKey: ["authUser"],
  queryFn: getAuthUser,
});

const userId = id || authUser?.user?._id;// 🔥 CRITICAL: use authUser's ID if no ID in params

const isOwnProfile = authUser?.user?._id === userId; //🔥 CRITICAL: determine if this is the logged-in user's profile


const { data: user, isLoading } = useQuery({
  queryKey: ["userProfile", userId],
  queryFn: () => getUserProfile(userId),
  enabled: !!userId, // 🔥 IMPORTANT
});

const authData = user?.user || user;


const [formData, setFormData] = useState({
    name: "",
		email: "",
		bio: "",
		location: "",
    profilePic: null,
	});
  
const updateProfileMutation = useMutation({
  mutationFn: updateUserProfile,
  onSuccess: () => {
    toast.success("Profile updated successfully");

    queryClient.invalidateQueries({ queryKey: ["authUser"] });
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });

    setIsModalOpen(false);
  },
  onError: (error) => {
    toast.error(error.message || "Update failed");
  },
});

const { data: questionsData = [] } = useQuery({
  queryKey: ["userQuestions", userId],
  queryFn: () => getUserQuestions(userId),
  enabled: !!userId,
});

const updateQuestionMutation = useMutation({
  mutationFn: ({ id, data }) => updateQuestion(id, data),

  onSuccess: () => {
    toast.success("Question updated");

    queryClient.invalidateQueries({
      queryKey: ["userQuestions", userId],
    });
  },
});

console.log("questionsData:", questionsData);

const deleteQuestionMutation = useMutation({
  mutationFn: deletequestion,

  onSuccess: () => {
    toast.success("Question deleted");

    queryClient.invalidateQueries({
      queryKey: ["userQuestions", userId],
    });
  },

  onError: (error) => {
    toast.error(error.message || "Failed to delete question");
  },
});

const { data: answersData = [], isLoading: loadingAnswers } = useQuery({
  queryKey: ["userAnswers", userId],
  queryFn: () => getUserAnswers(userId),
  enabled: !!userId,

  
});

// console.log("answersData:", answersData);

const updateAnswerMutation = useMutation({
  mutationFn: ({ id, data }) => updateAnswer(id, data),

  onSuccess: () => {
    toast.success("Answer updated");

    queryClient.invalidateQueries({
      queryKey: ["userAnswers", userId],
    });
  },
});

const deleteAnswerMutation = useMutation({
  mutationFn: deleteanswer,

  onSuccess: () => {
    toast.success("Answer deleted");

    queryClient.invalidateQueries({
      queryKey: ["userAnswers", userId],
    });
  },

  onError: (error) => {
    toast.error(error.message || "Failed to delete answer");
  },
});


const { data: savedQuestions = [] } = useQuery({
  queryKey: ["savedQuestions", userId],
  queryFn: () => getSavedQuestions(userId),
  enabled: isOwnProfile,
});

const goToQuestion = (id) => {
  navigate(`/question/${id}`);
};

const userBadges = authData?.badges || [];

const badgeMeta = {
  "Rising Contributor": {
    icon: "🚀",
    color: "from-blue-400 to-blue-600",
    description: "You’re starting to contribute actively",
  },
  "Active Contributor": {
    icon: "⭐",
    color: "from-yellow-400 to-yellow-600",
    description: "You are consistently active in the community",
  },
  "Top Contributor": {
    icon: "🏆",
    color: "from-purple-400 to-purple-600",
    description: "One of the most active users",
  },
};
const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const changePasswordMutation = useMutation({
  mutationFn: changeUserPassword,

  onSuccess: (data) => {
    toast.success(data.message || "Password updated successfully");

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setIsPasswordModalOpen(false);
  },

  onError: (error) => {
    toast.error(error.response?.data?.message || "Failed to change password");
  },
});

const saveMutation = useMutation({
  mutationFn: SaveQuestion,

  onSuccess: (data) => {
    toast.success(data.message);

    queryClient.invalidateQueries({
      queryKey: ["savedQuestions", userId],
    });

    queryClient.invalidateQueries({
      queryKey: ["authUser"],
    });
  },
});

console.log("savedQuestions:", savedQuestions);


  const getActiveData = () => {
  if (activeTab === "questions") return questionsData;
   if (activeTab === "answers") return answersData;
  if (activeTab === "saved") return savedQuestions;
  if (activeTab === "badges") {
    return userBadges.map((name, index) => ({
      id: index,
      name,
      ...badgeMeta[name],
    }));
  }

  return [];
};

  //image
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;


setFormData((prev) => ({
  ...prev,
  profilePic: file, // real file, NOT blob
}));
};

const handleUpdateProfile = () => {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("bio", formData.bio);
    data.append("location", formData.location);

    if (formData.profilePic instanceof File) {
      data.append("profilePic", formData.profilePic);
    }

    updateProfileMutation.mutate(data);
  };

   const previewImage =
    formData.profilePic instanceof File
      ? URL.createObjectURL(formData.profilePic)
      : formData.profilePic;

const handleDelete = (id) => {
  if (activeTab === "questions") {
    deleteQuestionMutation.mutate(id);
  }

  if (activeTab === "answers") {
    deleteAnswerMutation.mutate(id);
  }


};


const handleSaveEdit = () => {
  if (!editingPost) return;

  // 🟡 UPDATE QUESTION
  if (editingPost.type === "questions") {
    updateQuestionMutation.mutate({
      id: editingPost.id,
      data: {
        question: editForm.question,
        description: editForm.description,
      },
    });
  }


  // 🔵 UPDATE ANSWER
  if (editingPost.type === "answers") {
    updateAnswerMutation.mutate({
      id: editingPost.id,
      data: {
        text: editForm.text,
      },
    });
  }

  setEditingPost(null);
};


const recentActivities = [
  ...(questionsData || []).map((q) => ({
    id: q._id,
    type: "question",
    text: `Asked: ${q.question}`,
    createdAt: q.createdAt,
  })),

  ...(answersData || []).map((a) => ({
    id: a._id,
    type: "answer",
    text: `Answered a community question`,
    createdAt: a.createdAt,
  })),
]
.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
.slice(0, 5);

if (isLoading) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <FeedSkeleton />
    </div>
  );
}

const renderContent = () => {
  const data = getActiveData();

  if (!data.length) {
    return (
      <div className="text-center text-gray-500 text-sm py-10">
        No content yet.
      </div>
    );
  }
  

  // 🏅 BADGES UI (NEW)
  if (activeTab === "badges") {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {data.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-2xl p-5 border border-gray-200 bg-gradient-to-br ${badge.color} text-white shadow-sm hover:shadow-md transition`}
          >
            <div className="text-3xl mb-3">{badge.icon}</div>

            <h3 className="font-semibold text-lg">
               {badge.name}
            </h3>

            <p className="text-white/80 text-sm mt-1">
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // 🧾 NORMAL POSTS UI (QUESTIONS / ANSWERS / SAVED)
  return data.map((post) => (
  <div
    key={post._id}
    className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-4 sm:p-5"
  >

    {/* TOP */}
    <div className="flex justify-between items-start gap-3">

      {/* LEFT */}
      <div className="flex-1">

        {/* LABEL */}
        <div className="flex items-center gap-2 mb-2">

          <span className="text-[11px] font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
             {activeTab === "questions" ? "Question" : "Answer"}
          </span>

          {post.isAccepted && (
            <span className="text-[11px] font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Accepted
            </span>
          )}

          {post.isTrusted && (
            <span className="text-[11px] font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Trusted
            </span>
          )}
        </div>

        {/* QUESTION CONTEXT */}
        <p className="text-xs text-gray-400 mb-2">
          
        </p>

        {/* ANSWER TEXT */}
        {editingPost?.id === post._id ? (
  <div className="space-y-2">

    {/* 🟡 QUESTION EDIT MODE */}
    {activeTab === "questions" ? (
      <>
        <input
          value={editForm.question}
          onChange={(e) =>
            setEditForm({ ...editForm, question: e.target.value })
          }
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          placeholder="Question title"
        />

        <textarea
          value={editForm.description}
          onChange={(e) =>
            setEditForm({ ...editForm, description: e.target.value })
          }
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-gray-300"
          placeholder="Description"
        />
      </>
    ) : (
      /* 🔵 ANSWER EDIT MODE */
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-gray-300"
      />
    )}

    {/* ACTIONS */}
    <div className="flex gap-2">
      <button
        onClick={handleSaveEdit}
        className="px-3 py-1.5 text-xs bg-black text-white rounded-lg"
      >
        Save
      </button>

      <button
        onClick={() => setEditingPost(null)}
        className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg"
      >
        Cancel
      </button>
    </div>
  </div>
) : (
 <div className="text-sm sm:text-[15px] text-gray-800 leading-relaxed">
  {activeTab === "questions" || activeTab === "saved" ? (
    <>
       <p
      className="font-medium cursor-pointer hover:text-primary"
      onClick={() => goToQuestion(post._id)}
    >
      {post.question}
    </p>

      <p className="text-gray-500 text-sm mt-1">
        {post.description}
      </p>
    </>
  ) : (
    <p>{post.text}</p>
  )}
</div>
)}

      </div>
      

      {/* ACTIONS */}
      {/* ACTIONS */}
<div className="flex items-center gap-1">

  {/* QUESTIONS + ANSWERS */}
  {activeTab !== "saved" && (
    <>
    {isOwnProfile && (
      <button
        onClick={() => {
          setEditingPost({
            id: post._id,
            type: activeTab,
          });

          if (activeTab === "questions") {
            setEditForm({
              question: post.question || "",
              description: post.description || "",
            });
          }

          if (activeTab === "answers") {
            setEditText(post.text || "");
          }
        }}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
      >
        <Edit size={15} />
      </button>
      )}
      {isOwnProfile && (

      <button
      
        onClick={() => handleDelete(post._id)}
        className="p-2 rounded-lg hover:bg-red-50 text-red-500"
      >
        ✕
      </button>
      )}
    </>
  )}

  {/* SAVED TAB */}
  {activeTab === "saved" && (
<button
  onClick={() => saveMutation.mutate(post._id)}
  className="p-2 rounded-lg hover:bg-gray-100"
>
 <Bookmark
  className={`w-4 h-4 transition-colors duration-200 ${
    savedQuestions?.some(
      (q) => q._id.toString() === post._id.toString()
    )
      ? "text-primary fill-primary"
      : "text-gray-400"
  }`}
/>
  
</button>

  )}
  
</div>
    </div>

    {/* FOOTER */}
    <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-100 text-gray-500 text-sm">

      <div className="flex items-center gap-1">
        <ThumbsUp size={16} />
{post.stats?.upvotes || 0}
      </div>


<div className="flex items-center gap-1">
        <ThumbsDown size={16} />
{post.stats?.downvotes || 0}
      </div>

      <div className="text-xs text-gray-400 ml-auto">
        {post.createdAt
          ? formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })
          : ""}
      </div>

    </div>
  </div>
));
};
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* PROFILE CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex gap-4">
{/* Avatar */}
<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-gray-200 bg-primary text-white flex items-center justify-center">
  {authData?.profilePic ? (
    <img
      src={authData.profilePic}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-xl font-semibold text-white">
      {authData?.name?.charAt(0) || "U"}
    </span>
  )}
</div>

            {/* Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-primary">
                 { authData?.name || "Chinedu O." }
                </h2>
                <span className="text-xs bg-secondary/40 text-white px-2 py-1 rounded-full">
                  Local Expert
                </span>
              </div>

              <p className="text-gray-500 mt-1 text-sm max-w-md">
               {authData?.bio || "No bio available."}
              </p>

              <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-500 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {authData?.location || "Location not set"}
                </div>

                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                 {authData?.createdAt
  ? `Joined ${formatDistanceToNow(new Date(authData.createdAt))} ago`
  : "New user"}
                </div>

                <div className="flex items-center gap-1 text-secondary font-medium">
                  <Trophy size={14} />
                  {authData?.points || 0} pts
                </div>
              </div>
            </div>
          </div>

          {/* Edit */}
          {isOwnProfile && (
         <button
  onClick={() => {
    setFormData({
      name: authData?.name || "",
      email: authData?.email || "",
      bio: authData?.bio || "",
      location: authData?.location || "",
      profilePic: authData?.profilePic || "",
    });

    setIsModalOpen(true);
  }}
  className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
>
  <Edit size={16} />
  Edi
</button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

       {/* Stats */}
<div className="grid grid-cols-3 text-center py-4 text-sm sm:text-base">
  <div>
    <h3 className="font-semibold text-gray-900">
      {authData?.stats?.answers ?? 0}
    </h3>
    <p className="text-gray-500 text-xs sm:text-sm">Answers</p>
  </div>

  <div className="border-x border-gray-100">
    <h3 className="font-semibold text-gray-900">
      {authData?.stats?.questions ?? 0}
    </h3>
    <p className="text-gray-500 text-xs sm:text-sm">Questions</p>
  </div>

  <div>
    <h3 className="font-semibold text-gray-900">
      {authData?.stats?.helpfulAnswers ?? 0}
    </h3>
    <p className="text-gray-500 text-xs sm:text-sm">Helpful</p>
  </div>
</div>
      </div>

      {/* CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-full overflow-x-auto no-scrollbar">
            {["questions", "answers", "badges", ...(isOwnProfile ? ["saved"] : [])].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm transition ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          {renderContent()}
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          {isOwnProfile && recentActivities.length > 0 && (
         <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5">
  <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
    Recent activity
  </h3>

  <div className="space-y-3 text-sm">
    {recentActivities.length > 0 ? (
      recentActivities.map((activity) => (
        <div key={activity.id} className="flex gap-2">

          {activity.type === "answer" ? (
            <MessageCircle
              size={16}
              className="text-secondary mt-1"
            />
          ) : (
            <ThumbsUp
              size={16}
              className="text-primary mt-1"
            />
          )}

          <div>
            <p className="text-gray-700 text-sm">
              {activity.text}
            </p>

            <span className="text-gray-400 text-xs">
              {formatDistanceToNow(
                new Date(activity.createdAt),
                { addSuffix: true }
              )}
            </span>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-400 text-sm">
        No recent activity yet.
      </p>
    )}
  </div>
</div>
)}
          {/* ACCOUNT SECURITY CARD */}
          {isOwnProfile && (
<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5">
  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
    Account security
  </h3>

  <p className="text-gray-500 text-sm mt-1">
    Keep your account safe.
  </p>

<button
  onClick={() => setIsPasswordModalOpen(true)}
  className="mt-4 w-full px-4 py-2 text-sm rounded-xl bg-gray-900 text-white hover:opacity-90 transition"
>
  Change password
</button>
</div>
)}
        </div>
      </div>


{isModalOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    
    <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Edit Profile</h2>
        <p className="text-xs text-gray-500 mt-1">
          Update your personal information
        </p>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">

        {/* PROFILE IMAGE */}
        <div className="flex items-center gap-4">
          <div className="relative">
<img
  src={previewImage || "default.jpg"}
  className="w-16 h-16 rounded-full object-cover border"
/>

            <label className="absolute bottom-0 right-0 bg-black text-white text-[10px] px-2 py-1 rounded-full cursor-pointer">
  Edit
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleImageChange}
  />
</label>
          </div>

          <div>
            <p className="text-sm font-medium">Profile Photo</p>
            <p className="text-xs text-gray-500">
              JPG or PNG, max 2MB
            </p>
          </div>
        </div>

        {/* INPUTS */}
        <div className="space-y-3 pt-2">

          <div>
            <label className="text-xs text-gray-500">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">email</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 min-h-[80px]"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 flex justify-end gap-2">

        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 text-sm rounded-xl text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

<button
  onClick={handleUpdateProfile}
  className="px-4 py-2 text-sm rounded-xl bg-black text-white hover:opacity-90"
>
  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
</button>

      </div>
    </div>
  </div>
)}

{/* password modal */}

{isPasswordModalOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

    <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <p className="text-xs text-gray-500 mt-1">
          Update your account password securely
        </p>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">

        {/* Current Password */}
        <div>
          <label className="text-xs text-gray-500">Current password</label>
          <input
            type="password"
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, currentPassword: e.target.value })
            }
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="Enter current password"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="text-xs text-gray-500">New password</label>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="Enter new password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-xs text-gray-500">Confirm password</label>
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 flex justify-end gap-2">

        <button
          onClick={() => setIsPasswordModalOpen(false)}
          className="px-4 py-2 text-sm rounded-xl text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
         onClick={() => {
  changePasswordMutation.mutate(passwords);
}}
          className="px-4 py-2 text-sm rounded-xl bg-black text-white hover:opacity-90"
        >
          Update password
        </button>

      </div>

    </div>
  </div>
)}
    </div>

    
  );
  
}
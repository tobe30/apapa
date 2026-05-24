import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  User,
  MessageSquarePlus,
  Send,
  LogOut,
} from "lucide-react";
import logo from "../../assets/apapa-logo.png";
import AskQuestionModal from "./AskQuestionModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthUser, logout } from "../../lib/api";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Ask form state
  const [openAskModal, setOpenAskModal] = useState(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

      const { data: authUser } = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
      });

const logoutMutation = useMutation({
  mutationFn: logout,
  onSuccess: () => {
    queryClient.clear(); // clears cached user + feed
    navigate("/");   // or "/"
  },
});

  const submitSearch = (e) => {
    e.preventDefault();
    const slug = query.toLowerCase().trim().replace(/\s+/g, "-");

    navigate(`/feed?query=${encodeURIComponent(query)}`);
  };


  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Apapa"
                className="h-24 w-auto object-contain"
              />
            </Link>

            {/* SEARCH */}
            <form
              onSubmit={submitSearch}
              className="hidden md:flex flex-1 max-w-md mx-6 relative"
            >
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a question..."
                className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </form>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-primary">
              <Link to="/" className="hover:opacity-70">Home</Link>
              <Link to="/feed" className="hover:opacity-70">Feed</Link>
              <Link to="/rewards" className="hover:opacity-70">Rewards</Link>
            </nav>

            {/* ACTIONS */}
            <div className="hidden md:flex items-center gap-3">

              {/* 🔥 ASK BUTTON NOW OPENS MODAL */}
             <button
  onClick={() => setOpenAskModal(true)}
  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
>
  <MessageSquarePlus className="w-4 h-4" />
  Ask
</button>

              <Link
                to={`/profile/${authUser?.user?._id}`}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <User className="w-4 h-4 text-primary" />
              </Link>

                            {/* Logout */}
  <button
    onClick={() => logoutMutation.mutate()}
    className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition"
    title="Logout"
  >
    <LogOut className="w-4 h-4 text-red-500" />
  </button>
            </div>
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden bg-white shadow-md">
            <div className="px-4 py-4 space-y-4">

              <form onSubmit={submitSearch} className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200"
                />
              </form>

              <div className="flex flex-col gap-2 text-sm font-medium text-primary">
                <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                <Link to="/feed" onClick={() => setOpen(false)}>Feed</Link>
                <Link to="/rewards" onClick={() => setOpen(false)}>Rewards</Link>
                <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
              </div>

              {/* 🔥 MOBILE ASK BUTTON */}
             <button
                onClick={() => {
                  setOpen(false);
                  setOpenAskModal(true);
                }}
                className="block w-full text-center py-3 rounded-full bg-primary text-white font-semibold"
              >
                Ask a Question
              </button>

            </div>
          </div>
        )}
      </header>
      {/* Ask Navigation Modal */}
      <AskQuestionModal
      open={openAskModal}
      setOpen={setOpenAskModal}
/>
    </>
  );
};

export default Navbar;
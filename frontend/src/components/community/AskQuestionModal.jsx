import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  MessageCircle,
  NavigationIcon,
  X,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { addQuestion, searchPlaces } from "../../lib/api";
import toast from "react-hot-toast";

const AskQuestionModal = ({ open, setOpen }) => {
  // Hooks
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [question, setQuestion] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");

  // Place suggestions
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [category, setCategory] = useState("General");

  const queryClient = useQueryClient();

  const categories = [
    "Navigation",
    "Housing",
    "Safety",
    "Services",
    "Student Life",
    "General",
  ];

  // Add tag
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();

    if (!trimmedTag) return;

    // prevent duplicates
    if (
      selectedTags.some(
        (tag) => tag.toLowerCase() === trimmedTag.toLowerCase()
      )
    ) {
      setTagInput("");
      return;
    }

    setSelectedTags((prev) => [...prev, trimmedTag]);
    setTagInput("");
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setSelectedTags((prev) =>
      prev.filter((tag) => tag !== tagToRemove)
    );
  };

  // SEARCH PLACES
  useEffect(() => {
    if (!showSuggestions) return;
    const fetchPlaces = async () => {
      if (!location.trim()) {
        setPlaceSuggestions([]);
        return;
      }

      try {
        setLoadingPlaces(true);

        const places = await searchPlaces(location);

        setPlaceSuggestions(places);

      } catch (error) {
        console.log("Place search error:", error);
      } finally {
        setLoadingPlaces(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchPlaces();
    }, 300);

    return () => clearTimeout(debounce);

  }, [location]);

  // Create Question
  const { mutate: createQuestion, isPending } = useMutation({
    mutationFn: addQuestion,

    onSuccess: () => {
      toast.success("Question added successfully");

      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });

      // reset
      setQuestion("");
      setDetails("");
      setLocation("");
      setCategory("General");
      setSelectedTags([]);
      setTagInput("");
      setPlaceSuggestions([]);
      setShowSuggestions(false);

      setOpen(false);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during question addition"
      );

      console.error("Add Question Error:", error);
    },
  });

  // Submit
  const handleSubmit = () => {
    if (!question.trim()) return;

    createQuestion({
      question,
      description: details,
      place: location,
      category,
      tags: selectedTags,
    });
  };

  // conditional render
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-6 relative shadow-sm border border-gray-200">

        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <NavigationIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">
            Ask a Question
          </h2>
        </div>

        <div className="space-y-4">

          {/* Question */}
          <div>
            <label className="block text-xs font-medium mb-2">
              Your Question
            </label>

            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Best route from Festac to Apapa?"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Details */}
          <div>
            <label className="block text-xs font-medium mb-2">
              Details (Optional)
            </label>

            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Add more context..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium mb-2">
              Tags
            </label>

            {/* Input */}
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />

              <button
                onClick={handleAddTag}
                className="px-3 rounded-xl bg-primary text-white hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Tag List */}
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedTags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs"
                >
                  #{tag}

                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="relative">
            <label className="block text-xs font-medium mb-2">
              Place/area
            </label>

            <div className="flex gap-2">
              <input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowSuggestions(true);//
                }}
                placeholder="Enter your area"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />

              <button
                type="button"
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-100"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>

            {/* Suggestions */}
            {showSuggestions && location && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                {loadingPlaces ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Searching...
                  </div>

                ) : placeSuggestions.length > 0 ? (

                  placeSuggestions.map((place) => (
                    <button
                      type="button"
                      key={place._id}
                      onClick={() => {
                        setLocation(place.name);
                        setPlaceSuggestions([]);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      {place.name}
                    </button>
                  ))

                ) : (

                  <button
  type="button"
  onClick={() => {
    setShowSuggestions(false);
  }}
  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-primary"
>
  + Create new place: "{location}"
</button>

                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            disabled={isPending}
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <MessageCircle className="w-4 h-4" />

            {isPending ? "Posting..." : "Post Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionModal;
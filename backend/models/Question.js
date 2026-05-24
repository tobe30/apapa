import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: [
        "Navigation",
        "Housing",
        "Safety",
        "Services",
        "Student Life",
        "General",
      ],
      default: "General",
    },

    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: false,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

  upvotedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

downvotedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

    stats: {
      upvotes: {
        type: Number,
        default: 0,
      },
      downvotes: {
        type: Number,
        default: 0,
      },
      views: {
        type: Number,
        default: 0,
      },
      answerCount: {
        type: Number,
        default: 0,
      },
    },

    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],

    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
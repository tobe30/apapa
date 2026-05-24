import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
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

    // voters: [
    //   {
    //     user: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User",
    //     },
    //     vote: {
    //       type: String,
    //       enum: ["up", "down"],
    //     },
    //   },
    // ],

     stats: {
      upvotes: {
        type: Number,
        default: 0,
      },
      downvotes: {
        type: Number,
        default: 0,
      },
    },

    isAccepted: {
      type: Boolean,
      default: false,
    },

    isTrusted: {
      type: Boolean,
      default: false,
    },

    images: [
      {
        type: String, // optional (Cloudinary URLs later)
      },
    ],
  },
  { timestamps: true }
);

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
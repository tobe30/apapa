import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    profilePic: {
      type: String,
      default: "",
    },

    // ⭐ COMMUNITY SYSTEM
    points: {
      type: Number,
      default: 0,
    },

    badges: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      default: "",
    },

    stats: {
      questions: {
        type: Number,
        default: 0,
      },
      answers: {
        type: Number,
        default: 0,
      },
      helpfulAnswers: {
        type: Number,
        default: 0,
      },
    },

    savedQuestions: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
],

resetPasswordToken: {
  type: String,
  default: null,
},

resetPasswordExpires: {
  type: Date,
  default: null,
},
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
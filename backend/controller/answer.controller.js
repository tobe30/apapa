import { calculateBadges } from "../lib/calculatebadges.js";
import { updateTopAnswer } from "../lib/helper.js";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import { syncBadges } from "../utils/syncBadges.js";


export const createAnswer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId, text } = req.body;

    // 1. Validation
    if (!questionId || !text) {
      return res.status(400).json({
        success: false,
        message: "Question ID and answer text are required",
      });
    }

    // 2. Check if question exists
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // 3. Create answer
    const answer = await Answer.create({
      author: userId,
      question: questionId,
      text: text.trim(),
      upvotes: 0,
      downvotes: 0,
      isAccepted: false,
    });

    // 4. (Optional) push answer to question if you're tracking it there
    question.answers.push(answer._id);
    await question.save();

     const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          points: 5, // 🔥 +5 points for answering
          "stats.answers": 1, // 🔥 ADD THIS
        },
      },
      { new: true }
    );

// STEP 6: Update badges
   await syncBadges(userId);

    // 5. Return response
    return res.status(201).json({
      success: true,
      message: "Answer created successfully",
      answer,
    });

  } catch (error) {
    console.log("Error in createAnswer:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getAnswersByQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;

    const answers = await Answer.find({ question: questionId })
      .populate("author", "name profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      answers,
    });

  } catch (error) {
    console.log("Error in getAnswersByQuestion:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const AnswerUpvote = async (req, res) => {
  try {
    const userId = req.user._id;
    const answerId = req.params.id;

    console.log("ANSWER ID:", answerId);

    if (!answerId || answerId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid answer ID",
      });
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    if (!answer.upvotedBy) answer.upvotedBy = [];
    if (!answer.downvotedBy) answer.downvotedBy = [];

    const hasUpvoted = answer.upvotedBy.some(
      (id) => id.toString() === userId.toString()
    );

    const hasDownvoted = answer.downvotedBy.some(
      (id) => id.toString() === userId.toString()
    );

    // =========================
    // REMOVE UPVOTE
    // =========================
    if (hasUpvoted) {
      answer.upvotedBy = answer.upvotedBy.filter(
        (id) => id.toString() !== userId.toString()
      );

      answer.stats.upvotes = Math.max(
        (answer.stats.upvotes || 0) - 1,
        0
      );

      // ❌ remove reward
      await User.findByIdAndUpdate(answer.author, {
        $inc: {
          points: -2,
          "stats.helpfulAnswers": -1,
        },
      });

      await syncBadges(answer.author);
    }

    // =========================
    // ADD UPVOTE
    // =========================
    else {
      answer.upvotedBy.push(userId);

      answer.stats.upvotes = (answer.stats.upvotes || 0) + 1;

      // remove downvote if exists
      if (hasDownvoted) {
        answer.downvotedBy = answer.downvotedBy.filter(
          (id) => id.toString() !== userId.toString()
        );

        answer.stats.downvotes = Math.max(
          (answer.stats.downvotes || 0) - 1,
          0
        );
      }

      // 🎯 REWARD ANSWER AUTHOR
      await User.findByIdAndUpdate(answer.author, {
        $inc: {
          points: 2,
          "stats.helpfulAnswers": 1,
        },
      });

      // 🏆 SYNC BADGES
      await syncBadges(answer.author);
    }

    await answer.save();

    return res.status(200).json({
      success: true,
      message: "Answer upvote updated",
      answer,
    });
  } catch (error) {
    console.log("Error in AnswerUpvote:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const AnswerDownvote = async (req, res) => {
  try {
    const userId = req.user._id;
    const answerId = req.params.id;


if (!answerId) {
  return res.status(400).json({
    success: false,
    message: "Answer ID is required",
  });
}

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    const hasDownvoted = answer.downvotedBy.includes(userId);
    const hasUpvoted = answer.upvotedBy.includes(userId);

    // CASE 1: remove downvote (toggle off)
    if (hasDownvoted) {
      answer.downvotedBy = answer.downvotedBy.filter(
        (id) => id.toString() !== userId.toString()
      );

      answer.stats.downvotes -= 1;
    }

    // CASE 2: add downvote
    else {
      answer.downvotedBy.push(userId);
      answer.stats.downvotes += 1;

      // remove upvote if it exists (switch vote)
      if (hasUpvoted) {
        answer.upvotedBy = answer.upvotedBy.filter(
          (id) => id.toString() !== userId.toString()
        );

        answer.stats.upvotes -= 1;
      }
    }

    await answer.save();

    return res.status(200).json({
      success: true,
      message: "Answer downvote updated successfully",
      stats: answer.stats,
    });

  } catch (error) {
    console.log("Error in AnswerDownvote:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// GET USER ANSWERS
export const getUserAnswers = async (req, res) => {
  try {
    const { userId } = req.params;

    const answers = await Answer.find({ author: userId })
      .populate("question", "title")
      .sort({ createdAt: -1 });

    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

   if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    answer.text = req.body.text || answer.text;

    await answer.save();

    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id);

    if (!answer) {
      return res.status(404).json({ message: "Not found" });
    }

    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await answer.deleteOne();

    res.json({ message: "Answer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
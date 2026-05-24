import { calculateBadges } from "../lib/calculatebadges.js";
import Answer from "../models/Answer.js";
import Place from "../models/Places.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import { syncBadges } from "../utils/syncBadges.js";

export const createQuestion = async (req, res) => {
  try {
    const { question, description, category, place, tags } = req.body;

    const userId = req.user._id;

    if (!question || !category || !place) {
      return res.status(400).json({
        message: "Question, category, and place are required.",
      });
    }

    // STEP 1: Normalize place input
    const placeInput = place.trim().toLowerCase();

    // STEP 2: Find existing place
    let existingPlace = await Place.findOne({
      $or: [
        { slug: placeInput.replace(/\s+/g, "-") },
        { name: new RegExp(`^${placeInput}$`, "i") },
        { aliases: { $in: [new RegExp(`^${placeInput}$`, "i")] } },
      ],
    });

    // STEP 3: Create place if not found
    if (!existingPlace) {
      existingPlace = await Place.create({
        name: place,
        slug: placeInput.replace(/\s+/g, "-"),
        aliases: [place.trim()],
        type: "area",
      });
    }

    // STEP 4: Create question
    const newQuestion = await Question.create({
      author: userId,
      question: question.trim(),
      description: description || "",
      category,
      place: existingPlace._id,
      tags: tags || [],
    });

    // STEP 5: Reward user points
    // ✅ USER STATS UPDATE
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          points: 2, //reward 2 points for asking a question
          "stats.questions": 1, //increment total questions count
        },
      },
      { new: true }
    );

    await syncBadges(userId);

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: newQuestion,
      place: existingPlace,
    });

  } catch (error) {
    console.error("Error in createQuestion:", error);

    return res.status(500).json({
      message: "error in createQuestion function",
    });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate("author", "name profilePic")
      .populate("place", "name slug")
      .populate({
        path: "answers",
        populate: {
          path: "author",
          select: "name profilePic",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      questions,
    });

  } catch (error) {
    console.log("Error in getQuestions controller", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const questionId = req.params.id;

    const question = await Question.findById(questionId)
      .populate("author", "name profilePic")
      .populate("place", "name slug")
      .populate({
        path: "answers",
        populate: {
          path: "author",
          select: "name profilePic",
        },
      });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      question,
    });

  } catch (error) {
    console.log("Error in getQuestionById controller", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const QuestionUpvote = async (req, res) => {
  try {
    const userId = req.user._id;
    const questionId = req.params.id;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const userIdStr = userId.toString();

    // check current state safely
    const hasUpvoted = question.upvotedBy.some(
      (id) => id.toString() === userIdStr
    );

    const hasDownvoted = question.downvotedBy.some(
      (id) => id.toString() === userIdStr
    );

    // ===============================
    // REMOVE UPVOTE (toggle off)
    // ===============================
    if (hasUpvoted) {
      question.upvotedBy = question.upvotedBy.filter(
        (id) => id.toString() !== userIdStr
      );

      question.stats.upvotes = Math.max(0, question.stats.upvotes - 1);
    }

    // ===============================
    // ADD UPVOTE (toggle on)
    // ===============================
    else {
      question.upvotedBy.push(userId);
      question.stats.upvotes += 1;

      // remove downvote if exists
      if (hasDownvoted) {
        question.downvotedBy = question.downvotedBy.filter(
          (id) => id.toString() !== userIdStr
        );

        question.stats.downvotes = Math.max(
          0,
          question.stats.downvotes - 1
        );
      }

      // ===============================
      // IMPORTANT FIX: reward ONLY here
      // ===============================
      await User.findByIdAndUpdate(question.author, {
        $inc: { points: 3 },
      });

      await syncBadges(question.author);
    }

    await question.save();

    return res.status(200).json({
      success: true,
      message: hasUpvoted
        ? "Upvote removed"
        : "Upvoted successfully",
      stats: question.stats,
    });
  } catch (error) {
    console.log("Error in QuestionUpvote:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const QuestionDownvote = async (req, res) => {
  try {
    const userId = req.user._id;
    const questionId = req.params.id;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const hasDownvoted = question.downvotedBy.includes(userId);
    const hasUpvoted = question.upvotedBy.includes(userId);

    // CASE 1: remove downvote (toggle off)
    if (hasDownvoted) {
      question.downvotedBy = question.downvotedBy.filter(
        (id) => id.toString() !== userId.toString()
      );

      question.stats.downvotes -= 1;
    } 
    // CASE 2: add downvote
    else {
      question.downvotedBy.push(userId);
      question.stats.downvotes += 1;

      // remove upvote if exists
      if (hasUpvoted) {
        question.upvotedBy = question.upvotedBy.filter(
          (id) => id.toString() !== userId.toString()
        );

        question.stats.upvotes -= 1;
      }
    }

    await question.save();

    return res.status(200).json({
      success: true,
      message: "Downvote updated successfully",
      stats: question.stats,
    });

  } catch (error) {
    console.log("Error in QuestionDownvote:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const incrementQuestionView = async (req, res) => {
  try {
    const questionId = req.params.id;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    question.stats.views += 1;

    await question.save();

    return res.status(200).json({
      success: true,
      message: "View counted",
    });

  } catch (error) {
    console.log("Error in incrementQuestionView:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const searchPlaces = async (req, res) => {
  try {
    const query = req.query.q;

    const places = await Place.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { aliases: { $regex: query, $options: "i" } },
      ],
    }).limit(5);

    res.status(200).json(places);

  } catch (error) {
    res.status(500).json({
      message: "Error searching places",
    });
  }
};


// GET USER QUESTIONS
export const getUserQuestions = async (req, res) => {
  try {
    const { userId } = req.params;

    const questions = await Question.find({ author: userId })
    .populate("question", "description")
    .sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE QUESTION
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    question.title = req.body.title || question.title;
    question.description = req.body.description || question.description;

    await question.save();

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE QUESTION

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Not found" });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await question.deleteOne();

    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


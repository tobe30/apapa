import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";
import { calculateBadges } from "../lib/calculatebadges.js";

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password")
      .populate({
        path: "savedQuestions",
        select: "question description createdAt stats",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // calculate badges
    const badges = calculateBadges(user.points || 0);

    // convert safely to plain object
    const userObj = user.toObject();

    return res.status(200).json({
      success: true,
      user: {
        ...userObj,
        badges,
      },
    });

  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { name, bio, location } = req.body;
    let profilePic;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

            

if (req.file) {
  // delete old image
  if (user.profilePic) {
    await cloudinary.uploader.destroy(
      user.profilePic.split("/").pop().split(".")[0]
    );
  }

  // upload new image
  const uploadedResponse = await cloudinary.uploader.upload(req.file.path);

  profilePic = uploadedResponse.secure_url;
}

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (profilePic !== undefined) updates.profilePic = profilePic;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error in updateProfile:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const changeUserPassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if(!currentPassword || !newPassword || !confirmPassword){
       return res.status(400).json({message: "All password fields are required"})
    }

    if(newPassword !== confirmPassword){
        return res.status(400).json({message: "New password and confirm password do not match"})
    }

     if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findById(userId).select("+password");// need to select password for comparison
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

     const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);//
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });


  } catch (error) {
      console.log("Error in changeUserPassword controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const toggleSaveQuestion = async (req, res) => {
  try {
    const userId = req.user._id;
    const questionId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isSaved = user.savedQuestions.some(
      (id) => id.toString() === questionId
    );

    if (isSaved) {
      user.savedQuestions = user.savedQuestions.filter(
        (id) => id.toString() !== questionId
      );

      await user.save();

      return res.status(200).json({
        success: true,
        saved: false,
        message: "Question unsaved",
      });
    }

    user.savedQuestions.push(questionId);

    await user.save();

    return res.status(200).json({
      success: true,
      saved: true,
      message: "Question saved",
    });

  } catch (error) {
    console.log("toggleSaveQuestion error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getSavedQuestions = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({
      path: "savedQuestions",
      model: "Question",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedQuestions = user.savedQuestions.map((q) => ({
      _id: q._id,
      question: q.question,
      description: q.description,
      stats: q.stats,
      createdAt: q.createdAt,
    }));

    return res.status(200).json({
      success: true,
      savedQuestions,
    });

  } catch (error) {
    console.error("Error fetching saved questions:", error);
    return res.status(500).json({ message: error.message });
  }
};
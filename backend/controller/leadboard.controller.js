import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .select("name profilePic points badges")
      .sort({ points: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      leaderboard: users,
    });

  } catch (error) {
    console.log("Error in getLeaderboard:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




// const updatedUser = await User.findById(userId);

// updatedUser.badges = calculateBadges(updatedUser.points);

// await updatedUser.save();

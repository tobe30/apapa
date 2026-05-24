import { calculateBadges } from "../lib/calculatebadges.js";
import User from "../models/User.js";

export const syncBadges = async (userId) => {
  const user = await User.findById(userId);

  if (!user) return;

  user.badges = calculateBadges(user.points);

  await user.save();

  return user.badges;
};
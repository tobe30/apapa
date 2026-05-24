///// Utility function to calculate badges based on points
export const calculateBadges = (points) => {
  const badges = [];

  if (points >= 50) {
  badges.push("Rising Contributor");
}

if (points >= 100) {
  badges.push("Active Contributor");
}

if (points >= 300) {
  badges.push("Top Contributor");
}
  return badges;
};
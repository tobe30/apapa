import Answer from "../models/Answer.js";

export const updateTopAnswer = async (questionId) => {
  const answers = await Answer.find({ question: questionId });

  if (!answers.length) return;

  const topAnswer = answers.reduce((max, curr) =>
    curr.stats.upvotes > max.stats.upvotes ? curr : max
  );// Find the answer with the highest upvotes

  await Answer.updateMany(
    { question: questionId },
    { isTop: false }
  );

  await Answer.findByIdAndUpdate(topAnswer._id, {
    isTop: true,
  });
};
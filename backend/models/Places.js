import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    aliases: [
      {
        type: String,
        trim: true,
      },
    ],

    type: {
      type: String,
      enum: ["school", "area", "city", "landmark", "other"],
      default: "area",
    },
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", placeSchema);

export default Place;

// {
//   _id: "p1",
//   name: "Alex Ekwueme Federal University",
//   slug: "funai",
//   aliases: ["FUNAI", "Alex", "AE-FUNAI"],
//   type: "school"
// }
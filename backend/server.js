import express from "express";
import "dotenv/config";
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import questionRoutes from "./routes/question.routes.js";
import answerRoutes from "./routes/answer.routes.js";
import leadboardRoutes from "./routes/leadboard.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectCloudinary from "./lib/cloudinary.js";


const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://apapa-six.vercel.app"
  ],
  credentials: true,
}))


app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes)
app.use("/api/answers", answerRoutes)
app.use("/api/leadboard", leadboardRoutes)


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();


    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
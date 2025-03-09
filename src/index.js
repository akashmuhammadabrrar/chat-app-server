import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Added a fallback PORT

// ✅ Increase Payload Size Limit BEFORE express.json()
app.use(express.json({ limit: "50mb" })); // Increase to 50MB or adjust as needed
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());

// ✅ Corrected CORS configuration
const allowedOrigins = ["http://localhost:5173", "http://localhost:5175"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// auth api-route
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

// root routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Ensure database connection before starting the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit process with failure
  }
};

startServer();

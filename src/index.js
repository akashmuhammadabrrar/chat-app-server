import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./lib/socket.js"; // ✅ Import app and server

dotenv.config();

const PORT = process.env.PORT || 5001; // ✅ Added fallback port

// ✅ Middleware Configuration
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

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

// ✅ Define API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Start Server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
    process.exit(1);
  }
};

startServer();

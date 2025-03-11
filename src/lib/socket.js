import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Create the socket.io instance
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//  Use an object to store online users
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Get the userId from the handshake query
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id; // ✅ Corrected assignment
  }

  // Send the updated list of online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    // Remove the user from the online list
    if (userId) {
      delete userSocketMap[userId]; // ✅ Corrected delete operation
    }

    // Notify all users about the updated online list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };

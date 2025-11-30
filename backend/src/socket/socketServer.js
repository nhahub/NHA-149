/**
 * Socket.io server for WebRTC signaling and real-time evaluation updates
 */

import { Server } from "socket.io";
import jwt from "jsonwebtoken";

/**
 * Initialize Socket.io server
 * @param {import('http').Server} server - HTTP server instance
 * @returns {Server} Socket.io server instance
 */
export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
        : ["http://localhost:5173"],
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  // Socket.io middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.userName = decoded.name;
      next();
    } catch (err) {
      console.error("Socket authentication error:", err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.userName})`);

    // Join session room
    socket.on("join-session", async ({ sessionId }) => {
      try {
        const roomName = `session-${sessionId}`;
        await socket.join(roomName);
        socket.sessionId = sessionId;

        console.log(
          `👤 User ${socket.userId} joined session ${sessionId}`
        );

        // Notify others in the session
        socket.to(roomName).emit("user-joined", {
          userId: socket.userId,
          userRole: socket.userRole,
          userName: socket.userName,
        });

        // Send confirmation to the user
        socket.emit("session-joined", {
          sessionId,
          roomName,
        });
      } catch (error) {
        console.error("Error joining session:", error);
        socket.emit("error", { message: "Failed to join session" });
      }
    });

    // WebRTC Signaling: Offer
    socket.on("offer", ({ sessionId, offer, fromUserId }) => {
      const roomName = `session-${sessionId}`;
      console.log(`📤 Offer from ${fromUserId} in session ${sessionId}`);
      socket.to(roomName).emit("offer", {
        offer,
        fromUserId,
      });
    });

    // WebRTC Signaling: Answer
    socket.on("answer", ({ sessionId, answer, fromUserId }) => {
      const roomName = `session-${sessionId}`;
      console.log(`📥 Answer from ${fromUserId} in session ${sessionId}`);
      socket.to(roomName).emit("answer", {
        answer,
        fromUserId,
      });
    });

    // WebRTC Signaling: ICE Candidate
    socket.on("ice-candidate", ({ sessionId, candidate, fromUserId }) => {
      const roomName = `session-${sessionId}`;
      socket.to(roomName).emit("ice-candidate", {
        candidate,
        fromUserId,
      });
    });

    // Real-time evaluation updates
    socket.on("evaluation-update", ({ sessionId, evaluationData }) => {
      const roomName = `session-${sessionId}`;
      socket.to(roomName).emit("evaluation-update", {
        evaluationData,
        updatedBy: socket.userId,
        updatedByRole: socket.userRole,
      });
    });

    // Leave session
    socket.on("leave-session", ({ sessionId }) => {
      const roomName = `session-${sessionId}`;
      socket.to(roomName).emit("user-left", {
        userId: socket.userId,
        userName: socket.userName,
      });
      socket.leave(roomName);
      socket.sessionId = null;
      console.log(`👋 User ${socket.userId} left session ${sessionId}`);
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      if (socket.sessionId) {
        const roomName = `session-${socket.sessionId}`;
        socket.to(roomName).emit("user-left", {
          userId: socket.userId,
          userName: socket.userName,
        });
      }
      console.log(
        `❌ User disconnected: ${socket.userId} (${socket.userName}) - Reason: ${reason}`
      );
    });

    // Error handling
    socket.on("error", (error) => {
      console.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  return io;
}



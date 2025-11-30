import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createServer } from "http";

// Import database connection
import connectDB from "./src/DB/connection.js";

// Import app controller (all routes)
import appController from "./src/app.controller.js";

// Import error handlers
import { notFound } from "./src/middleware/index.js";
import { globalErrorHandling } from "./src/utils/response.js";

// Import Socket.io server
import { initializeSocket } from "./src/socket/socketServer.js";

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting - more lenient in development
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // increased to 1000
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  // Skip rate limiting in development if needed
  skip: (req) =>
    (process.env.NODE_ENV === "development" && req.ip === "::1") ||
    req.ip === "127.0.0.1",
});

// CORS middleware - must be before rate limiter
// Support multiple origins for production and development
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) =>
      url.trim().replace(/\/$/, "")
    )
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Normalize origin (remove trailing slash)
      const normalizedOrigin = origin.replace(/\/$/, "");

      // Check if origin is in allowed list
      const isAllowed = allowedOrigins.some((allowed) => {
        const normalizedAllowed = allowed.replace(/\/$/, "");
        return (
          normalizedOrigin === normalizedAllowed ||
          normalizedOrigin.startsWith(normalizedAllowed)
        );
      });

      if (isAllowed || process.env.NODE_ENV === "development") {
        callback(null, true);
      } else {
        console.error(
          `CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(
            ", "
          )}`
        );
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect to MongoDB (only for non-serverless environments)
// In Vercel serverless, connection is handled in api/index.js
if (process.env.VERCEL !== "1" && !process.env.VERCEL_ENV) {
  connectDB();
}

// Use app controller for all routes
app.use("/", appController);

// Error handling middleware
app.use(notFound);
app.use(globalErrorHandling);

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io (only in non-serverless environments)
let io = null;
if (process.env.VERCEL !== "1" && !process.env.VERCEL_ENV) {
  io = initializeSocket(server);
}

// Only start server if not in Vercel serverless environment
// Vercel will use the api/index.js entry point instead
if (process.env.VERCEL !== "1" && !process.env.VERCEL_ENV) {
  const PORT = process.env.PORT || 5000;
  const HOST = process.env.HOST || "localhost";

  server.listen(PORT, () => {
    console.log(`🚀 Taqyeem API server running`);
    console.log(`🌐 URL: http://${HOST}:${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`⚡ Ready to accept requests!`);
    console.log(`🔌 Socket.io ready for WebRTC signaling`);
  });
}

export default app;

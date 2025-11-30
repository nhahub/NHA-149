// Vercel serverless function entry point
import app from "../index.js";
import connectDB from "../src/DB/connection.js";

// Connect to database when function is invoked
// Connection is cached for subsequent invocations
let dbConnectionPromise = null;

// Ensure database is connected before handling requests
const ensureDB = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB().catch((error) => {
      console.error("Failed to connect to database:", error);
      dbConnectionPromise = null; // Reset on error to allow retry
      throw error;
    });
  }
  return dbConnectionPromise;
};

// Wrap the app to ensure DB connection before handling requests
const handler = async (req, res) => {
  try {
    // Ensure database is connected before processing request
    await ensureDB();
    // Pass request to Express app
    return app(req, res);
  } catch (error) {
    console.error("Database connection error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Database connection failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
};

export default handler;

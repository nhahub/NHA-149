import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanupSlotIndexes() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    const db = mongoose.connection.db;
    const slotsCollection = db.collection("slots");

    console.log("\n=== Dropping Old Slot Indexes ===");

    const oldIndexes = [
      "dayId_1",
      "interviewerId_1_dayId_1_startTime_1",
      "dayId_1_status_1",
    ];

    for (const indexName of oldIndexes) {
      try {
        await slotsCollection.dropIndex(indexName);
        console.log(`✓ Dropped index: ${indexName}`);
      } catch (err) {
        console.log(`- Index ${indexName} not found or already dropped`);
      }
    }

    // Show final indexes
    console.log("\n=== Final Slot Indexes ===");
    const finalSlotIndexes = await slotsCollection.indexes();
    finalSlotIndexes.forEach((idx) => {
      console.log(`- ${idx.name}:`, JSON.stringify(idx.key));
    });

    console.log("\n✅ Cleanup completed successfully!");
  } catch (error) {
    console.error("\n❌ Cleanup failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

cleanupSlotIndexes();

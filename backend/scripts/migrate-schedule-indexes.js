import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function migrateIndexes() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    const db = mongoose.connection.db;
    const schedulesCollection = db.collection("schedules");
    const slotsCollection = db.collection("slots");

    // Get existing indexes
    console.log("\n=== Current Schedule Indexes ===");
    const scheduleIndexes = await schedulesCollection.indexes();
    scheduleIndexes.forEach((idx) => {
      console.log(`- ${idx.name}:`, JSON.stringify(idx.key));
    });

    console.log("\n=== Current Slot Indexes ===");
    const slotIndexes = await slotsCollection.indexes();
    slotIndexes.forEach((idx) => {
      console.log(`- ${idx.name}:`, JSON.stringify(idx.key));
    });

    // Drop old indexes from schedules collection
    console.log("\n=== Dropping Old Schedule Indexes ===");
    try {
      await schedulesCollection.dropIndex("dayId_1");
      console.log("✓ Dropped index: dayId_1");
    } catch (err) {
      console.log("- Index dayId_1 not found or already dropped");
    }

    try {
      await schedulesCollection.dropIndex("interviewerId_1_dayId_1");
      console.log("✓ Dropped index: interviewerId_1_dayId_1");
    } catch (err) {
      console.log(
        "- Index interviewerId_1_dayId_1 not found or already dropped"
      );
    }

    // Drop old indexes from slots collection
    console.log("\n=== Dropping Old Slot Indexes ===");
    try {
      await slotsCollection.dropIndex("dayId_1");
      console.log("✓ Dropped index: dayId_1");
    } catch (err) {
      console.log("- Index dayId_1 not found or already dropped");
    }

    try {
      await slotsCollection.dropIndex("dayId_1_interviewerId_1");
      console.log("✓ Dropped index: dayId_1_interviewerId_1");
    } catch (err) {
      console.log(
        "- Index dayId_1_interviewerId_1 not found or already dropped"
      );
    }

    // Create new indexes for schedules
    console.log("\n=== Creating New Schedule Indexes ===");
    await schedulesCollection.createIndex({ date: 1 });
    console.log("✓ Created index: date_1");

    await schedulesCollection.createIndex(
      { interviewerId: 1, date: 1 },
      { unique: true }
    );
    console.log("✓ Created unique index: interviewerId_1_date_1");

    // Create new indexes for slots
    console.log("\n=== Creating New Slot Indexes ===");
    await slotsCollection.createIndex({ date: 1 });
    console.log("✓ Created index: date_1");

    await slotsCollection.createIndex({ scheduleId: 1 });
    console.log("✓ Created index: scheduleId_1");

    await slotsCollection.createIndex({ scheduleId: 1, date: 1 });
    console.log("✓ Created index: scheduleId_1_date_1");

    // Show final indexes
    console.log("\n=== Final Schedule Indexes ===");
    const finalScheduleIndexes = await schedulesCollection.indexes();
    finalScheduleIndexes.forEach((idx) => {
      console.log(`- ${idx.name}:`, JSON.stringify(idx.key));
    });

    console.log("\n=== Final Slot Indexes ===");
    const finalSlotIndexes = await slotsCollection.indexes();
    finalSlotIndexes.forEach((idx) => {
      console.log(`- ${idx.name}:`, JSON.stringify(idx.key));
    });

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

migrateIndexes();

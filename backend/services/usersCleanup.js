import { createClerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/user.model.js";
import cron from "node-cron";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Weekly cleanup (Sunday 3 AM)
cron.schedule("0 3 * * 0", async () => {
  console.log("🔄 Starting weekly user cleanup...");

  try {
    const expiredUsers = await User.find({
      expiresAt: { $lte: new Date() },
      isAdmin: false,
    });

    console.log(`🔍 Found ${expiredUsers.length} expired users`);

    for (const user of expiredUsers) {
      try {
        await clerkClient.users.deleteUser(user.clerkUserId);
        await User.deleteOne({ _id: user._id });
        console.log(`✅ Deleted ${user.email}`);
      } catch (err) {
        console.error(`❌ Failed to delete ${user.email}:`, err.message);
      }
    }
  } catch (error) {
    console.error("💥 Cleanup job crashed:", error);
  }
});

// Optional: Log when initialized
console.log("🟢 Weekly user cleanup job scheduled");

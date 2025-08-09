// controllers/webhook.controller.js
import { Webhook } from "svix";
import User from "../models/user.model.js";

export const clerkWebHook = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("Webhook secret needed!");
    }

    // Get raw body and required headers
    const payload = JSON.stringify(req.body);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
      evt = wh.verify(payload, headers);
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return res.status(400).json({ message: "Verification failed" });
    }

    if (evt.type === "user.created") {
      // Safely extract email
      const primaryEmail =
        evt.data.email_addresses?.find(
          (email) => email.id === evt.data.primary_email_address_id
        ) || evt.data.email_addresses?.[0];

      if (!primaryEmail) {
        throw new Error("No email address found for user");
      }

      // Check if user is admin
      const isAdmin = evt.data.public_metadata?.role === "admin";

      const newUser = new User({
        clerkUserId: evt.data.id,
        username: evt.data.username || primaryEmail.email_address.split("@")[0],
        email: primaryEmail.email_address,
        img: evt.data.image_url || "",
        isAdmin,
        expiresAt: isAdmin ? null : new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day for non-admins
      });

      await newUser.save();
      console.log(
        `Created ${isAdmin ? "admin" : "regular"} user ${newUser.username}`
      );
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

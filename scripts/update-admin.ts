import dotenv from "dotenv";
dotenv.config();

import { db } from "../src/db";
import { admins } from "../src/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function run() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env first.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db
    .update(admins)
    .set({ email, passwordHash })
    .where(eq(admins.email, "admin@daudfabrics.pk"))
    .returning();

  console.log("Updated admin:", result);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
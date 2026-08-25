import dotenv from "dotenv";
dotenv.config();

import { seedDatabase } from "../src/db/seed";

async function run() {
  console.log("Starting seed run...");
  await seedDatabase();
  console.log("Seed run completed.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed script error:", err);
  process.exit(1);
});

import { seedDatabase } from "@/db/seed";

let isSeeding = false;
let hasSeeded = false;

export async function ensureDatabaseSeeded() {
  if (hasSeeded || isSeeding) return;
  isSeeding = true;
  try {
    await seedDatabase();
    hasSeeded = true;
  } catch (error) {
    console.error("Error during auto-seed:", error);
  } finally {
    isSeeding = false;
  }
}

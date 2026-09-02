import { db } from "@/db/index";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

async function fixKids() {
  await db.update(products)
    .set({ images: JSON.stringify(["/images/women/image9.jpg", "/images/women/image12.jpg"]) })
    .where(eq(products.slug, "boys-classic-pure-cotton-kurta-fabric"));

  await db.update(products)
    .set({ images: JSON.stringify(["/images/women/image13.jpg", "/images/women/image14.jpg"]) })
    .where(eq(products.slug, "festive-embroidered-boys-kurta-fabric"));

  await db.update(products)
    .set({ images: JSON.stringify(["/images/women/image10.jpg", "/images/women/image11.jpg"]) })
    .where(eq(products.slug, "girls-printed-lawn-festive-2-piece"));

  console.log("Kids images updated in DB successfully!");
  process.exit(0);
}

fixKids().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});

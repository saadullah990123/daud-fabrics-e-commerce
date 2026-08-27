import { db } from "./index";
import { products, admins, storeSettings, reviews } from "./schema";
import bcrypt from "bcryptjs";
import { count } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Check if products already exist
    const [{ value: productCount }] = await db.select({ value: count() }).from(products);
 
   // Seed Admin if not exists
const [{ value: adminCount }] = await db.select({ value: count() }).from(admins);
if (Number(adminCount) === 0) {
  const seedEmail = process.env.SEED_ADMIN_EMAIL;
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!seedEmail || !seedPassword) {
    throw new Error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env to seed the admin account."
    );
  }
  const passwordHash = await bcrypt.hash(seedPassword, 10);
  await db.insert(admins).values({
    email: seedEmail,
    passwordHash,
    name: "Daud Ahmed (Admin)",
    role: "admin",
  });
  console.log(`Seed: Admin account created (${seedEmail})`);
}

    // Seed Store Settings if not exists
    const [{ value: settingsCount }] = await db.select({ value: count() }).from(storeSettings);
    if (Number(settingsCount) === 0) {
      await db.insert(storeSettings).values([
        { key: "easypaisa_title", value: "Daud Fabrics / Daud Ahmed" },
        { key: "easypaisa_number", value: "0300-1234567" },
        { key: "easypaisa_instructions", value: "Send payment to the EasyPaisa number above, then upload a screenshot of the transaction receipt below." },
        { key: "meezan_bank_title", value: "Daud Fabrics Pvt Ltd" },
        { key: "meezan_bank_account", value: "0289-0105829101" },
        { key: "meezan_bank_iban", value: "PK65MEZN0002890105829101" },
        { key: "meezan_bank_branch", value: "Gulberg III Main Branch, Lahore" },
        { key: "meezan_bank_instructions", value: "Transfer the order total to our Meezan Bank account via Raast or Online Banking. Upload your transfer receipt/screenshot proof below." },
        { key: "store_phone", value: "+92 300 1234567" },
        { key: "store_whatsapp", value: "923001234567" },
        { key: "store_email", value: "sales@daudfabrics.pk" },
        { key: "store_address", value: "Shop # 14-18, Daud Fabrics Arcade, Main Liberty Market, Gulberg III, Lahore" },
        { key: "free_shipping_threshold", value: "3000" },
        { key: "standard_shipping_fee", value: "250" },
        { key: "announcement_messages", value: JSON.stringify([
          "✨ FREE Shipping Across Pakistan on Orders Above Rs 3,000",
          "🇵🇰 Premium Authentic Pakistani Fabrics — 100% Original Guarantee",
          "🔥 New Festive Luxury Lawn & Boski Collection Live",
          "⚡ Cash on Delivery (COD) & EasyPaisa / Meezan Bank Available"
        ])},
      ]);
      console.log("Seed: Store settings initialized");
    }

    // Seed Reviews if not exists
    const [{ value: reviewCount }] = await db.select({ value: count() }).from(reviews);
    if (Number(reviewCount) === 0) {
      await db.insert(reviews).values([
        {
          customerName: "Mian Hamza Tariq",
          city: "Lahore",
          rating: 5,
          comment: "Sublime quality! The Egyptian Cotton Latha has that crisp, royal fall. Received parcel in Gulberg within 24 hours. Truly authentic Pakistani craftsmanship.",
          productName: "Royal Egyptian Cotton Latha — Unstitched 4.5m",
          verified: true,
        },
        {
          customerName: "Dr. Ayesha Siddiqui",
          city: "Karachi (Clifton)",
          rating: 5,
          comment: "The Embroidered Luxury Lawn 3-piece is breathtaking. The colors did not bleed, fabric is buttery soft for Karachi summers, and the chiffon dupatta is featherlight.",
          productName: "Luxury Embroidered Lawn 3-Piece Suit",
          verified: true,
        },
        {
          customerName: "Chaudhry Usman",
          city: "Islamabad",
          rating: 5,
          comment: "I have ordered Boski and Wash & Wear suits twice now from Daud Fabrics. Best unstitched fabric in Pakistan at very reasonable pricing.",
          productName: "Classic Superfine Boski Silk Suit",
          verified: true,
        },
        {
          customerName: "Zainab Farooq",
          city: "Faisalabad",
          rating: 5,
          comment: "Living in the textile hub Faisalabad, I am very picky with fabrics. Daud Fabrics exceeded my expectations. Outstanding thread count and fast delivery!",
          productName: "Pure Silk Jacquard Unstitched 3-Piece",
          verified: true,
        },
        {
          customerName: "Taimoor Ali Khan",
          city: "Peshawar",
          rating: 5,
          comment: "EasyPaisa payment verification was super quick. Got tracking number from Trax/TCS on WhatsApp. Suit looks majestic for Friday prayers.",
          productName: "Executive Wash & Wear Wrinkle-Free Suit",
          verified: true,
        },
      ]);
      console.log("Seed: Customer reviews initialized");
    }

    // Seed Products if none exist
    if (Number(productCount) === 0) {
      await db.insert(products).values([
        // MEN'S PRODUCTS
        {
          name: "Royal Egyptian Cotton Latha — Unstitched 4.5m",
          slug: "royal-egyptian-cotton-latha-unstitched",
          category: "men",
          subcategory: "Unstitched Cotton",
          price: 4250,
          salePrice: 3650,
          description: "Premium high thread-count combed Egyptian Giza cotton with crisp fall, natural luster, and ultra-breathable weave for formal and daily wear.",
          details: "Fabric: 100% Long Staple Combed Egyptian Cotton\nCutting: 4.5 Meters Standard Suit\nWidth: 54 Inches (Bara Arz)\nFinish: Royal Crisp Fall / Soft Touch\nSeason: Spring / Summer / Midsummer\nIncludes: Signature Daud Fabrics Gold Embossed Buttons & Brand Bag",
          stock: 45,
          images: JSON.stringify([
            "https://images.pexels.com/photos/8565662/pexels-photo-8565662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/17325397/pexels-photo-17325397.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/4862911/pexels-photo-4862911.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: true,
          isBestseller: true,
        },
        {
          name: "Classic Superfine Boski Silk Suit — 7.5m Fall Finish",
          slug: "classic-superfine-boski-silk-suit",
          category: "men",
          subcategory: "Pure Boski",
          price: 6800,
          salePrice: 5750,
          description: "Timeless traditional Boski spun silk suit with signature liquid drape, graceful sheen, and unparalleled comfort for festive occasions and Eid.",
          details: "Fabric: Premium Spun Boski Silk (Heavy Weight 10 Paund)\nCutting: 7.5 Meters Boski Length\nWidth: 36 Inches\nFeel: Silky Soft Drape with Subtle Shimmer\nOccasion: Festive, Weddings & Jummah\nPackaging: Luxury Daud Fabrics Hard Gift Box with Metallic Seal",
          stock: 28,
          images: JSON.stringify([
            "https://images.pexels.com/photos/8692305/pexels-photo-8692305.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/17325397/pexels-photo-17325397.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: true,
          isBestseller: true,
        },
        {
          name: "Executive Wash & Wear Wrinkle-Free Suit — Navy Blue",
          slug: "executive-wash-and-wear-navy-blue",
          category: "men",
          subcategory: "Wash & Wear",
          price: 3450,
          salePrice: 2890,
          description: "Engineered micro-fiber blend with anti-crease technology, zero ironing hassle, and featherlight feel for long office days and traveling.",
          details: "Fabric: Micro-Poly Viscose Luxury Blend\nCutting: 4.25 Meters\nWidth: 54 Inches\nProperties: Wrinkle-Resistant, Color-Fast, Easy Machine Wash\nSeason: All Seasons (4-Season Wear)",
          stock: 60,
          images: JSON.stringify([
            "https://images.pexels.com/photos/8692657/pexels-photo-8692657.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/4862913/pexels-photo-4862913.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: false,
          isBestseller: true,
        },
        {
          name: "Pure Karandi Textured Fabric Suit — Charcoal Grey",
          slug: "pure-karandi-textured-charcoal-grey",
          category: "men",
          subcategory: "Karandi",
          price: 4950,
          salePrice: 4200,
          description: "Traditional hand-feel Karandi weave with organic slub texture, rich depth of tone, and sturdy yet breathable structure.",
          details: "Fabric: 100% Pure Combed Karandi Yarn\nCutting: 4.5 Meters Unstitched Suit\nWidth: 54 Inches\nTexture: Textured Slub Handloom Feel\nSeason: Midsummer & Autumn/Winter",
          stock: 32,
          images: JSON.stringify([
            "https://images.pexels.com/photos/8621669/pexels-photo-8621669.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/4862911/pexels-photo-4862911.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: true,
          isBestseller: false,
        },
        {
          name: "Embroidered Festive Kurta Fabric — Pearl White",
          slug: "embroidered-festive-kurta-pearl-white",
          category: "men",
          subcategory: "Kurta Fabric",
          price: 2950,
          salePrice: null,
          description: "Subtle tone-on-tone embroidered neck and cuff motifs on fine Egyptian cotton, ready for custom tailoring into a statement kurta.",
          details: "Fabric: Premium Cotton Voile with Self Resham Embroidery\nCutting: 2.5 Meters Kurta Fabric\nWidth: 54 Inches\nDetails: Includes Embroidered Patti for Collar & Placket",
          stock: 40,
          images: JSON.stringify([
            "https://images.pexels.com/photos/8588636/pexels-photo-8588636.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/17325397/pexels-photo-17325397.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: false,
          isBestseller: false,
        },

        // WOMEN'S PRODUCTS
        {
          name: "Luxury Embroidered Lawn 3-Piece Suit (Chiffon Dupatta)",
          slug: "luxury-embroidered-lawn-3-piece-chiffon",
          category: "women",
          subcategory: "3-Piece Lawn",
          price: 5850,
          salePrice: 4850,
          description: "Exquisite Pakistani designer unstitched 3-piece suit featuring high-density digital lawn shirt, heavily embroidered organza neckline, pure chiffon dupatta, and dyed cambric trouser.",
          details: "Shirt: 3.0 Meters Digital Printed Swiss Lawn with Embroidered Neck Patch\nDupatta: 2.5 Meters Pure Bamburg Chiffon with Four-Sided Borders\nTrouser: 2.5 Meters Dyed Cambric Cotton\nSeason: Spring / Summer Festive\nCare: Hand wash or dry clean recommended",
          stock: 35,
          images: JSON.stringify([
            "https://images.pexels.com/photos/36567522/pexels-photo-36567522.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/36090373/pexels-photo-36090373.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/19191099/pexels-photo-19191099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: true,
          isBestseller: true,
        },
        {
          name: "Pure Silk Jacquard Festive 3-Piece Collection",
          slug: "pure-silk-jacquard-festive-3-piece",
          category: "women",
          subcategory: "Silk Jacquard",
          price: 7450,
          salePrice: 6250,
          description: "Opulent pure silk jacquard weave with shimmering gold and copper zari work. Paired with a delicate organza jacquard dupatta and matching silk trouser.",
          details: "Shirt: 3.15 Meters Pure Jacquard Silk with Gold Zari Motif\nDupatta: 2.5 Meters Woven Jacquard Organza with Tassels\nTrouser: 2.5 Meters Dyed Pure Raw Silk\nOccasion: Weddings, Festive Dinners, Formal Gatherings",
          stock: 22,
          images: JSON.stringify([
            "https://images.pexels.com/photos/34688061/pexels-photo-34688061.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/20841148/pexels-photo-20841148.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: true,
          isBestseller: true,
        },
        {
          name: "Handcrafted Chikan Kari Pure Cotton 2-Piece",
          slug: "handcrafted-chikan-kari-cotton-2-piece",
          category: "women",
          subcategory: "Chikan Kari",
          price: 4600,
          salePrice: 3890,
          description: "Authentic Chikan Kari thread embroidery on breathable pure lawn voile with scalloped daman and sleeves. Classic Eastern elegance.",
          details: "Shirt: 3.0 Meters Heavy Embroidered Chikan Kari Voile\nTrouser: 2.5 Meters Pure Cotton Cambric with Embroidered Daman Patch\nSeason: Summer Everyday & Casual Gatherings\nColor Fastness: 100% Guaranteed",
          stock: 30,
          images: JSON.stringify([
            "https://images.pexels.com/photos/29460604/pexels-photo-29460604.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/19248200/pexels-photo-19248200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: false,
          isBestseller: true,
        },
        {
          name: "Festive Embroidered Organza 3-Piece Formal Suit — Royal Emerald",
          slug: "festive-organza-embroidered-3-piece-royal-emerald",
          category: "women",
          subcategory: "Organza Formal",
          price: 8900,
          salePrice: 7500,
          description: "Breathtaking emerald green organza adorned with hand-embellished sequins, tilla work, and pearls. Includes raw silk inner slip and embroidered dupatta.",
          details: "Shirt: 3.25 Meters Embroidered Organza with Hand-Work Sequins & Pearls\nInner Slip: 2.5 Meters Dyed Grip Silk\nDupatta: 2.5 Meters Embroidered Organza with Cutwork Borders\nTrouser: 2.5 Meters Pure Raw Silk",
          stock: 18,
          images: JSON.stringify([
            "https://images.pexels.com/photos/20841148/pexels-photo-20841148.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/36567522/pexels-photo-36567522.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: true,
          isBestseller: false,
        },
        {
          name: "Digital Printed Swiss Voile Summer 3-Piece",
          slug: "digital-printed-swiss-voile-summer-3-piece",
          category: "women",
          subcategory: "Swiss Voile",
          price: 3950,
          salePrice: 3250,
          description: "Featherlight Swiss voile fabric featuring modern abstract Kashmiri florals, matched with a soft voile dupatta and dyed trousers.",
          details: "Shirt: 3.0 Meters Premium Swiss Voile\nDupatta: 2.5 Meters Soft Swiss Voile\nTrouser: 2.5 Meters Cambric Cotton\nFeel: Ultra-soft, cool against summer heat",
          stock: 45,
          images: JSON.stringify([
            "https://images.pexels.com/photos/19248200/pexels-photo-19248200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/19191099/pexels-photo-19191099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: false,
          isBestseller: true,
        },

        // KIDS' PRODUCTS
        {
          name: "Boys Classic Pure Cotton Kurta Fabric (Ages 4-12)",
          slug: "boys-classic-pure-cotton-kurta-fabric",
          category: "kids",
          subcategory: "Boys Kurta",
          price: 1950,
          salePrice: 1550,
          description: "Hypoallergenic, ultra-soft 100% combed Pakistani cotton fabric specially woven for kids. Gentle on skin with vibrant festive tones.",
          details: "Fabric: 100% Combed Baby Cotton\nCutting: 2.25 Meters (Sufficient for Kurta Shalwar up to Age 12)\nWidth: 40 Inches\nFeatures: Breathable, anti-chafing, color-fast guarantee",
          stock: 35,
          images: JSON.stringify([
            "https://images.pexels.com/photos/17015449/pexels-photo-17015449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/37982534/pexels-photo-37982534.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: true,
          isBestseller: true,
        },
        {
          name: "Festive Embroidered Boys Kurta Set Fabric — Royal Gold",
          slug: "festive-embroidered-boys-kurta-fabric",
          category: "kids",
          subcategory: "Boys Festive",
          price: 2450,
          salePrice: 1990,
          description: "Includes delicate machine resham embroidery on collar and cuff patches with premium wash-and-wear base fabric.",
          details: "Fabric: Wash & Wear with embroidered neckline motif\nCutting: 2.5 Meters\nWidth: 40 Inches\nIdeal for: Eid, Weddings & School Traditional Day events",
          stock: 25,
          images: JSON.stringify([
            "https://images.pexels.com/photos/37982534/pexels-photo-37982534.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/17015449/pexels-photo-17015449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: true,
          isBestseller: false,
        },
        {
          name: "Girls Printed Lawn Festive 2-Piece Fabric Set",
          slug: "girls-printed-lawn-festive-2-piece",
          category: "kids",
          subcategory: "Girls Lawn",
          price: 2200,
          salePrice: 1750,
          description: "Colorful pastel floral printed Pakistani lawn fabric with matching chiffon dupatta for young girls (Ages 5-13).",
          details: "Shirt: 2.25 Meters Digital Printed Soft Lawn\nDupatta: 2.0 Meters Soft Feather Chiffon\nComfort: Non-irritating, easy to wash, bright lasting colors",
          stock: 30,
          images: JSON.stringify([
            "https://images.pexels.com/photos/36090373/pexels-photo-36090373.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
            "https://images.pexels.com/photos/19191099/pexels-photo-19191099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          ]),
          isActive: true,
          isFeatured: false,
          isBestseller: true,
        },
      ]);
      console.log("Seed: Products initialized with 13 rich Pakistani fabric items");
    }

    console.log("Seed: Database seeding completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
  }
}

import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // 'men', 'women', 'kids'
  subcategory: text("subcategory"), // e.g. 'Unstitched Suit', 'Cotton Latha', '3-Piece Lawn', 'Wash & Wear'
  price: integer("price").notNull(), // in PKR
  salePrice: integer("sale_price"), // in PKR (optional)
  description: text("description").notNull(), // Quality/fabric description
  details: text("details"), // Fabric specifications, length, width, care instructions
  stock: integer("stock").notNull().default(10),
  images: text("images").notNull(), // JSON array of string URLs
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  isBestseller: boolean("is_bestseller").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  deliveryAddress: text("delivery_address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code"),
  orderNotes: text("order_notes"),
  items: text("items").notNull(), // JSON array of order items
  subtotal: integer("subtotal").notNull(),
  shippingFee: integer("shipping_fee").notNull().default(0),
  discount: integer("discount").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  paymentMethod: text("payment_method").notNull(), // 'cod', 'easypaisa', 'meezan_bank'
  paymentStatus: text("payment_status").notNull().default("Pending"), // 'Pending', 'Paid', 'Cancelled', 'Refunded'
  orderStatus: text("order_status").notNull().default("Pending"), // 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  paymentScreenshot: text("payment_screenshot"), // Data URL or storage URL
  trackingNumber: text("tracking_number"),
  courierName: text("courier_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  city: text("city").notNull(),
  rating: integer("rating").notNull().default(5),
  comment: text("comment").notNull(),
  productName: text("product_name"),
  verified: boolean("verified").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

export type StoreSetting = typeof storeSettings.$inferSelect;
export type Review = typeof reviews.$inferSelect;

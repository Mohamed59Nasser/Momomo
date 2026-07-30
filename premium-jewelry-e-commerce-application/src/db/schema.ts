import { pgTable, serial, text, integer, timestamp, boolean, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }), // Nullable for Google auth
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  locationCoords: varchar("location_coords", { length: 255 }),
  isVerified: boolean("is_verified").default(false).notNull(),
  role: varchar("role", { length: 50 }).default("user").notNull(), // 'user' or 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }).notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  imageUrl: text("image_url").notNull(),
  imageScale: integer("image_scale").default(100).notNull(), // drag-to-resize scale (percentage)
  categoryEn: varchar("category_en", { length: 255 }).notNull(),
  categoryAr: varchar("category_ar", { length: 255 }).notNull(),
  price: integer("price").notNull(), // EGP
  oldPrice: integer("old_price"), // EGP, used for discount and reverting
  timerEndsAt: timestamp("timer_ends_at"), // countdown timestamp
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  items: text("items").notNull(), // JSON string representing array of items
  totalPrice: integer("total_price").notNull(), // EGP
  address: text("address").notNull(),
  locationCoords: varchar("location_coords", { length: 255 }),
  shippingAgent: varchar("shipping_agent", { length: 100 }).default("Egypt Post (البريد المصري)").notNull(),
  status: varchar("status", { length: 50 }).default("Pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const whatsappOtps = pgTable("whatsapp_otps", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 50 }).notNull(),
  otp: varchar("otp", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

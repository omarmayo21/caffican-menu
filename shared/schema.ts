import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  description: text("description"),
  imagePublicId: text("image_public_id"),
  image: text("image"),
  categoryId: integer("category_id").notNull(),
  sectionId: integer("section_id"),
  available: boolean("available").default(true),
});

export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  tableName: text("table_name").notNull(),
  qrCodeUrl: text("qr_code_url"),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  sections: many(sections),
  menuItems: many(menuItems),
}));

export const sectionRelations = relations(sections, ({ one, many }) => ({
  category: one(categories, {
    fields: [sections.categoryId],
    references: [categories.id],
  }),
  menuItems: many(menuItems),
}));

export const menuItemRelations = relations(menuItems, ({ one }) => ({
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
  section: one(sections, {
    fields: [menuItems.sectionId],
    references: [sections.id],
  }),
}));

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertSectionSchema = createInsertSchema(sections).omit({ id: true });
export const insertMenuItemSchema = createInsertSchema(menuItems)
  .omit({ id: true })
  .extend({
    image: z.string().url().optional().nullable(),
    imagePublicId: z.string().optional().nullable(),
  });
export const insertTableSchema = createInsertSchema(tables).omit({ id: true });

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Section = typeof sections.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Table = typeof tables.$inferSelect;
export type InsertTable = z.infer<typeof insertTableSchema>;

import { db } from "./db";
import {
  categories,
  sections,
  menuItems,
  tables,
  type Category,
  type InsertCategory,
  type Section,
  type InsertSection,
  type MenuItem,
  type InsertMenuItem,
  type Table,
  type InsertTable,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getCategories(): Promise<(Category & { sections: Section[] })[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  getSections(): Promise<Section[]>;
  createSection(section: InsertSection): Promise<Section>;
  updateSection(id: number, updates: Partial<InsertSection>): Promise<Section>;
  deleteSection(id: number): Promise<void>;

  getMenuItems(): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuItem(id: number): Promise<void>;

  getTables(): Promise<Table[]>;
  createTable(table: InsertTable): Promise<Table>;
  deleteTable(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCategories() {
    return await db.query.categories.findMany({
      with: {
        sections: true,
      },
    });
  }
  
  async createCategory(category: InsertCategory) {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }
  
  async updateCategory(id: number, updates: Partial<InsertCategory>) {
    const [updated] = await db.update(categories).set(updates).where(eq(categories.id, id)).returning();
    return updated;
  }
  
  async deleteCategory(id: number) {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getSections() {
    return await db.query.sections.findMany();
  }
  
  async createSection(section: InsertSection) {
    const [newSection] = await db.insert(sections).values(section).returning();
    return newSection;
  }
  
  async updateSection(id: number, updates: Partial<InsertSection>) {
    const [updated] = await db.update(sections).set(updates).where(eq(sections.id, id)).returning();
    return updated;
  }
  
  async deleteSection(id: number) {
    await db.delete(sections).where(eq(sections.id, id));
  }

  async getMenuItems() {
    return await db.query.menuItems.findMany();
  }
  
  async createMenuItem(menuItem: InsertMenuItem) {
    const [newItem] = await db.insert(menuItems).values(menuItem).returning();
    return newItem;
  }
  
  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>) {
    const [updated] = await db.update(menuItems).set(updates).where(eq(menuItems.id, id)).returning();
    return updated;
  }
  
  async deleteMenuItem(id: number) {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  async getTables() {
    return await db.query.tables.findMany();
  }
  
  async createTable(table: InsertTable) {
    const [newTable] = await db.insert(tables).values(table).returning();
    return newTable;
  }
  
  async deleteTable(id: number) {
    await db.delete(tables).where(eq(tables.id, id));
  }
}

export const storage = new DatabaseStorage();

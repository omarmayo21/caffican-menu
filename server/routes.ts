import type { Express } from "express";
import type { Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { z } from "zod";

import cloudinary from "./lib/cloudinary.js";
const SessionStore = MemoryStore(session);
const ADMIN_USERNAME = 'can';
const ADMIN_PASSWORD = 'can#3011@';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'caffican_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: new SessionStore({
      checkPeriod: 86400000 
    }),
  }));

  // Auth routes
  app.post(api.auth.login.path, (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      if (input.username === ADMIN_USERNAME && input.password === ADMIN_PASSWORD) {
        (req.session as any).user = { username: ADMIN_USERNAME };
        res.status(200).json({ message: "Logged in successfully" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    (req.session as any).destroy();
    res.status(200).json({ message: "Logged out" });
  });

  app.get(api.auth.me.path, (req, res) => {
    if ((req.session as any).user) {
      res.status(200).json((req.session as any).user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Auth middleware for admin endpoints
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Categories
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post(api.categories.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.categories.create.input.parse(req.body);
      const category = await storage.createCategory(input);
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.put(api.categories.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.categories.update.input.parse(req.body);
      const category = await storage.updateCategory(Number(req.params.id), input);
      res.status(200).json(category);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.delete(api.categories.delete.path, requireAuth, async (req, res) => {
    await storage.deleteCategory(Number(req.params.id));
    res.status(204).end();
  });

  // Sections
  app.get(api.sections.list.path, async (req, res) => {
    const sections = await storage.getSections();
    res.json(sections);
  });

  app.post(api.sections.create.path, requireAuth, async (req, res) => {
    try {
      const bodySchema = api.sections.create.input.extend({
        categoryId: z.coerce.number(),
      });
      const input = bodySchema.parse(req.body);
      const section = await storage.createSection(input);
      res.status(201).json(section);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.put(api.sections.update.path, requireAuth, async (req, res) => {
    try {
      const bodySchema = api.sections.update.input.extend({
        categoryId: z.coerce.number().optional(),
      });
      const input = bodySchema.parse(req.body);
      const section = await storage.updateSection(Number(req.params.id), input);
      res.status(200).json(section);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.delete(api.sections.delete.path, requireAuth, async (req, res) => {
    await storage.deleteSection(Number(req.params.id));
    res.status(204).end();
  });

  // Menu Items
  app.get(api.menuItems.list.path, async (req, res) => {
    const items = await storage.getMenuItems();
    res.json(items);
  });

  app.post(api.menuItems.create.path, requireAuth, async (req, res) => {
    try {
      const bodySchema = api.menuItems.create.input.extend({
        categoryId: z.coerce.number(),
        sectionId: z.coerce.number().optional().nullable(),
      });
      const input = bodySchema.parse(req.body);
      const item = await storage.createMenuItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.put(api.menuItems.update.path, requireAuth, async (req, res) => {
    try {
      const bodySchema = api.menuItems.update.input.extend({
        categoryId: z.coerce.number().optional(),
        sectionId: z.coerce.number().optional().nullable(),
      });
      const input = bodySchema.parse(req.body);
      const item = await storage.updateMenuItem(Number(req.params.id), input);
      res.status(200).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.delete(api.menuItems.delete.path, requireAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);

      // 1️⃣ هات الصنف من الداتابيز
      const items = await storage.getMenuItems();
      const item = items.find((i) => i.id === id);

      // 2️⃣ لو فيه صورة على Cloudinary → احذفها
      if (item?.image && item.image.includes("cloudinary")) {
        try {
          const parts = item.image.split("/");
          const fileName = parts[parts.length - 1]; // example: abc123.jpg
          const publicId = fileName.split(".")[0]; // abc123

          // لو بتستخدم فولدر caffican/menu في preset
          await cloudinary.uploader.destroy(`caffican/menu/${publicId}`);
          console.log("Cloudinary image deleted:", publicId);
        } catch (cloudErr) {
          console.error("Cloudinary delete error:", cloudErr);
        }
      }

      // 3️⃣ احذف الصنف من الداتابيز
      await storage.deleteMenuItem(id);

      res.status(204).end();
    } catch (error) {
      console.error("Delete menu item error:", error);
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // Tables
  app.get(api.tables.list.path, async (req, res) => {
    const tables = await storage.getTables();
    res.json(tables);
  });

  app.post(api.tables.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.tables.create.input.parse(req.body);
      const table = await storage.createTable(input);
      res.status(201).json(table);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  app.delete(api.tables.delete.path, requireAuth, async (req, res) => {
    await storage.deleteTable(Number(req.params.id));
    res.status(204).end();
  });

  // Seed the database
  try {
    await seedDatabase();
  } catch (err) {
    console.error("Error seeding database:", err);
  }

  return httpServer;
}

async function seedDatabase() {
  const existingCategories = await storage.getCategories();
  if (existingCategories.length === 0) {
    const cat1 = await storage.createCategory({ name: "Hot Drinks" });
    const cat2 = await storage.createCategory({ name: "Cold Drinks" });
    const cat3 = await storage.createCategory({ name: "Desserts" });

    const sec1 = await storage.createSection({ name: "Coffee", categoryId: cat1.id });
    const sec2 = await storage.createSection({ name: "Iced Coffee", categoryId: cat2.id });

    await storage.createMenuItem({
      name: "Espresso",
      price: "$3.50",
      description: "Rich and bold single shot espresso.",
      categoryId: cat1.id,
      sectionId: sec1.id,
      available: true,
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80"
    });

    await storage.createMenuItem({
      name: "Cappuccino",
      price: "$4.50",
      description: "Espresso with steamed milk and a deep layer of foam.",
      categoryId: cat1.id,
      sectionId: sec1.id,
      available: true,
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80"
    });

    await storage.createMenuItem({
      name: "Iced Latte",
      price: "$4.80",
      description: "Chilled milk over ice, capped with freshly shaken espresso.",
      categoryId: cat2.id,
      sectionId: sec2.id,
      available: true,
      image: "https://images.unsplash.com/photo-1517701550927-30cfcb64d550?w=500&q=80"
    });

    await storage.createMenuItem({
      name: "Tiramisu",
      price: "$6.50",
      description: "Classic Italian dessert with coffee-soaked ladyfingers.",
      categoryId: cat3.id,
      available: true,
      image: "https://images.unsplash.com/photo-1571115177098-24de855d045d?w=500&q=80"
    });

    await storage.createTable({
      tableName: "Table-1",
      qrCodeUrl: "/menu?table=Table-1"
    });
    
    await storage.createTable({
      tableName: "VIP",
      qrCodeUrl: "/menu?table=VIP"
    });
  }
}

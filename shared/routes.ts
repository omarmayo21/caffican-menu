import { z } from 'zod';
import { insertCategorySchema, insertSectionSchema, insertMenuItemSchema, insertTableSchema, categories, sections, menuItems, tables } from './schema.js';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ message: z.string() }),
        401: errorSchemas.unauthorized,
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() })
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.object({ username: z.string() }),
        401: errorSchemas.unauthorized,
      }
    }
  },
  categories: {
    list: {
      method: 'GET' as const,
      path: '/api/categories' as const,
      responses: { 200: z.array(z.custom<typeof categories.$inferSelect & { sections: typeof sections.$inferSelect[] }>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/categories' as const,
      input: insertCategorySchema,
      responses: { 201: z.custom<typeof categories.$inferSelect>(), 400: errorSchemas.validation },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/categories/:id' as const,
      input: insertCategorySchema.partial(),
      responses: { 200: z.custom<typeof categories.$inferSelect>(), 400: errorSchemas.validation, 404: errorSchemas.notFound },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/categories/:id' as const,
      responses: { 204: z.void(), 404: errorSchemas.notFound },
    }
  },
  sections: {
    list: {
      method: 'GET' as const,
      path: '/api/sections' as const,
      responses: { 200: z.array(z.custom<typeof sections.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/sections' as const,
      input: insertSectionSchema,
      responses: { 201: z.custom<typeof sections.$inferSelect>(), 400: errorSchemas.validation },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/sections/:id' as const,
      input: insertSectionSchema.partial(),
      responses: { 200: z.custom<typeof sections.$inferSelect>(), 400: errorSchemas.validation, 404: errorSchemas.notFound },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/sections/:id' as const,
      responses: { 204: z.void(), 404: errorSchemas.notFound },
    }
  },
  menuItems: {
    list: {
      method: 'GET' as const,
      path: '/api/menu-items' as const,
      responses: { 200: z.array(z.custom<typeof menuItems.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/menu-items' as const,
      input: insertMenuItemSchema,
      responses: { 201: z.custom<typeof menuItems.$inferSelect>(), 400: errorSchemas.validation },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/menu-items/:id' as const,
      input: insertMenuItemSchema.partial(),
      responses: { 200: z.custom<typeof menuItems.$inferSelect>(), 400: errorSchemas.validation, 404: errorSchemas.notFound },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/menu-items/:id' as const,
      responses: { 204: z.void(), 404: errorSchemas.notFound },
    }
  },
  tables: {
    list: {
      method: 'GET' as const,
      path: '/api/tables' as const,
      responses: { 200: z.array(z.custom<typeof tables.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tables' as const,
      input: insertTableSchema,
      responses: { 201: z.custom<typeof tables.$inferSelect>(), 400: errorSchemas.validation },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/tables/:id' as const,
      responses: { 204: z.void(), 404: errorSchemas.notFound },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

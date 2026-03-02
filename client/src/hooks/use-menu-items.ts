import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertMenuItem, MenuItem } from "@shared/schema";

export function useMenuItems() {
  return useQuery({
    queryKey: [api.menuItems.list.path],
    queryFn: async () => {
      const res = await fetch(api.menuItems.list.path);
      if (!res.ok) throw new Error("Failed to fetch menu items");
      return res.json() as Promise<MenuItem[]>;
    },
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMenuItem) => {
      // Coerce numeric IDs
      const payload = { 
        ...data, 
        categoryId: Number(data.categoryId),
        sectionId: data.sectionId ? Number(data.sectionId) : undefined
      };
      
      const res = await fetch(api.menuItems.create.path, {
        method: api.menuItems.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create menu item");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.menuItems.list.path] }),
  });
}

export function useToggleItemAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, available }: { id: number, available: boolean }) => {
      const url = buildUrl(api.menuItems.update.path, { id });
      const res = await fetch(url, {
        method: api.menuItems.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available }),
      });
      if (!res.ok) throw new Error("Failed to update availability");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.menuItems.list.path] }),
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.menuItems.delete.path, { id });
      const res = await fetch(url, { method: api.menuItems.delete.method });
      if (!res.ok) throw new Error("Failed to delete menu item");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.menuItems.list.path] }),
  });
}

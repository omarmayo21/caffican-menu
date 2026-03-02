import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertSection, Section } from "@shared/schema";

export function useSections() {
  return useQuery({
    queryKey: [api.sections.list.path],
    queryFn: async () => {
      const res = await fetch(api.sections.list.path);
      if (!res.ok) throw new Error("Failed to fetch sections");
      return res.json() as Promise<Section[]>;
    },
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSection) => {
      // Coerce categoryId to number to match schema
      const payload = { ...data, categoryId: Number(data.categoryId) };
      const res = await fetch(api.sections.create.path, {
        method: api.sections.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create section");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.sections.list.path] }),
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.sections.delete.path, { id });
      const res = await fetch(url, { method: api.sections.delete.method });
      if (!res.ok) throw new Error("Failed to delete section");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.sections.list.path] }),
  });
}

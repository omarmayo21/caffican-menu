import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertTable, Table } from "@shared/schema";

export function useTables() {
  return useQuery({
    queryKey: [api.tables.list.path],
    queryFn: async () => {
      const res = await fetch(api.tables.list.path);
      if (!res.ok) throw new Error("Failed to fetch tables");
      return res.json() as Promise<Table[]>;
    },
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTable) => {
      const res = await fetch(api.tables.create.path, {
        method: api.tables.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create table");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tables.list.path] }),
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.tables.delete.path, { id });
      const res = await fetch(url, { method: api.tables.delete.method });
      if (!res.ok) throw new Error("Failed to delete table");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tables.list.path] }),
  });
}

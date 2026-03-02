import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/use-categories";
import { Plus, Trash2 } from "lucide-react";

export default function CategoriesManage() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await createCategory.mutateAsync({ name: newCatName });
    setNewCatName("");
    setIsCreating(false);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage main menu categories (e.g., Coffee, Pastries)</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-card border border-border rounded-2xl p-6 mb-8 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Category Name</label>
            <input 
              type="text" 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full bg-input/50 border border-border text-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Hot Beverages"
              autoFocus
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-accent">Cancel</button>
            <button type="submit" disabled={createCategory.isPending} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">Save</button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Name</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Sections Count</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No categories yet.</td></tr>
              )}
              {categories?.map((cat) => (
                <tr key={cat.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{cat.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cat.sections?.length || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        if (confirm('Are you sure? This will delete all related sections and items.')) {
                          deleteCategory.mutate(cat.id);
                        }
                      }}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

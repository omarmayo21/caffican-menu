import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useCategories } from "@/hooks/use-categories";
import { useSections, useCreateSection, useDeleteSection } from "@/hooks/use-sections";
import { Plus, Trash2 } from "lucide-react";

export default function SectionsManage() {
  const { data: categories } = useCategories();
  const { data: sections, isLoading } = useSections();
  
  const createSection = useCreateSection();
  const deleteSection = useDeleteSection();
  
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    await createSection.mutateAsync({ name, categoryId: Number(categoryId) });
    setName("");
    setIsCreating(false);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Sub-Sections</h1>
          <p className="text-muted-foreground mt-1">Manage sub-categories (e.g., Espresso, Pour Over)</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Plus className="w-5 h-5" /> Add Section
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-card border border-border rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Section Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-input/50 border border-border text-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Espresso Based"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Parent Category</label>
            <select 
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-input/50 border border-border text-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="" disabled>Select a category...</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-accent">Cancel</button>
            <button type="submit" disabled={createSection.isPending} className="w-full bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">Save</button>
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
                <th className="px-6 py-4 font-semibold text-muted-foreground">Category</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections?.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No sections yet.</td></tr>
              )}
              {sections?.map((sec) => (
                <tr key={sec.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{sec.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-lg text-sm">
                      {categories?.find(c => c.id === sec.categoryId)?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        if (confirm('Are you sure? This will delete related items.')) {
                          deleteSection.mutate(sec.id);
                        }
                      }}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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

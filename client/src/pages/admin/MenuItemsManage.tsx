import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useCategories } from "@/hooks/use-categories";
import { useSections } from "@/hooks/use-sections";
import { 
  useMenuItems, 
  useCreateMenuItem, 
  useDeleteMenuItem, 
  useToggleItemAvailability,
  useUpdateMenuItem   // 👈 ضيف دي
} from "@/hooks/use-menu-items";
import { Plus, Trash2, Power, Image as ImageIcon } from "lucide-react";



export default function MenuItemsManage() {
  const { data: categories } = useCategories();
  const { data: sections } = useSections();
  const { data: items, isLoading } = useMenuItems();
  
  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const toggleAvailable = useToggleItemAvailability();
  
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "", price: "", description: "", image: "", categoryId: "", sectionId: ""
  });
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };
  const availableSections = sections?.filter(s => s.categoryId === Number(formData.categoryId)) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      price: formData.price,
      description: formData.description || null,
      image: formData.image || null,
      categoryId: Number(formData.categoryId),
      sectionId: formData.sectionId ? Number(formData.sectionId) : null,
    };

    if (editingItem) {
      await updateItem.mutateAsync({
        id: editingItem.id,
        ...payload,
      });
    } else {
      await createItem.mutateAsync({
        ...payload,
        available: true,
      });
    }

    setEditingItem(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      image: "",
      categoryId: "",
      sectionId: "",
    });

    setIsCreating(false);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            {editingItem ? "Edit Menu Item" : "Menu Items"}
          </h1>
          <p className="text-muted-foreground mt-1">Add and manage your products</p>
        </div>
        <button 
          onClick={() => {
            if (editingItem) {
              setEditingItem(null);
              setFormData({
                name: "",
                price: "",
                description: "",
                image: "",
                categoryId: "",
                sectionId: "",
              });
            }
            setIsCreating(true);
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Plus className="w-5 h-5" />
          {editingItem ? "Edit Item" : "Add Item"}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Item Name *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-input/50 border border-border text-foreground rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Price *</label>
              <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-input/50 border border-border text-foreground rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" placeholder="$4.50" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Category *</label>
              <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value, sectionId: ""})} className="w-full bg-input/50 border border-border text-foreground rounded-xl px-4 py-2.5 outline-none" required>
                <option value="" disabled>Select Category...</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Section (Optional)</label>
              <select value={formData.sectionId} onChange={e => setFormData({...formData, sectionId: e.target.value})} className="w-full bg-input/50 border border-border text-foreground rounded-xl px-4 py-2.5 outline-none" disabled={!formData.categoryId}>
                <option value="">None</option>
                {availableSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-input/50 border border-border text-foreground rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" rows={2} />
            </div>
            <div className="md:col-span-2">
              <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Item Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full bg-input/50 border border-border text-foreground rounded-xl px-4 py-2.5 outline-none"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;

                  try {
                    setUploading(true);
                    const url = await uploadToCloudinary(e.target.files[0]);

                    setFormData((prev) => ({
                      ...prev,
                      image: url,
                    }));
                  } catch (err) {
                    console.error("Upload failed:", err);
                  } finally {
                    setUploading(false);
                  }
                }}
              />

              {uploading && (
                <p className="text-xs text-muted-foreground mt-2">
                  Uploading image...
                </p>
              )}

              {formData.image && (
                <div className="mt-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl border border-border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, image: "" })
                    }
                    className="mt-2 text-sm text-destructive hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2.5 rounded-xl border border-border text-foreground hover:bg-accent">Cancel</button>
            <button type="submit" disabled={createItem.isPending} className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-medium disabled:opacity-50">Save Item</button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-muted-foreground w-16">Img</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Product</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Price</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items?.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No menu items found.</td></tr>
            )}
            {items?.map((item) => (
              <tr key={item.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                <td className="px-6 py-4">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {categories?.find(c => c.id === item.categoryId)?.name} 
                    {item.sectionId && ` • ${sections?.find(s => s.id === item.sectionId)?.name}`}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{item.price}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleAvailable.mutate({ id: item.id, available: !item.available })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${item.available ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'bg-destructive/20 text-destructive hover:bg-destructive/30'}`}
                  >
                    {item.available ? 'Available' : 'Sold Out'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                  type="button"
                  onClick={() => {
                    setEditingItem(item);
                    setIsCreating(true);
                    setFormData({
                      name: item.name,
                      price: item.price,
                      description: item.description || "",
                      image: item.image || "",
                      categoryId: String(item.categoryId),
                      sectionId: item.sectionId ? String(item.sectionId) : "",
                    });
                  }}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  ✏️
                </button>

                  <button 
                    onClick={() => { if (confirm('Delete this item?')) deleteItem.mutate(item.id); }}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

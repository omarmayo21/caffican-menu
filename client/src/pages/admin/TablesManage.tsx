import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useTables, useCreateTable, useDeleteTable } from "@/hooks/use-tables";
import { Plus, Trash2, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function TablesManage() {
  const { data: tables, isLoading } = useTables();
  const createTable = useCreateTable();
  const deleteTable = useDeleteTable();
  
  const [isCreating, setIsCreating] = useState(false);
  const [tableName, setTableName] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableName.trim()) return;
    await createTable.mutateAsync({ tableName });
    setTableName("");
    setIsCreating(false);
  };

  const getMenuUrl = (tName: string) => `${window.location.origin}/menu?table=${encodeURIComponent(tName)}`;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">QR Tables</h1>
          <p className="text-muted-foreground mt-1">Generate dynamic menu QR codes for each table</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Plus className="w-5 h-5" /> Add Table
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-card border border-border rounded-2xl p-6 mb-8 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Table Identifier</label>
            <input 
              type="text" 
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="w-full bg-input/50 border border-border text-foreground rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Table 1, Patio 3, Window A"
              autoFocus
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-accent">Cancel</button>
            <button type="submit" disabled={createTable.isPending} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium disabled:opacity-50">Create</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables?.map(table => (
          <div key={table.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center shadow-lg group hover:border-primary/50 transition-colors">
            <h3 className="text-2xl font-bold text-foreground mb-6 font-display">{table.tableName}</h3>
            
            <div className="bg-white p-4 rounded-2xl shadow-inner mb-6">
              <QRCodeSVG 
                value={getMenuUrl(table.tableName)} 
                size={160}
                bgColor="#ffffff"
                fgColor="#1a1a1a"
                level="Q"
              />
            </div>

            <div className="w-full flex gap-2">
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-accent hover:bg-accent/80 text-foreground py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button 
                onClick={() => { if(confirm('Delete this table QR?')) deleteTable.mutate(table.id) }}
                className="bg-destructive/10 hover:bg-destructive/20 text-destructive p-2 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

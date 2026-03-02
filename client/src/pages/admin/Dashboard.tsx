import { AdminLayout } from "@/components/AdminLayout";
import { useCategories } from "@/hooks/use-categories";
import { useMenuItems } from "@/hooks/use-menu-items";
import { useTables } from "@/hooks/use-tables";
import { UtensilsCrossed, ListTree, QrCode } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: categories } = useCategories();
  const { data: items } = useMenuItems();
  const { data: tables } = useTables();

  const stats = [
    { label: "Total Categories", value: categories?.length || 0, icon: ListTree, link: "/admin/categories" },
    { label: "Menu Items", value: items?.length || 0, icon: UtensilsCrossed, link: "/admin/items" },
    { label: "Active Tables", value: tables?.length || 0, icon: QrCode, link: "/admin/tables" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening at CaffiCan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.link} className="block">
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}

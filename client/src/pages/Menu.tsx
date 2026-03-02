import { useState } from "react";
import { useCategories } from "@/hooks/use-categories";
import { useMenuItems } from "@/hooks/use-menu-items";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Coffee, ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function Menu() {
  const { data: categories, isLoading: catsLoading } = useCategories();
  const { data: items, isLoading: itemsLoading } = useMenuItems();
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  // Parse table parameter from URL safely
  const urlParams = new URLSearchParams(window.location.search);
  const table = urlParams.get("table");

  if (catsLoading || itemsLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Coffee className="w-12 h-12 text-primary animate-bounce mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Preparing the menu...</p>
      </div>
    );
  }

  // Filter out unavailable items for the digital menu
  const availableItems = items?.filter(item => item.available) || [];
  
  // Search filtering
  const filteredItems = availableItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground pt-6 pb-12 px-4 rounded-b-[2rem] shadow-lg relative">
        <Link href="/" className="absolute top-6 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="text-center mt-4">
          <h1 className="text-4xl font-bold font-display tracking-tight mb-2">CaffiCan</h1>
          <p className="text-primary-foreground/80 font-medium">
            {table ? `Welcome • Table ${table}` : 'Digital Menu'}
          </p>
        </div>
        
        {/* Search Bar positioned to overlap the bottom edge */}
        <div className="absolute -bottom-7 left-0 right-0 px-6 max-w-md mx-auto">
          <div className="bg-card rounded-2xl shadow-xl p-2 flex items-center border border-border">
            <Search className="w-5 h-5 text-muted-foreground ml-3" />
            <input 
              type="text"
              placeholder="Search for coffee, pastries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-12 px-4">
        {/* Category Sticky Tabs */}
        {!searchQuery && (
          <div className="sticky top-4 z-20 bg-background/90 backdrop-blur-md py-4 -mx-4 px-4 mb-6">
            <div className="flex overflow-x-auto gap-3 hide-scrollbar pb-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                  activeCategory === 'all' 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' 
                    : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                All
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                    activeCategory === cat.id 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' 
                      : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Content */}
        <div className="space-y-12">
          <AnimatePresence>
            {searchQuery ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-4"
              >
                <h2 className="text-xl font-bold mb-4">Search Results</h2>
                {filteredItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No items found.</p>
                ) : (
                  filteredItems.map(item => <MenuItemCard key={item.id} item={item} />)
                )}
              </motion.div>
            ) : (
              categories?.filter(cat => activeCategory === 'all' || activeCategory === cat.id).map(category => {
                const catItems = filteredItems.filter(i => i.categoryId === category.id);
                if (catItems.length === 0) return null;

                return (
                  <motion.div 
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-bold font-display border-b border-border pb-2">{category.name}</h2>
                    
                    {/* Items not in a section */}
                    <div className="space-y-4">
                      {catItems.filter(i => !i.sectionId).map(item => (
                        <MenuItemCard key={item.id} item={item} />
                      ))}
                    </div>

                    {/* Sections */}
                    {category.sections.map(section => {
                      const secItems = catItems.filter(i => i.sectionId === section.id);
                      if (secItems.length === 0) return null;
                      return (
                        <div key={section.id} className="pt-4 space-y-4">
                          <h3 className="text-xl font-semibold text-primary">{section.name}</h3>
                          {secItems.map(item => (
                            <MenuItemCard key={item.id} item={item} />
                          ))}
                        </div>
                      )
                    })}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MenuItemCard({ item }: { item: any }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4 mb-1">
          <h4 className="font-bold text-lg text-foreground truncate">{item.name}</h4>
          <span className="font-semibold text-primary whitespace-nowrap">{item.price}</span>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
        )}
      </div>
      {item.image ? (
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-24 h-24 rounded-xl object-cover shrink-0 shadow-sm"
        />
      ) : (
        <div className="w-24 h-24 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 border border-border/50">
          <Coffee className="w-8 h-8 text-muted-foreground/40" />
        </div>
      )}
    </div>
  );
}

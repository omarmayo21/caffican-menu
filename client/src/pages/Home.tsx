import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Coffee, Star, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <main className="pt-20">
        <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          {/* landing page hero luxury cafe interior */}
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop" 
            alt="CaffiCan Interior" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4 max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Experience True <span className="text-secondary italic">Luxury</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 font-light max-w-2xl mx-auto">
              CaffiCan blends artisanal coffee crafting with an unforgettable, elegant atmosphere. Discover your new favorite sanctuary.
            </p>
            <Link 
              href="/menu" 
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:shadow-primary/30"
            >
              Explore Our Menu
            </Link>
          </motion.div>
        </div>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why CaffiCan?</h2>
              <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center p-8 rounded-3xl bg-background border border-border hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Coffee className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Artisanal Roasts</h3>
                <p className="text-muted-foreground">Sourced globally, roasted locally. Every cup is crafted to perfection by our master baristas.</p>
              </div>
              
              <div className="text-center p-8 rounded-3xl bg-background border border-border hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Luxury Atmosphere</h3>
                <p className="text-muted-foreground">Designed for comfort and class. The perfect backdrop for your morning routine or afternoon meeting.</p>
              </div>
              
              <div className="text-center p-8 rounded-3xl bg-background border border-border hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Prime Location</h3>
                <p className="text-muted-foreground">Nestled in the heart of the city, easily accessible yet feeling a world away from the noise.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

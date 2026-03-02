import { Link } from "wouter";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-2xl md:text-3xl font-bold text-primary tracking-tight font-display">
            CaffiCan
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/menu" className="font-medium hover:text-primary transition-colors">
              Our Menu
            </Link>
            <Link href="/admin" className="font-medium hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

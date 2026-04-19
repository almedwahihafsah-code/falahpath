import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => (
  <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/75 border-b border-border/50">
    <nav className="container flex items-center justify-between h-16">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-emerald flex items-center justify-center shadow-soft">
          <span className="text-primary-foreground font-display text-lg">ف</span>
        </div>
        <span className="font-display text-xl text-primary">الفلاح</span>
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm">
        <a href="#perspective" className="text-muted-foreground hover:text-primary transition-smooth">المنظور</a>
        <a href="#domains" className="text-muted-foreground hover:text-primary transition-smooth">المجالات</a>
        <a href="#paths" className="text-muted-foreground hover:text-primary transition-smooth">المسارات</a>
        <a href="#method" className="text-muted-foreground hover:text-primary transition-smooth">المنهج</a>
      </div>
      <Button asChild className="bg-gradient-emerald hover:opacity-90 text-primary-foreground shadow-soft">
        <Link to="/app">ابدأ رحلتك</Link>
      </Button>
    </nav>
  </header>
);

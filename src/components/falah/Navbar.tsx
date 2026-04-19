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
        <Link to="/" className="text-muted-foreground hover:text-primary transition-smooth">الرئيسية</Link>
        <Link to="/app" className="text-muted-foreground hover:text-primary transition-smooth">لوحة الفلاح</Link>
        <Link to="/guide" className="text-accent hover:text-primary transition-smooth">المرشد الذكي</Link>
      </div>
      <Button asChild className="bg-gradient-emerald hover:opacity-90 text-primary-foreground shadow-soft">
        <Link to="/guide">اطلب إرشادًا</Link>
      </Button>
    </nav>
  </header>
);

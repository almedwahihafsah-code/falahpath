import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLandingLang } from "@/i18n/landing/LandingLang";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const { t, dir } = useLandingLang();
  const navLinks = [
    { to: "/", label: t.nav.home },
    { to: "/intent", label: t.nav.start, accent: true },
    { to: "/progress", label: t.nav.journey },
    { to: "/app", label: t.nav.dashboard },
  ];
  const sheetSide = dir === "rtl" ? "right" : "left";
  const textAlign = dir === "rtl" ? "text-right" : "text-left";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/55 border-b border-border/40 shadow-[0_1px_0_0_hsl(var(--border)/0.4),0_8px_32px_-8px_hsl(var(--primary)/0.08)] supports-[backdrop-filter]:bg-background/40">
      <nav className="container flex items-center justify-between h-[72px]">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/falah_logo_transparent.png"
            alt="الفلاح"
            loading="eager"
            decoding="async"
            className="h-14 w-auto object-contain"
          />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`${l.accent ? "text-accent" : "text-muted-foreground"} hover:text-primary transition-smooth`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            {user ? (
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" /> {t.nav.logout}
              </Button>
            ) : (
              <Button asChild className="bg-gradient-emerald hover:opacity-90 text-primary-foreground shadow-soft">
                <Link to="/auth">{t.nav.login}</Link>
              </Button>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label={t.nav.openMenu}>
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={sheetSide} className="w-72">
              <SheetHeader>
                <SheetTitle className={`font-display text-primary ${textAlign}`}>{t.nav.menu}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 mt-6">
                {navLinks.map((l) => (
                  <SheetClose asChild key={l.to}>
                    <Link
                      to={l.to}
                      className={`px-4 py-3 rounded-lg text-base ${textAlign} hover:bg-muted transition-smooth ${
                        l.accent ? "text-accent font-medium" : "text-foreground"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="mt-4 border-t border-border pt-4">
                  {user ? (
                    <SheetClose asChild>
                      <Button variant="outline" onClick={handleSignOut} className="w-full gap-2">
                        <LogOut className="w-4 h-4" /> {t.nav.logout}
                      </Button>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild>
                      <Button asChild className="w-full bg-gradient-emerald hover:opacity-90 text-primary-foreground shadow-soft">
                        <Link to="/auth">{t.nav.login}</Link>
                      </Button>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

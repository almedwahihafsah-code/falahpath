import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/falah/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Compass, Home, AlertTriangle, BookOpen, ListTodo } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "صفحة غير موجودة | منهج الفلاح";
  }, [location.pathname]);

  const quickLinks = [
    { to: "/", label: "الرئيسية", icon: Home },
    { to: "/app", label: "لوحة الفلاح", icon: ListTodo },
    { to: "/quran", label: "مستكشف القرآن", icon: BookOpen },
    { to: "/guide", label: "المرشد الذكي", icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container py-16 md:py-24 flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8 md:p-12 bg-gradient-card border-border/60 shadow-elegant text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-accent" aria-hidden />
          </div>
          <p className="font-display text-7xl md:text-8xl text-gradient-gold mb-2">404</p>
          <h1 className="font-display text-2xl md:text-3xl text-primary mb-3">
            هذه الصفحة غير موجودة
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            المسار الذي حاولت الوصول إليه غير متاح أو تمّ نقله.
          </p>

          <Alert className="text-right mb-8 border-accent/30 bg-accent/5">
            <AlertTitle className="text-primary">المسار المطلوب</AlertTitle>
            <AlertDescription className="text-muted-foreground break-all font-mono text-xs">
              {location.pathname}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {quickLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-border/60 hover:border-accent/50 hover:bg-accent/5 transition-smooth"
              >
                <l.icon className="w-5 h-5 text-primary group-hover:text-accent transition-smooth" />
                <span className="text-sm text-foreground">{l.label}</span>
              </Link>
            ))}
          </div>

          <Button asChild size="lg" className="bg-gradient-emerald text-primary-foreground hover:opacity-90 shadow-soft">
            <Link to="/">
              العودة إلى الرئيسية <ArrowLeft className="mr-2 w-4 h-4" />
            </Link>
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default NotFound;

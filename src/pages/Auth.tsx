import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Sparkles, Mail } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingVerification, setPendingVerification] = useState<string | null>(null);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);

  const routeAfterAuth = async (userId: string) => {
    try {
      // 1) New user without a profile → onboarding
      const { data: profile } = await supabase
        .from("user_profiles" as any)
        .select("user_id,initial_intent_code")
        .eq("user_id", userId)
        .maybeSingle();
      if (!profile) {
        navigate("/onboarding", { replace: true });
        return;
      }
      // 2) Returning user → app if they've taken actions, else intent (pre-selected)
      const ic = (profile as any).initial_intent_code;
      const { count } = await supabase
        .from("actions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      if ((count ?? 0) > 0) navigate("/app", { replace: true });
      else navigate(ic ? `/intent?intent=${ic}` : "/intent", { replace: true });
    } catch {
      navigate("/intent", { replace: true });
    }
  };

  useEffect(() => {
    if (!authLoading && user) routeAfterAuth(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 6) {
      toast.error("أدخل بريدًا صحيحًا وكلمة مرور (٦ أحرف فأكثر)");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/intent` },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("تم إنشاء الحساب بنجاح");
          await routeAfterAuth(data.session.user.id);
        } else {
          // Email confirmation required — show verification screen
          setPendingVerification(email);
        }
      } else {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (signInData.user) await routeAfterAuth(signInData.user.id);
        else navigate("/intent", { replace: true });
      }
    } catch (err: any) {
      const msg = String(err?.message || "");
      if (/email not confirmed|not confirmed|email_not_confirmed/i.test(msg)) {
        setUnconfirmedEmail(email);
      } else {
        toast.error(msg || "تعذّر إتمام العملية");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async (target: string) => {
    if (!target) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: target,
        options: { emailRedirectTo: `${window.location.origin}/intent` },
      });
      if (error) throw error;
      toast.success("أعدنا إرسال رسالة التأكيد إلى بريدك.");
    } catch (err: any) {
      toast.error(err?.message || "تعذّر إعادة الإرسال");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/intent`,
      });
      if (result.error) {
        toast.error("تعذّر تسجيل الدخول عبر Google");
        setBusy(false);
        return;
      }
      if (result.redirected) return;
      navigate("/intent", { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "تعذّر تسجيل الدخول");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-7 bg-gradient-card shadow-elegant">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-emerald flex items-center justify-center shadow-soft">
            <span className="text-primary-foreground font-display text-lg">ف</span>
          </div>
          <span className="font-display text-2xl text-primary">الفلاح</span>
        </Link>
        {pendingVerification ? (
          <div className="text-center" dir="rtl">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-5 shadow-soft">
              <Mail className="w-7 h-7 text-accent" />
            </div>
            <h1 className="font-display text-2xl text-primary mb-3">تحقّق من بريدك</h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              أرسلنا رسالة تأكيد إلى{" "}
              <span className="text-primary font-medium">{pendingVerification}</span>.
              افتح بريدك واضغط رابط التأكيد لتبدأ رحلتك مع منهج الفلاح.
            </p>
            <p className="text-xs text-muted-foreground/80 mb-6 leading-relaxed">
              إن لم تجد الرسالة في صندوق الوارد، تحقّق من مجلد البريد المزعج (Spam).
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleResend(pendingVerification)}
              disabled={busy}
              className="mb-4"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "لم تصلك الرسالة؟ أعد الإرسال"}
            </Button>
            <div>
              <button
                type="button"
                onClick={() => { setPendingVerification(null); setMode("signin"); }}
                className="text-sm text-accent hover:underline"
              >
                العودة لتسجيل الدخول
              </button>
            </div>
          </div>
        ) : (
        <>
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 mb-3">
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-xs text-accent">{mode === "signin" ? "مرحبًا بعودتك" : "ابدأ رحلتك"}</span>
          </div>
          <h1 className="font-display text-2xl text-primary">
            {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
          </h1>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full mb-4"
          onClick={handleGoogle}
          disabled={busy}
        >
          متابعة عبر Google
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="px-2 bg-card text-muted-foreground">أو</span></div>
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-primary mb-1 block">البريد الإلكتروني</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password" className="text-primary mb-1 block">كلمة المرور</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-gradient-emerald text-primary-foreground shadow-soft hover:opacity-90">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === "signin" ? "دخول" : "إنشاء الحساب")}
          </Button>
        </form>

        {unconfirmedEmail && mode === "signin" && (
          <div className="mt-4 p-3 rounded-md border border-accent/30 bg-accent/5 text-center" dir="rtl">
            <p className="text-sm text-primary mb-2 leading-relaxed">
              لم تؤكّد بريدك بعد. تحقّق من صندوق الوارد،
            </p>
            <button
              type="button"
              onClick={() => handleResend(unconfirmedEmail)}
              disabled={busy}
              className="text-sm text-accent hover:underline"
            >
              {busy ? "جارٍ الإرسال..." : "أعد إرسال رابط التأكيد"}
            </button>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground mt-5">
          {mode === "signin" ? "لا تملك حسابًا؟" : "لديك حساب؟"}{" "}
          <button
            type="button"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setUnconfirmedEmail(null); }}
            className="text-accent hover:underline"
          >
            {mode === "signin" ? "أنشئ حسابًا" : "سجّل الدخول"}
          </button>
        </p>
        </>
        )}
      </Card>
    </div>
  );
};

export default Auth;

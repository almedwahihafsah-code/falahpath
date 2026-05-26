import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, MessageCircle, Send, Lightbulb, Bug, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("بريد غير صالح").max(255).optional().or(z.literal("")),
  message: z.string().trim().min(5, "الرسالة قصيرة جداً").max(2000),
});

type Category = "suggestion" | "bug" | "thanks";

const CATEGORIES: { key: Category; label: string; Icon: typeof Lightbulb; hint: string }[] = [
  { key: "suggestion", label: "اقتراح تطوير", Icon: Lightbulb, hint: "ساعدنا في تحسين تجربتك" },
  { key: "bug", label: "بلاغ تقني", Icon: Bug, hint: "أبلِغ عن مشكلة لمعالجتها" },
  { key: "thanks", label: "رسالة شكر", Icon: Heart, hint: "كلمة طيبة تُحيي المشروع" },
];

const CONTACT = {
  whatsapp: "+971555851944",
  email: "info@falah.me",
  phone: "+971555851944",
};

export const EngagementHub = () => {
  const [category, setCategory] = useState<Category>("suggestion");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "تحقّق من البيانات");
      return;
    }
    setSubmitting(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from("feedback").insert({
      category,
      name: name.trim() || null,
      email: email.trim() || null,
      message: message.trim(),
      user_id: auth.user?.id ?? null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("تعذّر الإرسال، حاول لاحقاً");
      return;
    }
    toast.success("وصلتنا رسالتك. شكرًا لك.");
    setName("");
    setEmail("");
    setMessage("");
  };

  const waLink = `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`;

  return (
    <section id="engagement" className="bg-[hsl(40_35%_96%)] py-24 md:py-32">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-accent/60" />
            <span className="font-sans2 text-[11px] tracking-[0.45em] uppercase text-accent">
              Engagement Hub · بوابة التواصل
            </span>
            <span className="h-px w-10 bg-accent/60" />
          </div>
          <h2 className="font-editorial text-4xl md:text-6xl text-primary tracking-tight leading-tight mb-5">
            شاركنا في بناء <em className="text-accent not-italic font-editorial italic">الأثر.</em>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-loose">
            رأيك جزءٌ من المنهج. تواصل معنا، أو شاركنا اقتراحًا، بلاغًا، أو كلمةً طيبة.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* CONTACT PANEL */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-7 bg-card border-border/60 hover:border-accent/40 transition-smooth group">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5"
              >
                <div className="w-14 h-14 rounded-full bg-primary/5 group-hover:bg-accent/10 flex items-center justify-center transition-smooth">
                  <MessageCircle className="w-6 h-6 text-primary group-hover:text-accent transition-smooth" />
                </div>
                <div className="flex-1">
                  <p className="font-sans2 text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-1">
                    WhatsApp Business
                  </p>
                  <p className="font-editorial text-xl text-primary">واتساب الأعمال</p>
                  <p className="text-sm text-muted-foreground mt-0.5" dir="ltr">{CONTACT.whatsapp}</p>
                </div>
              </a>
            </Card>

            <Card className="p-7 bg-card border-border/60 hover:border-accent/40 transition-smooth group">
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-primary/5 group-hover:bg-accent/10 flex items-center justify-center transition-smooth">
                  <Mail className="w-6 h-6 text-primary group-hover:text-accent transition-smooth" />
                </div>
                <div className="flex-1">
                  <p className="font-sans2 text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-1">
                    Official Email
                  </p>
                  <p className="font-editorial text-xl text-primary">البريد الرسمي</p>
                  <p className="text-sm text-muted-foreground mt-0.5" dir="ltr">{CONTACT.email}</p>
                </div>
              </a>
            </Card>

            <Card className="p-7 bg-card border-border/60 hover:border-accent/40 transition-smooth group">
              <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-primary/5 group-hover:bg-accent/10 flex items-center justify-center transition-smooth">
                  <Phone className="w-6 h-6 text-primary group-hover:text-accent transition-smooth" />
                </div>
                <div className="flex-1">
                  <p className="font-sans2 text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-1">
                    Support Line
                  </p>
                  <p className="font-editorial text-xl text-primary">هاتف الدعم</p>
                  <p className="text-sm text-muted-foreground mt-0.5" dir="ltr">{CONTACT.phone}</p>
                </div>
              </a>
            </Card>
          </div>

          {/* FEEDBACK FORM */}
          <div className="lg:col-span-7">
            <Card className="p-8 md:p-10 bg-card border-border/60 shadow-soft">
              <p className="font-sans2 text-[10px] tracking-[0.45em] uppercase text-accent mb-3">
                Feedback Box
              </p>
              <h3 className="font-editorial text-3xl text-primary mb-7">صندوق التطوير</h3>

              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-7">
                {CATEGORIES.map(({ key, label, Icon, hint }) => {
                  const active = category === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      className={`group text-right p-4 rounded-sm border transition-smooth ${
                        active
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/40"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${active ? "text-accent" : "text-muted-foreground"}`} />
                      <p className={`font-editorial text-base md:text-lg ${active ? "text-primary" : "text-foreground"}`}>
                        {label}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug hidden md:block">
                        {hint}
                      </p>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="الاسم (اختياري)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={120}
                    className="h-12 bg-background border-border/70 focus-visible:ring-accent"
                  />
                  <Input
                    type="email"
                    placeholder="البريد الإلكتروني (اختياري)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={255}
                    dir="ltr"
                    className="h-12 bg-background border-border/70 focus-visible:ring-accent"
                  />
                </div>
                <Textarea
                  placeholder="اكتب رسالتك هنا… كل كلمةٍ منك تُغذّي هذا الوقف."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  rows={6}
                  className="bg-background border-border/70 focus-visible:ring-accent text-base leading-relaxed resize-none"
                  required
                />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground font-sans2">
                    {message.length} / 2000
                  </span>
                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="bg-gradient-emerald text-primary-foreground hover:opacity-90 shadow-elegant px-8"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        إرسال <Send className="mr-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
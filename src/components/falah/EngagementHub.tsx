import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, MessageCircle, Send, Lightbulb, Bug, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLandingLang } from "@/i18n/landing/LandingLang";

type Category = "suggestion" | "bug" | "thanks";
const CATEGORY_KEYS: Category[] = ["suggestion", "bug", "thanks"];
const CATEGORY_ICONS = [Lightbulb, Bug, Heart];

const CONTACT = {
  whatsapp: "+971504105804",
  email: "info@falah.me",
  phone: "+971504105804",
};

export const EngagementHub = () => {
  const { t } = useLandingLang();
  const e = t.engagement;
  const schema = z.object({
    name: z.string().trim().max(120).optional().or(z.literal("")),
    email: z.string().trim().email(e.errInvalid).max(255).optional().or(z.literal("")),
    message: z.string().trim().min(5, e.errShort).max(2000),
  });

  const [category, setCategory] = useState<Category>("suggestion");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const parsed = schema.safeParse({ name, email, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || e.errInvalid);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      message_type: category,
      name: name.trim() || null,
      email: email.trim() || null,
      message: message.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error(e.errSend);
      return;
    }
    toast.success(e.success);
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
              {e.eyebrow}
            </span>
            <span className="h-px w-10 bg-accent/60" />
          </div>
          <h2 className="font-editorial text-4xl md:text-6xl text-primary tracking-tight leading-tight mb-5">
            {e.titleLead} <em className="text-accent not-italic font-editorial italic">{e.titleEm}</em>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-loose">
            {e.intro}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
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
                    {e.waLabel}
                  </p>
                  <p className="font-editorial text-xl text-primary">{e.waAr}</p>
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
                    {e.emailLabel}
                  </p>
                  <p className="font-editorial text-xl text-primary">{e.emailAr}</p>
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
                    {e.phoneLabel}
                  </p>
                  <p className="font-editorial text-xl text-primary">{e.phoneAr}</p>
                  <p className="text-sm text-muted-foreground mt-0.5" dir="ltr">{CONTACT.phone}</p>
                </div>
              </a>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="p-8 md:p-10 bg-card border-border/60 shadow-soft">
              <p className="font-sans2 text-[10px] tracking-[0.45em] uppercase text-accent mb-3">
                {e.feedbackKicker}
              </p>
              <h3 className="font-editorial text-3xl text-primary mb-7">{e.feedbackTitle}</h3>

              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-7">
                {e.categories.map((cat, i) => {
                  const key = CATEGORY_KEYS[i];
                  const Icon = CATEGORY_ICONS[i];
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
                        {cat.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug hidden md:block">
                        {cat.hint}
                      </p>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder={e.namePh}
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    maxLength={120}
                    className="h-12 bg-background border-border/70 focus-visible:ring-accent"
                  />
                  <Input
                    type="email"
                    placeholder={e.emailPh}
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    maxLength={255}
                    dir="ltr"
                    className="h-12 bg-background border-border/70 focus-visible:ring-accent"
                  />
                </div>
                <Textarea
                  placeholder={e.msgPh}
                  value={message}
                  onChange={(ev) => setMessage(ev.target.value)}
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
                        {e.send} <Send className="mr-2 w-4 h-4" />
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

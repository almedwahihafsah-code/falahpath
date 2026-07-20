import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import ar from "./ar";
import en from "./en";
import ur from "./ur";
import ps from "./ps";
import type { LandingDict, LangCode } from "./types";

const DICTS: Record<LangCode, LandingDict> = { ar, en, ur, ps };
export const LANGS: LangCode[] = ["ar", "en", "ur", "ps"];
const STORAGE_KEY = "falah.lang";
const NOTICE_KEY = "falah.langNoticeShown";

// Route prefixes that lead into the Arabic-only app interior.
const APP_ROUTE_PREFIXES = [
  "/app",
  "/auth",
  "/onboarding",
  "/intent",
  "/domain",
  "/ayat",
  "/ayah",
  "/reflection",
  "/progress",
  "/guide",
  "/quran",
];

interface LandingLangCtx {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: LandingDict;
  dir: "rtl" | "ltr";
  fontClass: string;
  notifyAppEntry: () => void;
}

const Ctx = createContext<LandingLangCtx | null>(null);

function detectInitial(): LangCode {
  if (typeof window === "undefined") return "ar";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && LANGS.includes(stored as LangCode)) return stored as LangCode;
  const nav = window.navigator.language?.slice(0, 2).toLowerCase();
  if (nav === "en" || nav === "ur" || nav === "ps") return nav as LangCode;
  return "ar";
}

function fontFor(lang: LangCode): string {
  switch (lang) {
    case "en":
      return "font-sans2";
    case "ur":
    case "ps":
      return "font-nastaliq";
    default:
      return "font-sans";
  }
}

export function LandingLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => detectInitial());
  const rootRef = useRef<HTMLDivElement>(null);
  const noticeShownRef = useRef<boolean>(false);

  const t = DICTS[lang];
  const dir = t.meta.dir;
  const fontClass = fontFor(lang);

  // Persist + update <html> attributes so scroll containers inherit correctly.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("lang", t.meta.htmlLang);
    document.documentElement.setAttribute("dir", dir);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir, t.meta.htmlLang]);

  // Read the "notice shown" flag once, so we can suppress repeat toasts across visits.
  useEffect(() => {
    if (typeof window === "undefined") return;
    noticeShownRef.current = window.localStorage.getItem(NOTICE_KEY) === "1";
  }, []);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
  }, []);

  const notifyAppEntry = useCallback(() => {
    if (lang === "ar") return;
    if (noticeShownRef.current) return;
    toast(t.notice);
    noticeShownRef.current = true;
    try {
      window.localStorage.setItem(NOTICE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [lang, t.notice]);

  // Global click listener on the landing root — fires the notice once when the
  // user navigates into any Arabic-only app route via any link/button.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const handler = (evt: MouseEvent) => {
      const target = evt.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("/")) return;
      if (href.startsWith("/#") || href === "/") return;
      if (APP_ROUTE_PREFIXES.some((p) => href === p || href.startsWith(p + "/") || href.startsWith(p + "?"))) {
        notifyAppEntry();
      }
    };
    node.addEventListener("click", handler, true);
    return () => node.removeEventListener("click", handler, true);
  }, [notifyAppEntry]);

  const value = useMemo<LandingLangCtx>(
    () => ({ lang, setLang, t, dir, fontClass, notifyAppEntry }),
    [lang, setLang, t, dir, fontClass, notifyAppEntry],
  );

  return (
    <Ctx.Provider value={value}>
      <div ref={rootRef} dir={dir} lang={t.meta.htmlLang} className={fontClass}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function useLandingLang(): LandingLangCtx {
  const v = useContext(Ctx);
  if (!v) {
    // Safe fallback when a component that supports translations is rendered
    // outside the landing page (e.g. Navbar on an app route). Return Arabic
    // defaults so existing behavior is preserved.
    return {
      lang: "ar",
      setLang: () => {},
      t: ar,
      dir: "rtl",
      fontClass: "font-sans",
      notifyAppEntry: () => {},
    };
  }
  return v;
}

export function LanguageBar() {
  const { lang, setLang, t } = useLandingLang();
  return (
    <div
      className="w-full border-b border-border/60 bg-secondary/60 backdrop-blur-sm"
      role="region"
      aria-label={t.languageBar.label}
    >
      <div className="container flex items-center justify-end gap-1 h-9 text-[11px] font-sans2 tracking-[0.25em] uppercase">
        <span className="hidden sm:inline text-muted-foreground me-2">
          {t.languageBar.label}
        </span>
        {LANGS.map((code) => {
          const active = code === lang;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={active}
              className={`px-2.5 h-6 border transition-smooth ${
                active
                  ? "border-accent text-accent bg-background"
                  : "border-transparent text-muted-foreground hover:text-accent"
              }`}
            >
              {DICTS[code].meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
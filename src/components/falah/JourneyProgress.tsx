import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type JourneyContext = {
  intent?: string;
  domain?: string;
  verse?: string;
  action?: string;
};

type Step = {
  n: number;
  label: string;
  /** Given context, returns the route to navigate to, or null if unreachable. */
  href: (c: JourneyContext) => string | null;
};

const STEPS: Step[] = [
  { n: 1, label: "النية", href: () => "/intent" },
  {
    n: 2,
    label: "المجال",
    href: (c) => (c.intent ? `/domain?intent=${c.intent}` : "/domain"),
  },
  {
    n: 3,
    label: "الآية",
    href: (c) =>
      c.domain
        ? `/ayat?intent=${c.intent ?? "falah"}&domain=${c.domain}`
        : null,
  },
  {
    n: 4,
    label: "الفهم",
    href: (c) =>
      c.verse
        ? `/ayah/${c.verse}?intent=${c.intent ?? "falah"}&domain=${c.domain ?? "heart"}`
        : null,
  },
  {
    n: 5,
    label: "الفعل",
    href: (c) =>
      c.verse
        ? `/ayah/${c.verse}?intent=${c.intent ?? "falah"}&domain=${c.domain ?? "heart"}`
        : null,
  },
  {
    n: 6,
    label: "التفكر",
    href: (c) =>
      c.verse
        ? `/reflection?verse=${c.verse}&domain=${c.domain ?? "heart"}&intent=${c.intent ?? "falah"}${c.action ? `&action=${c.action}` : ""}`
        : null,
  },
  { n: 7, label: "التقدم", href: () => "/progress" },
];

type Props = {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  context?: JourneyContext;
};

/**
 * Persistent journey progress indicator.
 * - Completed steps are clickable and preserve journey context via URL params.
 * - Current step is highlighted.
 * - Future steps are muted and disabled.
 */
export const JourneyProgress = ({ currentStep, context = {} }: Props) => {
  return (
    <nav
      aria-label="مراحل الرحلة"
      dir="rtl"
      className="w-full border-b border-border/50 bg-background/70 backdrop-blur-sm"
    >
      <ol className="container max-w-6xl flex items-center gap-1 sm:gap-2 py-3 overflow-x-auto">
        {STEPS.map((step, i) => {
          const status: "done" | "current" | "future" =
            step.n < currentStep ? "done" : step.n === currentStep ? "current" : "future";
          const href = step.href(context);
          const clickable = status === "done" && !!href;

          const dot = (
            <span
              className={cn(
                "shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-smooth",
                status === "done" && "bg-accent text-accent-foreground",
                status === "current" &&
                  "bg-primary text-primary-foreground shadow-[var(--shadow-sacred)]",
                status === "future" && "bg-muted text-muted-foreground/60",
              )}
              aria-hidden="true"
            >
              {status === "done" ? <Check className="w-3.5 h-3.5" /> : step.n}
            </span>
          );

          const label = (
            <span
              className={cn(
                "text-xs sm:text-sm whitespace-nowrap transition-smooth",
                status === "current" && "text-primary font-medium",
                status === "done" && "text-foreground",
                status === "future" && "text-muted-foreground/60",
              )}
            >
              {step.label}
            </span>
          );

          const body = (
            <span className="inline-flex items-center gap-2">
              {dot}
              <span className="hidden sm:inline">{label}</span>
            </span>
          );

          return (
            <li key={step.n} className="flex items-center gap-1 sm:gap-2 shrink-0">
              {clickable ? (
                <Link
                  to={href!}
                  aria-label={`${step.label} — مكتملة`}
                  aria-current={undefined}
                  className="rounded-full hover:opacity-80 transition-smooth focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {body}
                </Link>
              ) : (
                <span
                  aria-current={status === "current" ? "step" : undefined}
                  aria-disabled={status === "future"}
                  className={cn(status === "future" && "cursor-not-allowed")}
                >
                  {body}
                </span>
              )}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px w-4 sm:w-8 md:w-12",
                    step.n < currentStep ? "bg-accent/60" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default JourneyProgress;
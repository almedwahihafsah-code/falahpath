export const OrnamentalDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-4 my-8 ${className}`} aria-hidden="true">
    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-accent/40 to-transparent" />
    <svg width="20" height="20" viewBox="0 0 20 20" className="text-accent/60 shrink-0">
      <path
        d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
        fill="currentColor"
      />
    </svg>
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
  </div>
);

export default OrnamentalDivider;
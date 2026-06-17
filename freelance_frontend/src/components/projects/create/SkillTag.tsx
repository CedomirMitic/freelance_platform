// Reusable component for displaying a skill tag
interface SkillTagProps {
  name: string;
  onRemove?: (name: string) => void; 
  showRemove?: boolean; 
}

export default function SkillTag({ name, onRemove, showRemove }: SkillTagProps) {
  // Automatically show remove button if onRemove handler is passed, unless explicitly overridden
  const shouldShowRemove = showRemove !== undefined ? showRemove : !!onRemove;

  return (
    <span className="inline-flex items-center gap-1.5 bg-slate-100/80 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200/40 select-none animate-fade-in">
      {name}
      {shouldShowRemove && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(name)}
          className="text-slate-400 hover:text-rose-500 rounded-full transition-colors p-0.5 -mr-1 outline-none focus:ring-1 focus:ring-rose-500/20"
          aria-label={`Remove ${name} skill`}
        >
          {/* X ICON */}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </span>
  );
}
import Link from "next/link";

interface SectionHeaderProps {
  /** Section label — rendered as uppercase overline text */
  label: string;
  /** Optional action link on the right side */
  action?: { text: string; href: string };
}

/**
 * Styled section header with horizontal line.
 * Layout: [LABEL] ——————————————— [optional action link]
 *
 * - Label: 12px uppercase (text-overline), text-fg-tertiary
 * - Line: 1px border-border, fills remaining width
 * - Action: text-caption, text-accent, hover → text-accent-hover
 */
export function SectionHeader({ label, action }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <h2 className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-fg-tertiary">
        {label}
      </h2>
      <div className="h-px flex-1 bg-border" aria-hidden="true" />
      {action && (
        <Link
          href={action.href}
          className="shrink-0 text-[13px] font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
        >
          {action.text}
        </Link>
      )}
    </div>
  );
}

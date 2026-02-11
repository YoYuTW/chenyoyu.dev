export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-surface">
      <div className="mx-auto max-w-5xl px-8 py-12">
        {/* Name & Subtitle */}
        <div className="mb-6">
          <p className="text-xl font-semibold leading-snug text-foreground">
            YoYu Chen
          </p>
          <p className="mt-1 text-[15px] leading-relaxed text-fg-secondary">
            Problem Solver &amp; Software Engineer
          </p>
        </div>

        {/* Separator */}
        <hr className="border-t border-border" />

        {/* Links & Copyright */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/YoYuTW"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link text-[13px] font-medium text-fg-tertiary transition-colors duration-150 hover:text-accent"
            >
              GitHub
              <span className="external-link-arrow" aria-hidden="true">
                {" "}
                →
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/youyu-chen-25930b1b6/"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link text-[13px] font-medium text-fg-tertiary transition-colors duration-150 hover:text-accent"
            >
              LinkedIn
              <span className="external-link-arrow" aria-hidden="true">
                {" "}
                →
              </span>
            </a>
          </div>

          <p className="text-[13px] font-medium text-fg-tertiary">
            © {new Date().getFullYear()} YoYu Chen
          </p>
        </div>
      </div>
    </footer>
  );
}

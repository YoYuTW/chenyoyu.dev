export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} YoYu Chen. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/YoYuTW"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/youyu-chen-25930b1b6/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

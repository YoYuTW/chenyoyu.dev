"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Client-side wrapper for next-themes ThemeProvider.
 * Extracted into a separate client component so that layout.tsx
 * can remain a Server Component.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

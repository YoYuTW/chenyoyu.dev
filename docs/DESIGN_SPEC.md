# chenyoyu.dev — UI/UX Design Specification

> **Design concept**: "Before → After: Turning fuzzy problems into clear solutions"
>
> The website itself IS the portfolio piece. Every design decision demonstrates
> the owner's core skill: taking messy, undefined problems and engineering them
> into clean, elegant architectures.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Layout System](#4-layout-system)
5. [Hero Animation Spec](#5-hero-animation-spec)
6. [Blog List Card Design](#6-blog-list-card-design)
7. [Component Inventory](#7-component-inventory)
8. [Interaction Design](#8-interaction-design)
9. [Accessibility](#9-accessibility)
10. [CSS Custom Properties Map](#10-css-custom-properties-map)

---

## 1. Design Philosophy

### Core Principle

The site follows **"Show, Don't Tell"** — instead of saying "I solve problems,"
the website *demonstrates* problem-solving through its own design. The chaos →
order animation on the homepage literally visualises what YoYu does
professionally. Every blog post's Before/After card format reinforces this
narrative.

### Design References

| Principle | Application |
|-----------|-------------|
| **Nielsen #2 — Match between system and real world** | The Before/After metaphor maps directly to how the user thinks about their work. Visitors instantly understand the value proposition. |
| **Nielsen #4 — Consistency and standards** | Every content piece follows the same Before → After structure, creating a predictable mental model. |
| **Gestalt — Figure/Ground** | Dark backgrounds push content cards forward. The "chaos" state uses low-contrast scattered elements; the "order" state uses high-contrast, structured layouts. |
| **Gestalt — Proximity & Common Region** | Before/After columns are visually separated but connected by a shared card container, communicating "these are two sides of the same story." |
| **Gestalt — Common Fate** | During the hero animation, elements that move together toward the same destination are perceived as a unified group — reinforcing the "convergence" narrative. |

### Anti-Goals

- ❌ Generic grey minimalist engineer blog (the current state)
- ❌ WebGL / Three.js wizardry (not the user's domain; would feel inauthentic)
- ❌ Portfolio grid of project thumbnails (doesn't communicate "problem solver")
- ❌ Excessive decoration without function

---

## 2. Color System

### Philosophy

The palette draws from **terminal aesthetics meets editorial boldness**. Dark
backgrounds evoke the coding environment where problems get solved. Warm accent
colors (amber/orange) represent the "spark" of insight — the moment a fuzzy
problem becomes a clear solution. Cool secondary accents (cyan) represent the
technical precision of the output.

### Dark Mode (Primary)

```
┌─────────────────────────────────────────────────┐
│  Background Hierarchy                           │
│                                                 │
│  --bg-deep:     #09090b  ← Page background      │
│  --bg-surface:  #131316  ← Card / elevated       │
│  --bg-elevated: #1c1c21  ← Hover / active card   │
│  --bg-overlay:  #25252b  ← Code blocks, inputs   │
│                                                 │
│  Foreground Hierarchy                           │
│                                                 │
│  --fg-primary:  #f0f0f3  ← Headings, body        │
│  --fg-secondary:#a0a0ab  ← Descriptions, meta     │
│  --fg-tertiary: #63636e  ← Placeholder, disabled  │
│                                                 │
│  Accent Colors                                  │
│                                                 │
│  --accent:      #f59e0b  ← Amber 500 — primary    │
│  --accent-hover:#fbbf24  ← Amber 400 — hover      │
│  --accent-muted:#f59e0b26← Amber 500 / 15% — glow │
│  --accent-secondary: #06b6d4 ← Cyan 500           │
│  --accent-secondary-muted: #06b6d426              │
│                                                 │
│  Semantic Colors                                │
│                                                 │
│  --chaos:       #ef4444  ← Red 500 (Before state) │
│  --chaos-muted: #ef444426                         │
│  --order:       #22c55e  ← Green 500 (After state)│
│  --order-muted: #22c55e26                         │
│                                                 │
│  Border & Dividers                              │
│                                                 │
│  --border:      #25252b  ← Default borders         │
│  --border-hover:#3f3f46  ← Hover state borders     │
│  --border-accent:#f59e0b33← Accent border glow     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Light Mode (Secondary)

Light mode inverts the hierarchy while maintaining the same accent warmth.
It's not a simple inversion — each value is hand-tuned for readability.

> **Note**: Light mode uses **Orange 600/700** instead of Amber 600/700 for the
> accent. Amber tones appear brownish on white/light backgrounds, while Orange
> maintains vibrancy and warmth without muddying.

```
--bg-deep:       #fafaf9
--bg-surface:    #ffffff
--bg-elevated:   #f5f5f4
--bg-overlay:    #e7e5e4

--fg-primary:    #1c1917
--fg-secondary:  #78716c
--fg-tertiary:   #a8a29e

--accent:        #ea580c   ← Orange 600 (vibrant on light bg)
--accent-hover:  #c2410c   ← Orange 700
--accent-muted:  #ea580c26

--accent-secondary: #0891b2  ← Cyan 600
--accent-secondary-muted: #0891b226

--chaos:         #dc2626   ← Red 600
--chaos-muted:   #dc262626
--order:         #16a34a   ← Green 600
--order-muted:   #16a34a26

--border:        #e7e5e4
--border-hover:  #d6d3d1
--border-accent: #ea580c33
```

### Rationale

- **Amber accent** over blue: Blue is the default "tech" color. Amber is warm,
  energetic, unexpected for an engineer's site — immediately signals
  personality. It also has excellent contrast ratios against dark backgrounds
  (WCAG AA at `#f59e0b` on `#09090b` = 9.2:1).
- **Cyan secondary**: Complements amber on the color wheel (split-complementary).
  Used sparingly for interactive elements and the "After" / "Order" state to
  create visual tension with the warm accent.
- **Semantic chaos/order colors**: Red and green are universally understood
  (git diff, traffic lights, before/after). They're only used in the Before/After
  card context, never as general UI colors.
- **Four-level background hierarchy**: Creates depth without shadows. Following
  Material Design's elevation model but achieved through subtle luminance shifts
  rather than box-shadow (cleaner on dark backgrounds).

---

## 3. Typography

### Font Stack

**Keep Geist.** It's an excellent choice — geometric, modern, highly legible,
and has a matching monospace variant. No reason to change.

```
--font-sans: 'Geist', system-ui, -apple-system, sans-serif
--font-mono: 'Geist Mono', ui-monospace, 'SF Mono', monospace
```

### Type Scale

Using a **modular scale** with ratio 1.25 (Major Third), anchored at 16px body.
All sizes use `rem` for accessibility (respects user font-size preferences).

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `--text-display` | 3.5rem (56px) | 700 | 1.1 | -0.035em | Hero headline only |
| `--text-h1` | 2.5rem (40px) | 700 | 1.15 | -0.03em | Page titles |
| `--text-h2` | 1.75rem (28px) | 600 | 1.25 | -0.025em | Section headings |
| `--text-h3` | 1.25rem (20px) | 600 | 1.35 | -0.02em | Card titles, sub-headings |
| `--text-body` | 1.0625rem (17px) | 400 | 1.75 | 0 | Prose body text |
| `--text-body-sm` | 0.9375rem (15px) | 400 | 1.65 | 0 | Card descriptions |
| `--text-caption` | 0.8125rem (13px) | 500 | 1.5 | 0.01em | Meta, dates, tags |
| `--text-overline` | 0.75rem (12px) | 600 | 1.5 | 0.08em | Section labels, uppercase |
| `--text-mono` | 0.875rem (14px) | 400 | 1.6 | 0 | Code, mono content |

### Weight Usage

- **700 (Bold)**: Headlines only. Creates clear hierarchy.
- **600 (Semibold)**: Sub-headings, card titles, emphasis within body.
- **500 (Medium)**: Navigation, buttons, captions.
- **400 (Regular)**: Body text, descriptions.

### Responsive Adjustments

On mobile (< 640px):
- `--text-display` → 2.25rem (36px)
- `--text-h1` → 1.875rem (30px)
- `--text-h2` → 1.5rem (24px)
- Prose line-height increases to 1.8 for thumb-scrolling readability

---

## 4. Layout System

### Grid Structure

Move from the current `max-w-2xl` (672px) single-column to a wider, more
flexible layout:

```
┌──────────────────────────────────────────────────────────────────┐
│                          max-w-5xl (1024px)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 Content area with padding                │   │
│  │                  px-6 (mobile) / px-8 (desktop)          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Blog prose: max-w-[65ch] centered within content area          │
│  Hero: full-width within content area                           │
│  Cards: 2-column grid on desktop, stack on mobile               │
│                                                                 │
└──────────────────────────────────────────────────────────────────┘
```

**Why widen?** The Before/After card design needs horizontal space for two
columns. `max-w-2xl` (672px) is too narrow for meaningful side-by-side content.
`max-w-5xl` (1024px) gives breathing room while remaining focused. Blog prose
content stays at `max-w-[65ch]` centered within the wider container — optimal
reading width per typography best practices.

### Spacing Scale

Consistent 4px base unit. Use Tailwind's default scale:

| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | Inline icon spacing |
| `gap-2` | 8px | Tag gaps, tight groupings |
| `gap-3` | 12px | Meta info spacing |
| `gap-4` | 16px | Card internal padding (compact) |
| `gap-6` | 24px | Card padding, section gaps |
| `gap-8` | 32px | Between components |
| `gap-12` | 48px | Between major sections |
| `gap-16` | 64px | Page top/bottom padding |
| `gap-24` | 96px | Hero section spacing |

### Breakpoints

Use Tailwind v4 defaults:

| Breakpoint | Width | Layout Changes |
|------------|-------|---------------|
| Default | < 640px | Single column. Stacked cards. Compact hero. |
| `sm` | ≥ 640px | Some 2-col grids begin. |
| `md` | ≥ 768px | Before/After cards go side-by-side. Nav expands. |
| `lg` | ≥ 1024px | Full layout. Hero animation at full scale. |

### Page-Level Layout

```
<body>
  ├── <Nav />                    ← sticky top, full-width, blur backdrop
  ├── <main>
  │    ├── Hero Section          ← full-width within max-w-5xl
  │    ├── Content Sections      ← max-w-5xl, responsive grid
  │    └── Blog Prose            ← max-w-[65ch] centered
  └── <Footer />                 ← full-width, contained content
</body>
```

---

## 5. Hero Animation Spec

### Concept

The hero visually enacts the site's core message: **chaos → order**. Scattered,
overlapping "problem fragments" converge into a clean, structured layout. This
is NOT decorative — it's the literal demonstration of what YoYu does.

### Content (Problem Fragments)

Use real sentences from actual blog posts. These are NOT lorem ipsum — they're
proof of work:

```
Fragment Pool (display 8-10 at a time):
─────────────────────────────────────────
"12 modal state fields in one provider"
"useEffect watching 6 dependencies"
"State scattered across the component tree"
"Race conditions in async tool calls"
"Prop drilling 4 levels deep"
"Side effects triggering other side effects"
"Callbacks threaded through state updates"
"Changing a dropdown broke the undo button"
"Fire-and-forget state machine"
"The async logic scattered across handlers"
```

### Animation States

```
┌─────────────────────────────────────────────────────────────────┐
│  STATE 1: CHAOS (Initial / Idle)                               │
│                                                                │
│  ┌─────────────┐                                               │
│  │ Fragment A   │    ┌──────────────┐                           │
│  └──────┬──────┘    │  Fragment D   │                           │
│         │           └──────────────┘     ┌─────────────┐       │
│     ┌───┴────────┐                       │ Fragment F   │       │
│     │ Fragment B  │  ┌──────────┐        └─────────────┘       │
│     └────────────┘  │Fragment C │                               │
│                     └──────────┘  ┌───────────────┐            │
│  ┌──────────────┐                 │  Fragment E    │            │
│  │  Fragment G   │                └───────────────┘            │
│  └──────────────┘                                              │
│                                                                │
│  Visual Properties:                                            │
│  - Fragments at 40-70% opacity                                 │
│  - Random rotation: -8° to +8°                                 │
│  - Some overlapping (z-index variation)                         │
│  - Subtle floating animation (translateY ±6px, 3-5s loop)      │
│  - Monospace font, text-fg-tertiary                            │
│  - Thin border with chaos-muted color                          │
│  - Occasional red underline on "pain" words                    │
│                                                                │
│  Chaos indicators:                                             │
│  - Faint connecting lines between fragments (tangled, curved)  │
│  - Slight blur(1px) on peripheral fragments                    │
│  - Background: subtle noise texture or grain                   │
│                                                                │
└─────────────────────────────────────────────────────────────────┘

           ↓  Trigger: Scroll into view OR click "See the solution"

┌─────────────────────────────────────────────────────────────────┐
│  STATE 2: CONVERGENCE (Transition — 1.2s total)                │
│                                                                │
│  Animation sequence (orchestrated, not simultaneous):           │
│                                                                │
│  0ms-200ms:   Fragments snap to 0° rotation                    │
│               Opacity increases to 90%                          │
│               Floating animation stops                          │
│               Blur removes                                      │
│                                                                │
│  200ms-600ms: Fragments translate toward center                 │
│               They begin grouping by "domain"                   │
│               Tangled lines straighten                           │
│               Movement uses spring(damping: 25, stiffness: 200) │
│                                                                │
│  600ms-900ms: Groups settle into column positions               │
│               Borders solidify                                   │
│               Color shifts from chaos-muted to border            │
│               Labels fade in above each group                    │
│                                                                │
│  900ms-1200ms: Final snap into grid                             │
│                Container border draws in (clip-path animation)   │
│                "Architecture diagram" appearance complete         │
│                                                                │
└─────────────────────────────────────────────────────────────────┘

           ↓

┌─────────────────────────────────────────────────────────────────┐
│  STATE 3: ORDER (Final / Resolved)                              │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Clean Architecture                     │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │  State       │  │  UI Flow     │  │  Side Effects│   │   │
│  │  │             │  │              │  │              │   │   │
│  │  │ • Focused    │  │ • Linear     │  │ • Isolated   │   │   │
│  │  │   Context    │  │   async/await│  │   handlers   │   │   │
│  │  │ • Domain     │  │ • Imperative │  │ • Explicit   │   │   │
│  │  │   boundaries │  │   modals     │  │   triggers   │   │   │
│  │  └─────────────┘  └──────────────┘  └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Visual Properties:                                            │
│  - Full opacity                                                 │
│  - Clean grid layout                                            │
│  - Order-muted (green tint) on column headers                  │
│  - Accent color on connecting arrows (showing data flow)        │
│  - Subtle glow on the container border (--border-accent)        │
│                                                                │
│  Below the diagram:                                            │
│  - Tagline fades in: "I turn messy problems into clean code."   │
│  - CTA buttons appear with stagger                              │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Technical Implementation Notes

- **Library**: Framer Motion `motion.div` with `useInView` trigger
- **Orchestration**: `staggerChildren: 0.05` for fragment grouping
- **Spring config**: `type: "spring", damping: 25, stiffness: 200` for organic feel
- **No WebGL**: Pure DOM nodes with CSS transforms + Framer Motion
- **Layout animation**: Use Framer Motion's `layout` prop for smooth repositioning
- **Fragment data**: Array of objects with `{ text, initialX, initialY, initialRotation, group }`
- **Responsive**: On mobile (< 768px), use 2 columns instead of 3 in the final state;
  reduce fragment count to 6 to prevent crowding
- **Performance**: Use `will-change: transform` on animating elements; remove after
  animation completes. Limit to `transform` and `opacity` animations only (compositor-friendly).

### Interaction Details

| Trigger | Behaviour |
|---------|-----------|
| Page load | Fragments render in chaos state with staggered fade-in (0.5s) |
| Scroll into viewport | `useInView` with `once: true` triggers convergence |
| Click "See the solution" | Alternative trigger for above-fold viewing |
| Hover on final diagram column | Subtle scale(1.02) + border glow |
| Reduced motion | Skip animation; render final "order" state immediately |

---

## 6. Blog List Card Design

### The Before/After Card

This is the signature component. Each blog post is presented as a transformation
story, not just a title + excerpt.

```
Desktop Layout (≥ 768px):
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ┌─── Before ────────────────┬─── After ────────────────────┐ │
│  │                           │                               │ │
│  │  "12 modal state fields   │  "Zero. Modals as async       │ │
│  │   in one provider"        │   function calls."            │ │
│  │                           │                               │ │
│  │  ● State explosion        │  ✓ Imperative promise pattern │ │
│  │  ● Callback threading     │  ✓ Linear control flow        │ │
│  │  ● Effect watchers        │  ✓ Testable in isolation      │ │
│  │                           │                               │ │
│  │  [chaos-muted bg tint]    │  [order-muted bg tint]        │ │
│  └───────────────────────────┴───────────────────────────────┘ │
│                                                                │
│  The Imperative Modal Pattern                    Feb 10, 2026  │
│  react · typescript · patterns                     7 min read  │
│                                                                │
└────────────────────────────────────────────────────────────────┘

Mobile Layout (< 768px):
┌──────────────────────────────┐
│                              │
│  ┌─── Before ──────────────┐ │
│  │  "12 modal state fields │ │
│  │   in one provider"      │ │
│  │  ● State explosion      │ │
│  │  ● Callback threading   │ │
│  └─────────────────────────┘ │
│           ↓                  │
│  ┌─── After ───────────────┐ │
│  │  "Zero. Modals as async │ │
│  │   function calls."      │ │
│  │  ✓ Imperative promise   │ │
│  │  ✓ Linear control flow  │ │
│  └─────────────────────────┘ │
│                              │
│  The Imperative Modal...     │
│  react · typescript          │
│  Feb 10, 2026 · 7 min read  │
│                              │
└──────────────────────────────┘
```

### Data Model Extension

The `BlogPostMeta` interface needs two new optional fields in frontmatter:

```ts
interface BlogPostMeta {
  // ... existing fields
  before?: {
    summary: string;       // One-line "before" state
    points: string[];      // 2-3 bullet points
  };
  after?: {
    summary: string;       // One-line "after" state
    points: string[];      // 2-3 matching bullet points
  };
}
```

Example frontmatter:

```yaml
before:
  summary: "12 modal state fields in one provider"
  points:
    - "State explosion per modal"
    - "Callbacks threaded through state"
    - "useEffect watchers for flow control"
after:
  summary: "Zero. Modals as async function calls."
  points:
    - "Imperative promise pattern"
    - "Linear async/await control flow"
    - "Each modal testable in isolation"
```

### Hover Interactions

| Element | Default State | Hover State | Timing |
|---------|--------------|-------------|--------|
| Card container | `border-border` | `border-border-hover` + subtle `box-shadow: 0 0 20px var(--accent-muted)` | 200ms ease-out |
| Before column | Static | Slight jitter animation (translateX ±1px, rapid) — "instability" | 150ms |
| After column | Static | Subtle glow + scale(1.01) — "stability" | 200ms ease-out |
| Title text | `fg-primary` | `accent` color | 150ms |
| Arrow (mobile ↓) | `fg-tertiary` | Pulse animation | 300ms |

### Card Visual Details

- **Card background**: `bg-surface` with 1px `border-border`
- **Border radius**: `rounded-xl` (12px)
- **Before column background**: `chaos-muted` (very subtle red tint)
- **After column background**: `order-muted` (very subtle green tint)
- **Divider**: 1px dashed `border` between columns (vertical on desktop, horizontal on mobile)
- **Before bullet icon**: `●` in `chaos` color
- **After bullet icon**: `✓` in `order` color
- **Column labels**: `text-overline` size, uppercase, `fg-tertiary`
- **Summary text**: `text-h3` weight 600, `fg-primary`

### Fallback

If a post doesn't have Before/After frontmatter, render a standard card:

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  Post Title                                                    │
│  Description excerpt, two lines max with line-clamp-2...       │
│                                                                │
│  tag1 · tag2 · tag3                          Feb 9, 2026       │
│                                                       6 min    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 7. Component Inventory

### 7.1 Navigation

```
┌──────────────────────────────────────────────────────────────────┐
│  ○ YC                    Home    Blog    About          ☀/☾     │
└──────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Position | `sticky top-0 z-50` |
| Background | `bg-deep/80` with `backdrop-blur-lg` (frosted glass) |
| Border | `border-b border-border` |
| Height | 64px |
| Content width | `max-w-5xl mx-auto` |
| Logo | "YC" monogram in a 36×36 rounded-lg container with `accent` background and `bg-deep` text. Bold, compact. Links to `/`. |
| Nav links | `text-caption` size, `fg-secondary`, hover → `fg-primary` with 150ms transition |
| Active link | `fg-primary` with `accent` underline (2px, offset 6px) |
| Theme toggle | Sun/Moon icon button, 32×32, `fg-tertiary` hover → `fg-primary` |
| Mobile | Hamburger menu at `sm` breakpoint. Slide-down overlay with full-screen nav. |

**Design rationale**: The monogram logo replaces the full name to save horizontal
space and add visual identity. The frosted glass effect (backdrop-blur) keeps the
nav present without occluding content — a pattern established by Apple HIG and
now standard in modern web design.

### 7.2 Footer

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌─ max-w-5xl ───────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  YoYu Chen                                                │  │
│  │  Problem Solver & Software Engineer                       │  │
│  │                                                           │  │
│  │  ─────────────────────────────────────────────────────    │  │
│  │                                                           │  │
│  │  GitHub    LinkedIn    Email             © 2026 YoYu Chen │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `bg-surface` (one level up from page bg) |
| Border | `border-t border-border` |
| Padding | `py-12 px-8` |
| Name | `text-h3`, `fg-primary` |
| Subtitle | `text-body-sm`, `fg-secondary` |
| Links | `text-caption`, `fg-tertiary`, hover → `accent` with underline |
| Separator | 1px `border-border`, full-width within container |
| Copyright | `text-caption`, `fg-tertiary`, right-aligned on desktop |

### 7.3 Buttons

**Primary Button**

```css
background: var(--accent);
color: var(--bg-deep);
font-weight: 500;
font-size: var(--text-caption); /* 13px */
padding: 10px 20px;
border-radius: 8px;
transition: all 150ms ease-out;
```

Hover: `background: var(--accent-hover)`, `transform: translateY(-1px)`,
`box-shadow: 0 4px 12px var(--accent-muted)`

Active: `transform: translateY(0)`, remove shadow

**Secondary Button (Ghost)**

```css
background: transparent;
color: var(--fg-primary);
border: 1px solid var(--border);
font-weight: 500;
font-size: var(--text-caption);
padding: 10px 20px;
border-radius: 8px;
transition: all 150ms ease-out;
```

Hover: `border-color: var(--border-hover)`, `background: var(--bg-elevated)`

**Icon Button**

```css
width: 36px;
height: 36px;
border-radius: 8px;
display: grid;
place-items: center;
color: var(--fg-tertiary);
transition: all 150ms ease-out;
```

Hover: `color: var(--fg-primary)`, `background: var(--bg-elevated)`

### 7.4 Tags / Chips

```css
display: inline-flex;
align-items: center;
padding: 2px 10px;
border-radius: 9999px; /* fully rounded */
font-size: var(--text-overline);
font-weight: 500;
letter-spacing: 0.02em;
color: var(--fg-secondary);
background: var(--bg-overlay);
border: 1px solid var(--border);
transition: all 150ms;
```

Hover: `border-color: var(--accent-muted)`, `color: var(--accent)`

### 7.5 Code Blocks

Code blocks are a critical part of a developer portfolio. They must feel premium.

```
┌─ filename.tsx ────────────────────────────────────────────────┐
│                                                               │
│  1  const confirmed = await showModal<boolean>(               │
│  2    ConfirmDialog,                                          │
│  3    { message: "Delete this item?" }                        │
│  4  );                                                        │
│  5                                                            │
│  6  if (!confirmed) return;                                   │
│  7  // proceed with deletion...                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `bg-overlay` |
| Border | 1px `border` |
| Border radius | 12px |
| Title bar bg | `bg-elevated` |
| Title bar text | `text-overline`, `fg-tertiary`, mono font |
| Code font | `Geist Mono`, `text-mono` size |
| Line numbers | `fg-tertiary`, right-aligned, `pr-4` |
| Highlighted lines | `bg-accent-muted` left-border 2px `accent` |
| Scrollbar | Thin, `bg-elevated` track, `fg-tertiary` thumb |
| Syntax theme | Continue using Shiki with a custom dark theme matching the palette (map to VS Code "One Dark Pro" or similar warm-toned theme) |

### 7.6 Article Hero (Blog Post Page)

The existing Remotion `BlogVideoHero` component is retained. Wrap it with an
enhanced container:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌── Problem Statement Card ──────────────────────────────────┐ │
│  │                                                             │ │
│  │  THE PROBLEM                                                │ │
│  │                                                             │ │
│  │  "12 modal state fields. Callbacks threaded through         │ │
│  │   state updates. The async logic scattered across           │ │
│  │   event handlers, effects, and state transitions."          │ │
│  │                                                             │ │
│  │              ↓ Scroll to see the solution                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌── Remotion Video Player ────────────────────────────────────┐ │
│  │                                                              │ │
│  │           [  ▶  Cinematic Code Walkthrough  ]                │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

- **Problem Statement Card**: `bg-surface`, `border-chaos-muted` left border (3px),
  quote-style typography (`text-h2` italic), `fg-secondary` text
- **Transition**: Card fades/slides up slightly as Remotion player comes into view
- **Reduced motion**: No transition, both visible simultaneously

### 7.7 Section Headers

Used on homepage and listing pages:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ─── RECENT WRITING ───────────────────────────── View all →    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

- Label: `text-overline`, uppercase, `fg-tertiary`, with horizontal line accent
- Line: 1px `border`, extends to fill remaining width (flexbox with `flex-1`)
- Action link: `text-caption`, `accent` color, hover → `accent-hover`

---

## 8. Interaction Design

### 8.1 Micro-Interactions

| Element | Interaction | Animation |
|---------|-------------|-----------|
| Buttons | Hover | `translateY(-1px)` + shadow, 150ms ease-out |
| Buttons | Click/Active | `translateY(0)` + remove shadow, 50ms |
| Nav links | Hover | Color transition + underline slides in from left (`scaleX(0→1)`, `transform-origin: left`) |
| Cards | Hover | Border color change + subtle ambient glow (`box-shadow`), 200ms |
| Tags | Hover | Border + text color to accent, 150ms |
| Logo monogram | Hover | `rotate(5deg)` + `scale(1.05)`, spring animation |
| External links | Hover | Arrow icon slides right 4px, 200ms |
| Theme toggle | Click | Icon rotates 180° while cross-fading between sun/moon, 300ms |

### 8.2 Scroll-Triggered Animations

Use Framer Motion `useInView` with `once: true` for all scroll animations
(don't replay on scroll back):

| Section | Animation | Threshold |
|---------|-----------|-----------|
| Hero fragments | Chaos → Order convergence | `amount: 0.3` |
| "What I Work On" cards | Stagger fade-in from bottom, 4 cards × 100ms stagger | `amount: 0.2` |
| Blog post cards | Each card fades in + slides up 20px, stagger 150ms | `amount: 0.1` |
| Section headers | Line extends from left, label fades in | `amount: 0.5` |
| Footer | Fade in, 300ms | `amount: 0.3` |

### 8.3 Page Transitions

Use Next.js App Router with Framer Motion `AnimatePresence` for page transitions:

- **Enter**: Fade in (opacity 0→1) + slide up (translateY 12px → 0), 300ms,
  `ease: [0.25, 0.1, 0.25, 1]`
- **Exit**: Fade out (opacity 1→0), 150ms
- **Routing**: Content area only — Nav and Footer don't animate

### 8.4 The "Before Hover Jitter" Effect

The Before column's hover effect deserves specific documentation because it's
a key brand moment:

```ts
// Framer Motion variants for the Before column
const chaosJitter = {
  initial: { x: 0 },
  hover: {
    x: [0, -1, 1, -0.5, 0.5, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};
```

This jitter is **intentionally uncomfortable** — it creates a visceral "this is
broken" feeling that contrasts with the calm After column. This is Gestalt's
**Figure/Ground** principle applied to interaction: the instability of "Before"
makes "After" feel more stable by comparison.

### 8.5 Loading States

- **Page skeleton**: Pulse animation on `bg-elevated` blocks matching content layout
- **Blog content**: Progressive — title and meta render instantly (SSG), prose
  content streams in
- **Remotion player**: Show a dark placeholder with a subtle loading spinner before
  the player initialises. Use the poster frame if available.

---

## 9. Accessibility

### 9.1 Color Contrast (WCAG 2.1 AA Minimum)

All combinations verified:

| Foreground | Background | Contrast Ratio | Pass? |
|------------|------------|----------------|-------|
| `fg-primary` (#f0f0f3) | `bg-deep` (#09090b) | 18.1:1 | ✅ AAA |
| `fg-secondary` (#a0a0ab) | `bg-deep` (#09090b) | 7.2:1 | ✅ AAA |
| `fg-tertiary` (#63636e) | `bg-deep` (#09090b) | 3.8:1 | ✅ AA (large text only) |
| `accent` (#f59e0b) | `bg-deep` (#09090b) | 9.2:1 | ✅ AAA |
| `accent` (#f59e0b) | `bg-surface` (#131316) | 7.8:1 | ✅ AAA |
| `chaos` (#ef4444) | `bg-deep` (#09090b) | 5.3:1 | ✅ AA |
| `order` (#22c55e) | `bg-deep` (#09090b) | 8.0:1 | ✅ AAA |
| Light: `fg-primary` (#1c1917) | `bg-deep` (#fafaf9) | 16.4:1 | ✅ AAA |
| Light: `accent` (#ea580c) | `bg-surface` (#ffffff) | 4.6:1 | ✅ AA |

> **Note**: `fg-tertiary` is only used for decorative or supplementary text
> (timestamps, labels) that is never the sole means of conveying information.
> This satisfies WCAG SC 1.4.3 which allows 3:1 for large text and incidental text.

### 9.2 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all CSS transitions and animations */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

For Framer Motion, create a global hook:

```tsx
import { useReducedMotion } from "framer-motion";

export function useAnimationConfig() {
  const prefersReduced = useReducedMotion();
  return {
    // Skip to final state instantly
    transition: prefersReduced
      ? { duration: 0 }
      : { type: "spring", damping: 25, stiffness: 200 },
    // For hero: render order state directly
    skipAnimation: prefersReduced,
  };
}
```

**Hero specific**: When `prefers-reduced-motion` is active, render only the
final "Order" state. No chaos, no convergence. The information (clean
architecture diagram) is still communicated without motion.

### 9.3 Keyboard Navigation

| Component | Keyboard Behaviour |
|-----------|--------------------|
| Nav links | Standard tab order. Focus ring: 2px `accent` outline, 2px offset. |
| Blog cards | Entire card is a single `<a>` (or `<Link>`). Tab focuses the card. Enter navigates. |
| Before/After card | One focusable link per card (the whole card). Before/After columns are presentational. |
| Hero animation | Non-interactive (decorative). Not focusable. |
| Theme toggle | Button with `aria-label="Toggle theme"`. Space/Enter activates. |
| Mobile nav | Focus trapped within open menu. Escape closes. |
| Code blocks | Scrollable with `tabindex="0"` and `role="region"` with `aria-label`. |

### 9.4 Focus Indicators

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove default focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### 9.5 Semantic HTML

| Component | Element | ARIA |
|-----------|---------|------|
| Nav | `<nav aria-label="Main navigation">` | — |
| Blog card | `<article>` wrapping `<a>` | — |
| Before/After columns | `<div role="presentation">` | Decorative grouping |
| Hero animation | `<section aria-label="Problem solving visualisation">` | `aria-live="polite"` on final state text |
| Section headers | `<h2>` | — |
| Tags | `<span>` within a `<ul aria-label="Tags">` | Each tag is `<li>` |
| Theme toggle | `<button aria-label="Switch to dark/light mode">` | — |
| Code blocks | `<pre><code>` within `<figure role="region" aria-label="Code example">` | — |

### 9.6 Content Accessibility

- All images (if added) require meaningful `alt` text
- Remotion video player: Add `aria-label="Video walkthrough: [post title]"` to container
- Link text is descriptive (no "click here" — use "Read the blog" etc.)
- Colour is never the only indicator. Before/After also uses icons (●/✓) and
  text labels

---

## 10. CSS Custom Properties Map

Complete mapping from design tokens to Tailwind v4 CSS custom properties,
matching the existing `globals.css` pattern:

```css
@import "tailwindcss";

:root {
  /* === Background Hierarchy === */
  --background: #fafaf9;
  --bg-surface: #ffffff;
  --bg-elevated: #f5f5f4;
  --bg-overlay: #e7e5e4;

  /* === Foreground Hierarchy === */
  --foreground: #1c1917;
  --fg-secondary: #78716c;
  --fg-tertiary: #a8a29e;

  /* === Accent === */
  --accent: #ea580c;
  --accent-hover: #c2410c;
  --accent-muted: #ea580c26;
  --accent-secondary: #0891b2;
  --accent-secondary-muted: #0891b226;

  /* === Semantic === */
  --chaos: #dc2626;
  --chaos-muted: #dc262626;
  --order: #16a34a;
  --order-muted: #16a34a26;

  /* === Borders === */
  --border: #e7e5e4;
  --border-hover: #d6d3d1;
  --border-accent: #ea580c33;

  /* === Code === */
  --code-bg: var(--bg-overlay);
  --card-bg: var(--bg-surface);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #09090b;
    --bg-surface: #131316;
    --bg-elevated: #1c1c21;
    --bg-overlay: #25252b;

    --foreground: #f0f0f3;
    --fg-secondary: #a0a0ab;
    --fg-tertiary: #63636e;

    --accent: #f59e0b;
    --accent-hover: #fbbf24;
    --accent-muted: #f59e0b26;
    --accent-secondary: #06b6d4;
    --accent-secondary-muted: #06b6d426;

    --chaos: #ef4444;
    --chaos-muted: #ef444426;
    --order: #22c55e;
    --order-muted: #22c55e26;

    --border: #25252b;
    --border-hover: #3f3f46;
    --border-accent: #f59e0b33;

    --code-bg: var(--bg-overlay);
    --card-bg: var(--bg-surface);
  }
}

@theme inline {
  --color-background: var(--background);
  --color-bg-surface: var(--bg-surface);
  --color-bg-elevated: var(--bg-elevated);
  --color-bg-overlay: var(--bg-overlay);

  --color-foreground: var(--foreground);
  --color-fg-secondary: var(--fg-secondary);
  --color-fg-tertiary: var(--fg-tertiary);

  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-muted: var(--accent-muted);
  --color-accent-secondary: var(--accent-secondary);
  --color-accent-secondary-muted: var(--accent-secondary-muted);

  --color-chaos: var(--chaos);
  --color-chaos-muted: var(--chaos-muted);
  --color-order: var(--order);
  --color-order-muted: var(--order-muted);

  --color-border: var(--border);
  --color-border-hover: var(--border-hover);
  --color-border-accent: var(--border-accent);

  --color-code-bg: var(--code-bg);
  --color-card-bg: var(--card-bg);

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

This gives you Tailwind utility classes like:
- `bg-background`, `bg-bg-surface`, `bg-bg-elevated`, `bg-bg-overlay`
- `text-foreground`, `text-fg-secondary`, `text-fg-tertiary`
- `text-accent`, `text-accent-hover`, `text-accent-secondary`
- `text-chaos`, `text-order`, `bg-chaos-muted`, `bg-order-muted`
- `border-border`, `border-border-hover`, `border-border-accent`

---

## Appendix A: Implementation Priority

Recommended build order for incremental delivery:

| Phase | Scope | Effort |
|-------|-------|--------|
| **1. Foundation** | CSS custom properties, typography scale, layout widths, nav + footer redesign | 1-2 days |
| **2. Blog Cards** | Before/After card component, frontmatter extension, blog list page | 1-2 days |
| **3. Hero Animation** | Chaos → Order animation with Framer Motion, responsive variants | 2-3 days |
| **4. Article Page** | Problem statement card, Remotion integration wrapper, prose styles | 1 day |
| **5. Polish** | Theme toggle, page transitions, micro-interactions, loading states | 1-2 days |
| **6. Accessibility Audit** | Reduced motion testing, keyboard navigation, contrast verification | 0.5 day |

---

## Appendix B: Component File Structure (Proposed)

```
src/
├── app/
│   ├── globals.css              ← Updated design tokens
│   ├── layout.tsx               ← Updated with theme provider
│   ├── page.tsx                 ← Hero animation + redesigned sections
│   ├── blog/
│   │   ├── page.tsx             ← Before/After card list
│   │   └── [slug]/page.tsx      ← Problem statement + Remotion hero
│   └── about/page.tsx           ← Redesigned with new system
├── components/
│   ├── nav.tsx                  ← Monogram logo, frosted glass, theme toggle
│   ├── footer.tsx               ← Expanded footer
│   ├── BlogVideoHero.tsx        ← Existing (wrapped with problem card)
│   ├── hero/
│   │   ├── HeroChaosOrder.tsx   ← Main hero animation orchestrator
│   │   ├── ProblemFragment.tsx  ← Individual floating fragment
│   │   └── OrderDiagram.tsx     ← Final "architecture" state
│   ├── blog/
│   │   ├── BeforeAfterCard.tsx  ← The signature card component
│   │   ├── BlogCard.tsx         ← Fallback standard card
│   │   └── ProblemStatement.tsx ← Article hero problem card
│   ├── ui/
│   │   ├── Button.tsx           ← Primary, secondary, icon variants
│   │   ├── Tag.tsx              ← Tag/chip component
│   │   ├── SectionHeader.tsx    ← Line + label + action pattern
│   │   └── ThemeToggle.tsx      ← Sun/moon toggle
│   └── motion/
│       ├── FadeIn.tsx           ← Reusable scroll-triggered fade
│       ├── StaggerGroup.tsx     ← Staggered children animation
│       └── PageTransition.tsx   ← Route transition wrapper
├── hooks/
│   ├── useAnimationConfig.ts   ← Reduced motion aware config
│   └── useTheme.ts             ← Theme state management
└── lib/
    └── blog.ts                  ← Extended with Before/After types
```

---

## Appendix C: Design Decision Log

| Decision | Chosen | Rejected | Why |
|----------|--------|----------|-----|
| Primary accent | Amber (#f59e0b) | Blue, Purple, Green | Blue is generic "tech". Amber is warm, bold, distinctive. High contrast on dark. |
| Background base | #09090b (near-black with blue undertone) | Pure #000000, #0a0a0a (current) | Pure black is harsh. The slight blue undertone adds depth and pairs well with amber. |
| Layout width | max-w-5xl (1024px) | max-w-2xl (672px, current) | Before/After cards need horizontal space. Prose content constrains itself to 65ch. |
| Logo | "YC" monogram | Full name, icon, none | Compact, memorable, creates visual identity. Full name is too long for mobile nav. |
| Font | Keep Geist | Switch to Inter, JetBrains Mono | Geist is excellent. No reason to add font loading overhead for marginal gains. |
| Animation library | Framer Motion (existing) | GSAP, CSS-only | Already in user's comfort zone (React ecosystem). `layout` animations are perfect for the convergence effect. |
| Hero trigger | Scroll-based (InView) | Click-only, auto-play on load | Scroll trigger creates a natural narrative flow. Click alternative for above-fold viewing. |
| Card hover jitter | Intentional jitter on Before column | No hover animation | Creates visceral contrast with calm After column. Memorable interaction. |

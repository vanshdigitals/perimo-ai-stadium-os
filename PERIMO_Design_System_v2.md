# PERIMO Design System v2

**An AI-Powered Stadium Operations & Tournament Intelligence Platform**

---

## 1. Design Philosophy

The PERIMO design system is built for high-stakes, time-sensitive operational environments. Every decision is governed by four core psychological and accessibility principles:

1. **Processing Fluency:** The brain interprets "easy to perceive" as "true and safe." Typography, color, and spacing are optimized for the lowest possible cognitive load. Operators and frontline staff work under pressure; the interface must not demand decoding.
2. **Color-in-Context:** Color meaning is relative. PERIMO uses color functionally (status, hierarchy, alerts) rather than decoratively. A color's role is strictly defined by its context.
3. **Gestalt Grouping:** The visual system completes simple shapes faster than complex ones. The design relies on consistent visual grammar—unified icon weights, predictable spacing, and clear boundaries—so users can scan dense data effortlessly.
4. **Absolute Accessibility:** WCAG 2.1/2.2 compliance is a hard baseline, not a post-launch aspiration. A stadium operation product that fails a colorblind security officer or low-vision fan is a safety failure. Every color pairing and type size clears strict contrast minimums.

---

## 2. Brand Identity

### Mission & Vision

**Mission:** Give every person inside a mass gathering—fan, operator, volunteer, or first responder—the same real-time clarity about where to go, what’s happening, and what to do next.
**Vision:** To become the trust layer that live events, transit hubs, and public infrastructure run on when large numbers of people need to move and stay safe.
**Brand Promise:** *"Nobody finds out too late."*

### Brand Values

- **Clarity over cleverness:** AI outputs are short, plain, and actionable.
- **Calm under load:** The interface simplifies as crowd size and stress increase.
- **Human authority, always:** The system recommends; a human decides and acts.
- **Trust through restraint:** Color, motion, and alerts are used sparingly enough that when they appear, people believe them.

### Voice & Tone

**Precise, calm, unembellished.** Short sentences. Active voice. No exclamation points in operational contexts. The voice reads like a senior operator on a radio who has done this a thousand times. Tone flatness is a safety feature; a uniformly calm voice makes genuine critical alerts stand out by contrast.

---

## 3. Design Tokens

Inspired by the precision of Apple, the data density of Stripe, the flatness of Linear, and the clarity of OpenAI.

### 3.1 Color System

Color is pre-attentive. It provides triage before a single word is read. Status is never conveyed by hue alone; it is always paired with distinct iconography or text.

```css
/* BACKGROUNDS & SURFACES */
--color-bg-light:       #F7F8FA  /* Off-white reduces OLED halation */
--color-bg-dark:        #0A0E14  /* Deep off-black reduces eye fatigue */
--color-surface-light:  #FFFFFF  /* Elevated cards in light mode */
--color-surface-dark:   #141822  /* Elevated cards in dark mode */

/* BORDERS */
--color-border-light:   #E2E5EA  /* Low-contrast structural dividers */
--color-border-dark:    #232838
--color-border-interactive-light: #8A93A6  /* 3:1 WCAG minimum for inputs */
--color-border-interactive-dark:  #6B7488

/* TEXT */
--color-text-primary-light:   #101828
--color-text-primary-dark:    #F5F7FA
--color-text-secondary-light: #5B6472  /* Meets AA contrast */
--color-text-secondary-dark:  #9AA3B2
--color-disabled-light:       #A9AFBC
--color-disabled-dark:        #4B5563

/* SEMANTIC & BRAND */
--color-primary:        #1652F0  /* Trustworthy blue-violet. Primary actions. */
--color-secondary:      #0A1F44  /* Navy. Headers, heavy UI chrome. */
--color-accent:         #6B4EFF  /* Indigo. AI-generated and predictive content. */
--color-info:           #0B72D8  /* Neutral informational states. */
--color-success:        #157A45  /* Deep green. Resolved states. */
--color-warning:        #D68A00  /* Amber. Elevated but non-critical alerts. */
--color-danger:         #C4291C  /* Muted brick red. Life-safety / emergency. */
```

### 3.2 Typography

A highly disciplined two-family system that balances distinctive brand personality with extreme legibility.

```css
--font-brand:    'Space Grotesk', sans-serif  /* Brand, Hero Display, Logotype */
--font-ui:       'Inter', sans-serif          /* UI, Body, Dashboards, Buttons */
--font-numeric:  'IBM Plex Mono', monospace   /* Live metrics, Timestamps, Tables */
```

- **Space Grotesk (500–700):** Used exclusively for top-level headers and brand moments. Technical and engineered.
- **Inter (400–600):** The workhorse. Purpose-built for screens with a tall x-height. Dense UI and everyday reading.
- **IBM Plex Mono (400–500):** Monospaced tabular numerals are mandatory for live counts, timers, and data grids. Prevents visual "jitter" when values update.

### 3.3 Grid & Spacing

All spacing is built on an **8px grid**. A 4px half-step is permitted strictly for dense table cells or icon-to-label gaps.

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-7: 48px
--space-8: 64px
--space-9: 96px
```

### 3.4 Radius & Elevation

Flat, restrained, low-opacity shadows. Depth is achieved primarily through 1px borders and subtle background shifts.

```css
--radius-sm: 4px      /* Inputs, small controls, chips */
--radius-md: 8px      /* Buttons, internal components */
--radius-lg: 12px     /* Cards, dropdowns */
--radius-xl: 16px     /* Modals, large surface panels */
--radius-pill: 999px  /* Badges, status tags */

--elevation-0: none                                  /* Flat surface */
--elevation-1: 0 1px 2px rgba(10, 14, 20, 0.06)      /* Cards, resting state */
--elevation-2: 0 4px 12px rgba(10, 14, 20, 0.10)     /* Hover states, dropdowns */
--elevation-3: 0 12px 32px rgba(10, 14, 20, 0.16)    /* Modals, critical alerts */
```

### 3.5 Animation & Motion Tokens

Motion is purposeful, brief, and tied to operational reality. Easing is crisp (ease-out), never bouncy or playful.

```css
--motion-fast:   150ms ease-out       /* Micro-interactions, hover states, toggles */
--motion-base:   250ms ease-out       /* Modal open, page transitions */
--motion-slow:   600ms ease-in-out    /* Initial load sweeps, large layout shifts */
--motion-pulse:  2000ms ease-in-out   /* Looped live-alert indicator (70bpm) */
```

*Note: All looping motion MUST respect `prefers-reduced-motion` by falling back to static states.*

### 3.6 Iconography

**System: Lucide**

- **Grid:** 24x24 strict.
- **Stroke Weight:** 2px. Matches the visual weight of the logotype and border radius logic.
- **Scale:** `16px` (inline), `20px` (buttons), `24px` (navigation), `32px` (empty states/hero).
- **Rule:** Monocolor only. Never use duotone or filled variants unless signifying an active toggle state.

---

## 4. Component Library

### 4.1 Layout & Navigation

- **Sidebar Guidelines:** Fixed left, collapsible to icon-only. 256px expanded, 72px collapsed. Uses `--color-surface` with a 1px right `--color-border`. Active state indicated by a subtle `--color-primary` background tint (10% opacity) and left-edge accent bar.
- **Navigation Rules:** Flat hierarchy. Avoid deep nesting. Top navbar is reserved for global context (Stadium Selector, Search, User Profile, Live System Status).

### 4.2 Cards

- **Anatomy:** 1px border (`--color-border`), `--radius-lg`, `--elevation-1`. Background is always `--color-surface`.
- **States:** Hover elevates to `--elevation-2`.
- **Content:** Header (optional icon, title in Inter Semibold), Body (Inter Regular), Footer (actions/metadata). Never use colored borders to indicate status; use an internal status badge or a 4px left-edge color accent.

### 4.3 Tables (Data Grids)

- **Density:** Highly compact for operational views. `--space-2` (8px) cell padding vertically, `--space-3` (12px) horizontally.
- **Typography:** Column headers are uppercase, 12px, Inter Semibold, `--color-text-secondary`. All numeric data uses IBM Plex Mono.
- **Interactivity:** Hovering a row applies a 4% opacity primary overlay. Active rows receive a 1px primary border outline.

### 4.4 Charts & Data Visualization

- **Aesthetics:** Minimalist. No background grid lines (horizontal ticks only). No 3D effects.
- **Colors:** Use a strict categorical order: Primary Blue → Indigo → Teal → Amber. Do not randomize.
- **Tooltips:** `--elevation-2` styling, dark mode forced for high contrast overlay readability. Numeric values use IBM Plex Mono.

### 4.5 Forms & Inputs

- **Inputs:** `--radius-sm`, 1.5px `--color-border-interactive`.
- **Focus State:** Border changes to `--color-primary` with a 2px outer ring (20% opacity). Never rely on color alone for focus.
- **Validation:** Inline validation only. Error states change border to `--color-danger` and display a Lucide `<AlertCircle>` icon with explanatory text.

### 4.6 Modals

- **Structure:** `--radius-xl`, `--elevation-3`, centered overlay with a 40% opacity black backdrop + 4px background blur.
- **Actions:** Primary action aligned right, secondary action (Cancel) aligned left of primary.
- **Widths:** 400px (Confirmations), 600px (Standard Forms), 900px (Complex configurations).

### 4.7 States (Empty & Loading)

- **Empty States:** Center-aligned. Lucide icon (32px, `--color-text-secondary`), Title (18px, Inter Semibold), Description (14px, max-width 400px), optional single CTA.
- **Loading States:** Prefer skeletal loaders over spinners for layout stability. Skeletons should pulse gently (`--motion-pulse`). For blocking actions, use a 20px Lucide `<Loader2>` icon with `--motion-fast` linear rotation.

### 4.8 Notifications & Alerts

- **Toasts:** Bottom-right placement. `--radius-md`, `--elevation-2`. Auto-dismiss after 4000ms unless classified as Danger.
- **Inline Banners:** Used for page-level context. `--radius-md`, 1px border matching the alert severity. Background is 5% opacity of the severity color. Always include a distinct Lucide icon (e.g., `<Info>`, `<AlertTriangle>`, `<CheckCircle>`).

### 4.9 AI & Predictive Cards

- **Designation:** Any AI-generated insight, prediction, or recommended action MUST be visually distinct.
- **Styling:** Use a 3px left-edge border in `--color-accent` (Indigo).
- **Labeling:** Include a small badge with a Lucide `<Sparkles>` icon reading "AI Prediction" or "System Suggestion" in `--color-text-secondary`. Transparency is a hard trust requirement.

### 4.10 Maps & Digital Twins

- **Base Map:** Desaturated, monochrome base layer (grays/dark navy). Street and POI labels are minimized.
- **Data Layers:** Live operational data is the only high-saturation element on the map.
- **Routing:** `--color-primary` for active paths, `--color-text-secondary` for alternative paths, `--color-danger` reserved strictly for blocked/emergency routes.
- **Digital Twin:** 3D stadium assets should be rendered with flat, unlit shaders (architectural style, not photorealistic gaming style). Interactive zones use subtle pulsing opacities.

### 4.11 Accessibility Components

- **Focus Rings:** Universal 2px primary outer ring on keyboard focus for all interactive elements.
- **Screen Reader Only (sr-only):** Utility classes baked into all icon-only buttons and complex visualizations to ensure alt-text is always present.
- **Contrast Toggle:** High-contrast mode overrides subtle background tints with pure black/white and thickens all borders to 2px.

---

## 5. Responsive & Theme Rules

### 5.1 Light vs. Dark Mode

- **First-Class Citizens:** Dark mode is not an afterthought; it is critical for low-light control rooms and night operations.
- **Elevation inversion:** In light mode, elevation relies heavily on drop shadows (`rgba(10,14,20,0.1)`). In dark mode, shadows are less visible, so elevation relies on surface lightening (e.g., a card is `#141822` against a `#0A0E14` background) and a 1px subtle top-border highlight (`rgba(255,255,255,0.05)`).

### 5.2 Breakpoints & Layout

- **Mobile (`< 768px`):** Single column. Sidebar collapses to a bottom tab bar or hamburger menu. Data tables convert to card-lists.
- **Tablet (`768px - 1024px`):** Sidebar defaults to collapsed (icon-only, 72px).
- **Desktop (`1024px - 1440px`):** Sidebar expanded. Standard dashboard layout.
- **Ultrawide (`> 1440px`):** Max container width caps at 1440px for operations views to prevent line-length reading fatigue. Maps and Digital Twins may break out to full-bleed.

---

*This system is a living document. It trades decorative flair for extreme operational clarity, ensuring that at a 90,000-person event, PERIMO remains the calmest voice in the room.*

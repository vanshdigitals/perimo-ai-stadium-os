# 12 · Accessibility Guide — Fan Experience

Target **WCAG 2.1 AA** (aspire AAA on emergency/ticket). Matches patterns already used across PERIMO (`focus-visible` rings, `aria-label`, `useReducedMotion`).

## Keyboard
- All interactive elements reachable and operable by keyboard; logical tab order (DOM order = visual order).
- Bottom-sheet / modal: focus trap while open, `Esc` closes, focus returns to trigger.
- Bottom bar and FAB are real `<button>`/`<a>`; skip-to-content link at app root.
- No keyboard traps; custom widgets (map, tabs, chips) implement roving tabindex + arrow keys.

## ARIA & semantics
- Semantic landmarks: `<header> <nav> <main> <footer>`, one `<h1>` per screen, logical headings.
- `aria-label` on icon-only buttons (bell, FAB, mic, QR); `aria-current="page"` on active nav.
- Tabs: `role="tablist"/"tab"/"tabpanel"` + `aria-selected`. Live regions: score/emergency/toasts use `aria-live` (`polite` for status, `assertive` for emergency).
- Ticket status, order status announced via `aria-live`. Images have meaningful `alt` (or `alt=""` if decorative).

## Contrast
- Body/interactive text ≥ 4.5:1; large text ≥ 3:1; focus ring ≥ 3:1 against adjacent colors.
- Never color-only: status uses text + icon/shape (reuse `StatusPill` pattern). Verify dark + light.
- **High-contrast mode** setting (Settings) boosts borders/contrast; respect OS `prefers-contrast`.

## Reduced motion
- All `framer-motion` entrance/float/parallax gated by `useReducedMotion` (already the codebase norm).
- `motion-safe:` / `motion-reduce:` for CSS animations (ping/pulse). No motion-only meaning.

## Focus management
- Visible `focus-visible:ring-2` on every focusable element.
- Route change → move focus to the new screen's `<h1>` (announce navigation).
- Sheets/modals manage focus in/out; toasts do not steal focus.

## Touch & target sizing
- Min target 44×44 (emergency actions ≥ 96px). Adequate spacing between tappables.
- Gestures have non-gesture alternatives (e.g. map has list view).

## Screen-reader test matrix
- [ ] VoiceOver (iOS/Safari), TalkBack (Android/Chrome), NVDA (desktop)
- [ ] ticket, emergency, navigation, home fully operable and announced
- [ ] live score/emergency updates announced without focus loss

## Language & i18n
- `<html lang>` follows selected language; RTL-ready layout (logical properties); 20+ languages (reuse `AppContext` language + i18n layer).

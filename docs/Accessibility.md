# PERIMO Accessibility Guide

This document outlines the accessibility engineering standards, reusable patterns, and development rules for the PERIMO AI Stadium OS. It ensures the project remains usable, scalable, and production-ready for all users.

## 1. Standards Followed
- **WCAG 2.1 AA**: All new components and features must comply with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
- **WAI-ARIA 1.2**: ARIA attributes are used strictly to enhance semantic HTML, never as a replacement for it.
- **Semantic HTML5**: Native HTML elements (`<button>`, `<nav>`, `<main>`, `<dialog>`) are preferred over `<div>` or `<span>` wrappers.

## 2. Reusable Patterns

### Accessible Dialog / Modal
Modals must trap focus while open, return focus to the trigger element when closed, and support the `Escape` key.
*Use the updated `Modal` component which includes `aria-modal="true"`, `role="dialog"`, and integrated focus management.*

### Accessible Interactive Elements
Never remove focus outlines without providing a visible alternative.
*Pattern:* Use `focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none` for custom focus states.

### Icon-Only Buttons
Icons must never be the only communication method.
*Pattern:* When using an icon-only button, always provide an `aria-label` describing the action (e.g., `aria-label="Close dialog"`).

### Reduced Motion
Respect system-level motion preferences for animations and transitions.
*Pattern:* Use Tailwind's `motion-reduce:` variants on elements with transitions/animations.

## 3. Accessibility Checklist

### Navigation
- [ ] Keyboard navigation works everywhere (Tab, Shift+Tab, Enter, Space, Escape, Arrows).
- [ ] Focus is trapped inside dialogs, modals, and slide-overs.
- [ ] A "Skip to main content" link exists for keyboard users.
- [ ] No generic `outline-none` exists without a `focus-visible` fallback.

### Forms & Interactions
- [ ] Every input has a linked `<label>` or an `aria-label`/`aria-labelledby`.
- [ ] Form validation errors are announced using `aria-live` or `aria-describedby`.
- [ ] Buttons and links have descriptive text (avoid "Click here" or "Read more").

### Media & Colors
- [ ] All meaningful images have descriptive `alt` text.
- [ ] Decorative images have `alt=""` or `role="presentation"`.
- [ ] Text contrast meets at least 4.5:1 (WCAG AA) in Light, Dark, Hover, Focus, and Disabled states.
- [ ] Color is never the sole method of conveying status (combine with icons/labels).

## 4. Future Development Rules
1. **Inherit, Don't Rebuild**: Use the core `AccessibleButton`, `AccessibleInput`, and `Modal` components instead of building custom interactive elements from scratch.
2. **Test with Screen Readers**: Verify new flows using NVDA, JAWS, VoiceOver, or TalkBack. Structure markup correctly even if automated testing passes.
3. **Responsive Zoom**: Components must remain usable and avoid horizontal scrolling when the browser is zoomed up to 200%.
4. **Performance Consideration**: Accessibility must not reduce performance. Avoid complex JavaScript focus managers when native HTML attributes (like `tabIndex` and `autofocus`) suffice.

---
name: uiuxreviewthis
description: Run a UI/UX review on FilterForge using design intelligence from ui-ux-pro-max. Checks accessibility, layout, interaction, typography, color, animation, forms, and navigation.
user_invocable: true
argument-hint: "[page or component to review]"
---

# UI/UX Review This

Run a professional UI/UX review on FilterForge, applying design intelligence from [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

## Context

FilterForge is a **dark-themed, single-page web app** (vanilla HTML/CSS/JS) for building Diablo II: Project D2 loot filters. Key UI areas:
- **Wizard modal** — multi-step form for building a filter
- **Rule Builder** — left sidebar with chips/dropdowns to build individual rules
- **Generated Rule** — panel above editor showing the built rule with insert buttons
- **Code Editor** — textarea with line numbers for editing filter code
- **Live Preview** — shows how items look in-game with the current filter
- **Import/Export/Templates** — file operations and community filter loading

Tech stack: Vanilla JS, CSS custom properties, no framework. Files:
- `editor.html` — all HTML
- `css/editor.css` — all styles
- `js/editor.js` — all logic

## Review Process

### Step 1: Read the Current UI

Read the target files before reviewing:
- `editor.html` — layout structure, modals, forms
- `css/editor.css` — styling, spacing, colors, responsive
- `js/editor.js` — only interaction-relevant parts (event handlers, focus management)

If the user specified a specific page/component, focus the review there. Otherwise review the full app.

### Step 2: Run Checklist by Priority

Apply these checks in priority order. For each issue found, note the **file, line, rule violated, and a concrete fix**.

#### Priority 1: Accessibility (CRITICAL)

- [ ] Color contrast: minimum 4.5:1 for text, 3:1 for large text
- [ ] Focus states: visible focus rings (2-4px) on all interactive elements
- [ ] Aria labels: icon-only buttons must have aria-label
- [ ] Keyboard navigation: tab order matches visual order, all actions keyboard-accessible
- [ ] Form labels: every input has a visible `<label>` with `for` attribute
- [ ] Heading hierarchy: sequential h1-h6, no level skips
- [ ] Color not only: don't convey info by color alone (add icon/text)
- [ ] Reduced motion: respect `prefers-reduced-motion`
- [ ] Escape routes: modals have close button, Escape key closes them

#### Priority 2: Touch & Interaction (CRITICAL)

- [ ] Touch targets: minimum 44x44px for clickable elements
- [ ] Touch spacing: minimum 8px gap between touch targets
- [ ] Loading feedback: buttons disabled during async, show spinner/progress
- [ ] Error feedback: clear error messages near the problem
- [ ] Cursor pointer: clickable elements have `cursor: pointer`

#### Priority 3: Layout & Responsive (HIGH)

- [ ] Viewport meta: `width=device-width, initial-scale=1`
- [ ] No horizontal scroll on mobile
- [ ] Readable font size: minimum 16px body text on mobile
- [ ] Container widths: consistent max-width on desktop
- [ ] Z-index management: layered scale, not random values
- [ ] Fixed elements: navbar/toolbars reserve safe padding for content

#### Priority 4: Typography & Color (MEDIUM)

- [ ] Line height: 1.5-1.75 for body text
- [ ] Font scale: consistent type scale
- [ ] Semantic color tokens: using CSS custom properties, not raw hex in components
- [ ] Dark mode: desaturated/lighter tonal variants, tested contrast
- [ ] Whitespace balance: intentional grouping and separation

#### Priority 5: Animation (MEDIUM)

- [ ] Duration: 150-300ms for micro-interactions
- [ ] Transform performance: only `transform`/`opacity`, not `width`/`height`
- [ ] Loading states: skeleton or progress indicator when loading >300ms
- [ ] Reduced motion support

#### Priority 6: Forms & Feedback (MEDIUM)

- [ ] Input labels: visible label per input (not placeholder-only)
- [ ] Error placement: errors below related field
- [ ] Required indicators: mark required fields
- [ ] Empty states: helpful message when no content
- [ ] Toast/notification dismiss: auto-dismiss in 3-5s
- [ ] Confirmation: confirm before destructive actions
- [ ] Disabled states: reduced opacity + cursor change
- [ ] Multi-step progress: wizard shows step indicator

#### Priority 7: Navigation (HIGH)

- [ ] Active state: current tab/section visually highlighted
- [ ] Modal escape: close affordance + Escape key + click outside
- [ ] State preservation: navigating between tabs preserves state
- [ ] Back behavior: predictable and consistent

### Step 3: Score and Report

Present findings as:

```
## UI/UX Review: [Component/Page]

### Score: X/10

### Critical Issues (must fix)
1. [Issue] — [File:Line] — [Rule violated] — [Fix]

### High Priority
1. [Issue] — [File:Line] — [Rule violated] — [Fix]

### Medium Priority
1. [Issue] — [File:Line] — [Rule violated] — [Fix]

### Good Practices Found
- [What's already done well]

### Quick Wins
- [Small changes with big impact]
```

### Step 4: Ask Before Fixing

After presenting the report, ask the user which issues they want fixed. Present options:
1. Fix all critical issues
2. Fix critical + high priority
3. Fix everything
4. Let me pick specific ones

Then implement the chosen fixes, committing each one individually.

## Style Guide for This Project

FilterForge uses a dark gaming aesthetic. When suggesting fixes, respect:

- **Dark theme**: `--bg-primary: #0d1117`, `--bg-secondary: #161b22`, accents in gold/amber
- **Fonts**: `Exocet` for item names (game font), monospace for code, system sans-serif for UI
- **Game aesthetic**: This is a Diablo II tool — dark, moody, functional. Not corporate SaaS.
- **No frameworks**: Vanilla CSS only. No Tailwind, no shadcn. Use CSS custom properties.
- **Audience**: Gamers who want fast, functional UI. Not design-conscious consumers.

## Anti-Patterns to Flag

- Buttons without visible text or aria-label
- Inputs using only placeholder as label
- Modal without keyboard escape
- Interactive elements smaller than 44px
- Color-only state indication (e.g. red for error with no icon/text)
- Truncated text without tooltip or overflow handling
- Nested scrollbars
- Z-index wars (random high values)
- Animations that block interaction
- Missing loading states on async operations
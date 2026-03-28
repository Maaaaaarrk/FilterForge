---
name: fix-issues
description: Fetch all open GitHub issues, fix them, comment on each with the fix, then commit and push.
user_invocable: true
argument-hint: [--dry-run]
---

# Fix GitHub Issues

Fetch all open GitHub issues for the current repository, analyze and fix each one, reply to each issue with how it was fixed, then create a single commit and push.

## Important: When In Doubt, Ask

If you are **unsure** about any of the following, **stop and ask the user** by presenting numbered options:

1. **Ambiguous issue intent** — If an issue description is vague or could be interpreted multiple ways, present the possible interpretations and ask which one to pursue.
2. **Design decisions** — If a fix requires a subjective choice (e.g. what text/label to use, where to place a UI element, what threshold value to pick), present 2-3 options with brief pros/cons.
3. **Scope uncertainty** — If you're unsure whether a fix should be minimal (just what's asked) or broader (fix related issues too), ask.
4. **Breaking changes** — If a fix might break existing behavior or other features, flag it and ask before proceeding.
5. **Missing context** — If you need to understand game mechanics, filter syntax, or PD2-specific behavior to make the right call, ask rather than guess.

## Workflow

### Step 1: Gather Issues

Use `gh issue list --state open` to get all open issues. Then fetch full details for each with `gh issue view <number> --json title,body,number,comments`. Read all issues before starting any fixes.

### Step 2: Create Task List

Create a task for each issue using TaskCreate. This helps the user track progress.

### Step 3: Triage and Plan

Group issues by type:
- **Filter output bugs** — Issues with what `buildFilter()` generates in `js/editor.js`
- **Preview engine bugs** — Issues with the live preview matching/rendering in `js/editor.js`
- **UI/Layout issues** — Issues with HTML structure in `editor.html` or CSS in `css/editor.css`
- **Wizard issues** — Issues with the Build My Filter wizard steps or options

For each issue, locate the relevant code using Grep/Read before making changes. Never edit code you haven't read.

### Step 4: Fix Each Issue

Work through issues systematically. Mark each task as in_progress when starting and completed when done.

#### When editing filter output from buildFilter():

The generated filter should match community filter quality. Use these references for what is **worth showing vs hiding** at different strictness levels:

**Strictness tiers map to FILTLVL:**
- Relaxed (FILTLVL 0-1): Show almost everything
- Light (FILTLVL 2): Hide obvious junk (inferior items, low gold, small potions)
- Moderate (FILTLVL 3): Hide normal/exceptional non-magic, low-tier magic
- Strict (FILTLVL 4+): Only show items worth picking up in maps

**Community-tested hiding thresholds (from Wolfie, HiimFilter, Kryszard, Phyx10n):**
- Gold: Scale with CLVL (hide <25 always, <500 at CLVL>49, <5000 at CLVL>79)
- Potions: Hide small HP/MP at DIFF>0, all HP/MP at DIFF>1, keep rejuvs
- Scrolls/Keys: Hide at DIFF>0
- Gems: Hide chipped at DIFF>0, flawed at DIFF>0, normal at DIFF>1. Always show perfect
- Inferior items: Hide when CLVL>10
- Normal items: Hide at FILTLVL>1 (keep ETH/SUP/socketed)
- Exceptional items: Hide at FILTLVL>2
- Elite non-magic: Hide unsocketed at FILTLVL>3
- Magic items: Hide non-jewelry/charm at FILTLVL>3
- **Never hide**: Uniques, sets, rare jewelry, rare circlets, high-ilvl charms, eth elite bases

**Rune display tiers:**
- 28-33 (Lo-Zod): Full decoration + %BORDER% + sound — always show
- 24-27 (Ist-Ohm): Mid decoration + %MAP% + sound — always show
- 20-23 (Lem-Mal): Low decoration + %DOT% — always show
- 15-19 (Hel-Fal): Name only — show at FILTLVL<3
- 1-14 (El-Dol): Name only — show at FILTLVL<2

**Notification tiers:**
- %BORDER% + sound: High runes, boss uniques, DClone/Rathma items
- %MAP% + sound: Mid-high runes, GG uniques, unique charms
- %MAP%: Good uniques, good sets, perfect gems
- %DOT%: Mid runes, mid uniques, high-ilvl charms
- No notification: Everything else shown

**Class item shortnames** should only be generated when the user opted in (check `wantShortNames`).

**Unique name reveals** should only be generated when opted in (check `wantUniqueNames`), and the %CONTINUE% rules must come BEFORE the main unique/set display rules.

### Step 5: Commit Each Fix Individually

After fixing each issue, **immediately commit** that fix before moving to the next issue:

1. `git add` only the files changed for this issue
2. Create a commit with this format:

```
Fix #N: [short description]

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
```

This means each issue gets its own commit. Do NOT push yet — wait until all issues are fixed.

### Step 6: Push and Close Issues

After ALL issues in the batch are fixed and committed:

1. `git push` once to send all commits to the remote
2. For each issue, reply and close:
   - `gh issue comment <number> --body "Fixed in <commit-hash> — <brief description of fix>"`
   - `gh issue close <number> --reason completed`

## Key Files

- `js/editor.js` — Filter generation (`buildFilter()`), preview engine (`renderOutput`, `evaluateToken`, `matchItem`, `parseRules`), wizard logic (`initWizard`)
- `editor.html` — Wizard steps, preview dropdown, layout structure
- `css/editor.css` — All styling

## PD2 Filter Syntax Reference

```
ItemDisplay[CONDITIONS]: OUTPUT
```
- `%CONTINUE%` — Show this output AND keep processing further rules
- `%NAME%` — Base item name (unidentified shows base type)
- `%RUNENAME%`, `%RUNENUM%` — Rune name and number
- `%GEMTYPE%`, `%GEMLEVEL%` — Gem type name and quality level
- `%ILVL%`, `%ALVL%`, `%SOCKETS%`, `%DEF%`, `%ED%` — Item stats
- `{text}` — Description shown on hover
- `%NL%` — Newline in description, `%CL%` — Clear line
- Colors: `%WHITE%`, `%RED%`, `%GREEN%`, `%BLUE%`, `%GOLD%`, `%YELLOW%`, `%ORANGE%`, `%PURPLE%`, `%TAN%`, `%DARK_GREEN%`, `%TEAL%`, `%GRAY%`
- Notifications: `%BORDER-XX%`, `%MAP-XX%`, `%DOT-XX%`, `%SOUNDID-XXXX%`
- Conditions: `UNI`, `SET`, `RARE`, `MAG`, `NMAG`, `CRAFT`, `ETH`, `SUP`, `INF`, `ID`, `!ID`, `RW`, `NORM`, `EXC`, `ELT`, `GROUND`, item codes, `RUNE>N`, `ILVL>N`, `FILTLVL>N`, `DIFF>N`, `CLVL>N`, `SOCK=N`, `(A OR B)`
- `%%` — Literal percent sign
- `Alias[NAME]: value` — Define alias, expanded as find-and-replace

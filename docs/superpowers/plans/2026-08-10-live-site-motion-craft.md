# Live Site Motion Craft (9+) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the live site to a 9+ Emil Kowalski craft bar via a CSS-only motion token layer, site-wide non-negotiables, and three delight moments.

**Architecture:** Introduce `src/styles/motion.css` with shared easing/duration/press tokens and utilities. Remove `transition: all` tokens from `index.css`. Migrate chrome → home cinema → inner pages to property-specific transitions, hover gating, and reduced-motion. Wire quiz step enter, proof swap, and booking sheet open/close as the only delight moments.

**Tech Stack:** React 19, Vite, existing CSS modules (`index.css`, `chrome.css`, `home-cinema.css`, `pages-cinema.css`). No Motion/Framer. No new dependencies.

## Global Constraints

- Scope: `/`, `/programs`, `/about`, `/booking` + Navbar / BottomNav / Footer only.
- Do not modify `src/pages/HomeClassic.jsx` motion (out of scope).
- CSS-only motion — no new animation libraries; class toggles in JSX are allowed.
- Exactly three delight moments: path quiz step, proof quote/author swap, booking sheet.
- UI motion ≤ 300ms; booking sheet ≤ 280ms (`--duration-sheet`).
- Strong ease-out: `cubic-bezier(0.23, 1, 0.32, 1)`.
- No animated route / nav page transitions.
- No test runner in repo — verify with `npm run dev` + grep gates.
- Commits require git `user.name` / `user.email`; skip commit steps if identity is unset (leave changes staged or unstaged; do not run `git config`).

---

## File structure

| File | Responsibility |
|------|----------------|
| `src/styles/motion.css` | Tokens, `.motion-press`, hover-capable media helper notes, global reduced-motion |
| `src/index.css` | Import motion; delete `--transition` / `--transition-slow` `all`; neutralize interactive-card theater on live utilities |
| `src/styles/chrome.css` | Nav/footer/bottom-nav property-specific transitions + press on CTAs |
| `src/components/home/home-cinema.css` | Cinema buttons, quiz enter, proof swap transitions |
| `src/components/home/PathQuiz.jsx` | Keyed step/result remount for enter motion |
| `src/components/home/ProofFeatured.jsx` | Key author with review id; keep quote key |
| `src/styles/pages-cinema.css` | Booking sheet enter/exit; cinema-btn press; strip weak easings |
| `src/pages/Booking.jsx` | Closing-state so sheet can exit with CSS before unmount |

---

### Task 1: Motion foundation tokens

**Files:**
- Create: `src/styles/motion.css`
- Modify: `src/index.css`
- Test: grep gate (no test runner)

**Interfaces:**
- Produces: CSS custom properties `--ease-out`, `--ease-in-out`, `--duration-press`, `--duration-ui`, `--duration-sheet`, `--press-scale`; utility class `.motion-press`
- Consumes: nothing

- [ ] **Step 1: Create `src/styles/motion.css`**

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --duration-press: 160ms;
  --duration-ui: 200ms;
  --duration-sheet: 280ms;
  --press-scale: 0.97;
}

.motion-press {
  transition:
    transform var(--duration-press) var(--ease-out),
    background var(--duration-ui) ease,
    color var(--duration-ui) ease,
    border-color var(--duration-ui) ease;
}

.motion-press:active {
  transform: scale(var(--press-scale));
}

@media (prefers-reduced-motion: reduce) {
  .motion-press:active {
    transform: none;
  }

  .motion-enter,
  .proof-featured__quote,
  .proof-featured__author,
  .booking-sheet__dialog {
    animation: none !important;
    transition: opacity var(--duration-ui) ease !important;
    transform: none !important;
  }
}
```

- [ ] **Step 2: Import motion and remove `all` tokens in `src/index.css`**

At top of `src/index.css` (after any existing `@import` if present, otherwise first line):

```css
@import './styles/motion.css';
```

In `:root`, **delete**:

```css
--transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
--transition-slow: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
```

Replace call sites that referenced the deleted tokens with **property-specific** transitions. `.interactive-card`, `.animate-fade-in`, and `.glow-interact` are only used by `/home-classic` — keep their behavior working (no intentional classic redesign), but do not leave `transition: all` behind:

```css
a {
  text-decoration: none;
  color: inherit;
  transition: color var(--duration-ui) ease;
}

button {
  cursor: pointer;
  border: none;
  outline: none;
  font-family: inherit;
  transition:
    transform var(--duration-press) var(--ease-out),
    background var(--duration-ui) ease,
    color var(--duration-ui) ease,
    border-color var(--duration-ui) ease;
}

.interactive-card {
  transition:
    transform var(--duration-ui) var(--ease-out),
    box-shadow var(--duration-ui) ease,
    border-color var(--duration-ui) ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

/* Keep existing .interactive-card:hover lift/shadow for HomeClassic compatibility */

.interactive-card::after {
  /* keep shine styles; only fix transition property list */
  transition: left 0.7s var(--ease-out);
}

.btn-premium:hover {
  background: var(--secondary-color);
  box-shadow: var(--shadow-gold);
  transform: translateY(-2px);
}

.btn-premium:active {
  transform: scale(var(--press-scale));
}

.btn-gold:hover {
  background: var(--secondary-dark);
  box-shadow: 0 15px 35px rgba(217, 119, 6, 0.4);
  transform: translateY(-3px);
}

.highlight-serif::after {
  transition: width var(--duration-ui) var(--ease-out);
}

/* HomeClassic overrides .animate-fade-in in its own style tag — optional tighten: */
.animate-fade-in {
  animation: fadeInSlide 0.8s var(--ease-out) forwards;
}
```

Do **not** rely on live cinema pages using `.interactive-card` (they currently do not).

- [ ] **Step 3: Grep gate (fail if live CSS still has `all` tokens)**

Run:

```bash
rg "transition:\\s*all|--transition(?:-slow)?:\\s*all" src --glob "!**/HomeClassic.jsx"
```

Expected: no matches in `src/index.css`, `src/styles/**`, `src/components/home/**`. (`HomeClassic.jsx` may still match — ignore that file.)

- [ ] **Step 4: Manual check**

Run: `npm run dev`  
Open `/` — page should look unchanged aside from less floaty card hover if any legacy classes remain.

- [ ] **Step 5: Commit** (skip if git identity missing)

```bash
git add src/styles/motion.css src/index.css
git commit -m "feat(motion): add CSS motion tokens and remove transition all"
```

---

### Task 2: Chrome press + hover gate

**Files:**
- Modify: `src/styles/chrome.css`
- Modify: `src/components/Navbar.jsx` (add `motion-press` on CTA if className is set in JSX)
- Modify: `src/components/BottomNav.jsx` / `src/components/Footer.jsx` only if CTAs are buttons/links that need the class

**Interfaces:**
- Consumes: `.motion-press`, `--ease-out`, `--duration-press`, `--duration-ui` from Task 1
- Produces: chrome CTAs with press; hover lift only on fine pointers

- [ ] **Step 1: Update navbar CTA / footer CTA transitions in `chrome.css`**

Replace `.site-navbar__cta` transition/hover block with:

```css
.site-navbar__cta {
  /* keep existing non-motion declarations */
  transition:
    background var(--duration-ui) ease,
    transform var(--duration-press) var(--ease-out);
}

.site-navbar__cta:hover {
  background: #b45309;
  transform: none;
}

@media (hover: hover) and (pointer: fine) {
  .site-navbar__cta:hover {
    transform: translateY(-1px);
  }
}

.site-navbar__cta:active {
  transform: scale(var(--press-scale));
}
```

Apply the same press + hover-gate pattern to `.site-footer` CTA buttons and `.bottom-nav` actionable controls that currently use `transform: translateY(...)` on hover (search `transform:` in `chrome.css` and update each).

Nav **links** keep `transition: color var(--duration-ui) ease` only — no transform.

- [ ] **Step 2: Add `motion-press` class on primary chrome CTAs in JSX**

Example Navbar CTA:

```jsx
<button type="button" className="site-navbar__cta motion-press" onClick={...}>
```

Mirror on footer primary CTA if present.

- [ ] **Step 3: Manual check**

- Click nav Book CTA — should scale down briefly on press
- Hover on touch emulation should not leave a stuck lift
- Route changes remain instant (no page fade)

- [ ] **Step 4: Commit** (skip if identity missing)

```bash
git add src/styles/chrome.css src/components/Navbar.jsx src/components/BottomNav.jsx src/components/Footer.jsx
git commit -m "feat(motion): press feedback and hover gating on site chrome"
```

---

### Task 3: Home cinema buttons (non-negotiables)

**Files:**
- Modify: `src/components/home/home-cinema.css` (`.cinema-btn*` and path-quiz option buttons)

**Interfaces:**
- Consumes: motion tokens from Task 1
- Produces: cinema buttons + quiz chips with press; reduced hover lift

- [ ] **Step 1: Update `.cinema-btn` base + variants**

```css
.cinema-btn {
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  cursor: pointer;
  font-weight: 800;
  letter-spacing: 0.04em;
  transition:
    transform var(--duration-press) var(--ease-out),
    background var(--duration-ui) ease,
    color var(--duration-ui) ease,
    border-color var(--duration-ui) ease;
}

.cinema-btn:active {
  transform: scale(var(--press-scale));
}

.cinema-btn--primary:hover,
.cinema-btn--amber:hover,
.cinema-btn--ghost:hover,
.cinema-btn--soft:hover {
  transform: none;
}

@media (hover: hover) and (pointer: fine) {
  .cinema-btn--primary:hover,
  .cinema-btn--amber:hover,
  .cinema-btn--ghost:hover,
  .cinema-btn--soft:hover {
    transform: translateY(-1px);
  }

  .cinema-btn--primary:hover:active,
  .cinema-btn--amber:hover:active,
  .cinema-btn--ghost:hover:active,
  .cinema-btn--soft:hover:active {
    transform: scale(var(--press-scale));
  }
}
```

Keep each variant’s background/color hover colors as they are today; only change transform/transition rules.

- [ ] **Step 2: Path quiz option chips**

```css
.path-quiz__options button {
  /* keep visual styles */
  transition:
    background var(--duration-ui) ease,
    border-color var(--duration-ui) ease,
    transform var(--duration-press) var(--ease-out);
}

.path-quiz__options button:hover {
  background: rgba(217, 119, 6, 0.2);
  border-color: var(--cinema-amber);
  transform: none;
}

@media (hover: hover) and (pointer: fine) {
  .path-quiz__options button:hover {
    transform: translateY(-1px);
  }
}

.path-quiz__options button:active {
  transform: scale(var(--press-scale));
}
```

Also update `.proof-nav-btn` the same way (press + gated -1px hover).

- [ ] **Step 3: Manual check on `/`**

Press hero CTA, filmstrip book buttons, quiz chips — press scale present; no large float.

- [ ] **Step 4: Commit** (skip if identity missing)

```bash
git add src/components/home/home-cinema.css
git commit -m "feat(motion): cinema button press and restrained hover"
```

---

### Task 4: Delight — Path quiz step enter

**Files:**
- Modify: `src/components/home/PathQuiz.jsx`
- Modify: `src/components/home/home-cinema.css`

**Interfaces:**
- Consumes: `--duration-ui`, `--ease-out`
- Produces: keyed `.path-quiz__step` / `.path-quiz__result` with `.motion-enter`

- [ ] **Step 1: Key remount in `PathQuiz.jsx`**

```jsx
{quizStep <= 5 && step && (
  <div className="path-quiz__step motion-enter" key={quizStep}>
    <span className="path-quiz__eyebrow">{step.tag}</span>
    <h3>{step.question}</h3>
    <div className="path-quiz__options">
      {step.options.map((opt) => (
        <button key={opt.value} type="button" onClick={() => handleQuizNext(opt.key, opt.value)}>
          {opt.label}
        </button>
      ))}
    </div>
  </div>
)}

{quizStep === 6 && result && (
  <div className="path-quiz__result motion-enter" key="result">
    {/* existing result body unchanged */}
  </div>
)}
```

- [ ] **Step 2: Enter styles in `home-cinema.css`**

```css
.motion-enter {
  animation: motion-enter var(--duration-ui) var(--ease-out) both;
}

@keyframes motion-enter {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .motion-enter {
    animation: none;
  }
}
```

- [ ] **Step 3: Manual check**

Advance quiz steps quickly — each step eases in ~200ms; reduced-motion OS setting → instant.

- [ ] **Step 4: Commit** (skip if identity missing)

```bash
git add src/components/home/PathQuiz.jsx src/components/home/home-cinema.css
git commit -m "feat(motion): path quiz step enter transition"
```

---

### Task 5: Delight — Proof quote swap

**Files:**
- Modify: `src/components/home/home-cinema.css`
- Modify: `src/components/home/ProofFeatured.jsx`

**Interfaces:**
- Consumes: `--duration-ui`, `--ease-out`
- Produces: interruptible-feeling enter on quote/author via remount + short animation using tokens (replace weak `ease` / 0.35s)

- [ ] **Step 1: Key author with review id in `ProofFeatured.jsx`**

```jsx
<div className="proof-featured__viewer" aria-live="polite">
  <Stars count={active.stars} />
  <blockquote key={`q-${active.id}`} className="proof-featured__quote motion-enter">
    “{active.text}”
  </blockquote>
  <div key={`a-${active.id}`} className="proof-featured__author motion-enter">
    — {active.author} · {active.meta}
  </div>
</div>
```

Remove dependency on `.proof-featured__quote { animation: proof-fade ... }` specific rules.

- [ ] **Step 2: Remove old proof-fade keyframes usage**

In `home-cinema.css`, delete:

```css
animation: proof-fade 0.35s ease;
```

from quote/author, and delete `@keyframes proof-fade` if unused. Rely on shared `.motion-enter` from Task 4.

Keep existing `@media (prefers-reduced-motion: reduce)` block that clears proof animations / ticker focus; ensure it still covers `.motion-enter`.

- [ ] **Step 3: Manual check**

Spam ←/→ and drag scrub — quote updates with short enter; no 350ms sluggishness; reduced-motion disables movement.

- [ ] **Step 4: Commit** (skip if identity missing)

```bash
git add src/components/home/ProofFeatured.jsx src/components/home/home-cinema.css
git commit -m "feat(motion): proof featured quote swap enter"
```

---

### Task 6: Delight — Booking sheet + pages cinema sweep

**Files:**
- Modify: `src/pages/Booking.jsx`
- Modify: `src/styles/pages-cinema.css`

**Interfaces:**
- Consumes: `--duration-sheet`, `--ease-out`, `--press-scale`
- Produces: sheet enter/exit classes; pages `cinema-btn` aligned with home

- [ ] **Step 1: Closing state in `Booking.jsx`**

Near sheet state:

```jsx
const [sheetOpen, setSheetOpen] = useState(false);
const [sheetClosing, setSheetClosing] = useState(false);
```

Replace close helpers so they animate out:

```jsx
function closeSheet() {
  if (!sheetOpen || sheetClosing) return;
  setSheetClosing(true);
}

function handleSheetAnimationEnd(e) {
  if (e.target !== e.currentTarget) return;
  if (!sheetClosing) return;
  setSheetOpen(false);
  setSheetClosing(false);
}

function openSheet() {
  setSheetClosing(false);
  setSheetOpen(true);
}
```

Wire every current `setSheetOpen(false)` that means “user dismissed the sheet” through `closeSheet()` (backdrop, close button, Escape). Keep forced closes (path change) able to hard-reset:

```jsx
setSheetOpen(false);
setSheetClosing(false);
```

Render:

```jsx
{(sheetOpen || sheetClosing) && activePath === 'private' && (
  <BookingSheet
    /* existing props */
    closing={sheetClosing}
    onClose={closeSheet}
    onAnimationEnd={handleSheetAnimationEnd}
  />
)}
```

Pass `closing` / `onAnimationEnd` into the sheet component; on the dialog element:

```jsx
<div
  className={`booking-sheet__dialog${mode === 'message' ? ' booking-sheet__dialog--form' : ''}${closing ? ' is-closing' : ''}`}
  onAnimationEnd={onAnimationEnd}
  /* existing attrs */
>
```

- [ ] **Step 2: Sheet motion CSS in `pages-cinema.css`**

```css
.booking-sheet__dialog {
  /* keep layout styles */
  animation: booking-sheet-in var(--duration-sheet) var(--ease-out) both;
}

.booking-sheet__dialog.is-closing {
  animation: booking-sheet-out var(--duration-sheet) var(--ease-out) both;
}

@keyframes booking-sheet-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes booking-sheet-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(18px);
  }
}

@media (min-width: 901px) {
  .booking-sheet__dialog {
    animation-name: booking-sheet-in-center;
  }

  .booking-sheet__dialog.is-closing {
    animation-name: booking-sheet-out-center;
  }

  @keyframes booking-sheet-in-center {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes booking-sheet-out-center {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .booking-sheet__dialog,
  .booking-sheet__dialog.is-closing {
    animation: booking-sheet-fade var(--duration-ui) ease both;
  }

  @keyframes booking-sheet-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .booking-sheet__dialog.is-closing {
    animation-direction: reverse;
  }
}
```

- [ ] **Step 3: Align `pages-cinema.css` `.cinema-btn` with Task 3**

Duplicate the same press + hover-gate transition rules used in `home-cinema.css` for `.cinema-btn` definitions in `pages-cinema.css` (~line 685+) so `/programs`, `/about`, `/booking` match Home.

- [ ] **Step 4: Manual check**

- `/booking` open sheet → enter with ease-out ~280ms  
- Close → exits same vector then unmounts  
- Reduced-motion → opacity only  
- Programs/About CTAs press correctly

- [ ] **Step 5: Commit** (skip if identity missing)

```bash
git add src/pages/Booking.jsx src/styles/pages-cinema.css
git commit -m "feat(motion): booking sheet enter/exit and pages button craft"
```

---

### Task 7: Acceptance gate

**Files:**
- None required (verification only)
- Optional doc touch: set spec status to Implemented after pass

**Interfaces:**
- Consumes: all prior tasks

- [ ] **Step 1: Grep live surfaces**

```bash
rg "transition:\\s*all|--transition(?:-slow)?:\\s*all" src/styles src/components/home src/index.css
rg "transition:\\s*all" src/pages --glob "!**/HomeClassic.jsx"
```

Expected: zero matches.

- [ ] **Step 2: Manual matrix**

| Surface | Check |
|---------|--------|
| `/` hero + filmstrip CTAs | Press scale; hover ≤ -1px; fine-pointer only |
| Path quiz | Step enter ~200ms; chips press |
| Proof | Quote swap ~200ms; drag unchanged |
| Nav / bottom nav | No route animation; CTA press |
| `/programs` `/about` | CTA press |
| `/booking` sheet | Enter + exit same vector |
| OS reduced-motion | No translate/scale movement |

- [ ] **Step 3: Commit plan progress note** (optional; skip if identity missing)

```bash
git add docs/superpowers/specs/2026-08-10-live-site-motion-craft-design.md
git commit -m "docs: mark live-site motion craft design implemented"
```

(Only if you update the spec Status line to `Implemented`.)

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Motion tokens + remove `all` | Task 1 |
| `.motion-press` + reduced-motion base | Task 1 |
| Chrome press / hover gate / no route motion | Task 2 |
| Cinema CTA + quiz chip non-negotiables | Task 3 |
| Delight: quiz step | Task 4 |
| Delight: proof swap | Task 5 |
| Delight: booking sheet enter/exit | Task 6 |
| Inner pages button alignment | Task 6 |
| Acceptance grep + manual | Task 7 |
| Exclude `/home-classic` | Global Constraints |
| CSS-only / no library | Global Constraints |

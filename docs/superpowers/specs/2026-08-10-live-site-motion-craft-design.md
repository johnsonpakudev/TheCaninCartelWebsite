# Live Site Motion Craft (9+) Design

**Date:** 2026-08-10  
**Status:** Approved for spec  
**Goal:** Move the live site from ~6/10 to 9+ on Emil Kowalski’s design-engineering / animation craft bar.

## Locked decisions

| Decision | Choice |
|----------|--------|
| Scope | Whole live site: `/`, `/programs`, `/about`, `/booking` + nav/footer/bottom nav |
| Out of scope | `/home-classic` (leave as-is for this pass) |
| Personality | Premium marketing with a **small** delight budget |
| Implementation | **CSS-only** — no Motion/Framer or new animation libraries |
| Done means | Non-negotiables site-wide + 3 delight moments + durable token/rules layer |
| Approach | Token-first system, then migrate surfaces |

## Goal & success criteria

**Success (9+):** The live site feels responsive and intentional: press feedback on CTAs, no sluggish or decorative hover theater, durations/easing in budget, reduced-motion respected, and three occasional surfaces that animate with clear purpose.

**Measurable checks**
- No `transition: all` (or equivalent CSS variables that expand to `all`) on live surfaces
- UI motion ≤ 300ms except booking sheet (≤ 280–500ms sheet budget)
- Enter/exit UI uses strong ease-out: `cubic-bezier(0.23, 1, 0.32, 1)`
- Primary CTAs and quiz chips have `:active` press scale (~0.97)
- Hover motion gated behind `@media (hover: hover) and (pointer: fine)`
- `prefers-reduced-motion: reduce` drops movement; opacity/color may remain
- No animated route / nav chrome transitions
- Exactly three deliberate delight moments (quiz step, proof swap, booking sheet)

## Architecture

### Motion layer

Add a dedicated CSS module (preferred: `src/styles/motion.css`) imported once from the app entry (`src/index.css` or `src/main.jsx` / equivalent), containing:

**Tokens**
```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--duration-press: 160ms;
--duration-ui: 200ms;
--duration-sheet: 280ms;
--press-scale: 0.97;
```

**Remove**
- `--transition: all 0.4s …`
- `--transition-slow: all 0.7s …`

**Utilities / base rules**
- `.motion-press` — `:active { transform: scale(var(--press-scale)); }` with `transition: transform var(--duration-press) var(--ease-out)` (compose carefully with existing hover transforms)
- Hover lifts only inside `@media (hover: hover) and (pointer: fine)`; max near-imperceptible (`translateY(-1px)`) on chrome CTAs, or none
- Global reduced-motion block: disable transform-based movement and decorative animations; keep color/opacity feedback where useful

**Rules of use**
- Call sites must list exact properties (`transform`, `opacity`, `background`, `color`, `border-color`) — never `all`
- Animate `transform` / `opacity` for movement; color/background/border allowed for non-spatial feedback
- Prefer CSS transitions (interruptible) over keyframes for rapidly retriggered UI (proof swaps, quiz options)

### Files likely touched

| Area | Files |
|------|--------|
| Foundation | `src/styles/motion.css` (new), `src/index.css` |
| Chrome | `src/styles/chrome.css`, Navbar / BottomNav / Footer as needed |
| Home cinema | `src/components/home/home-cinema.css`, `PathQuiz.jsx`, `ProofFeatured.jsx` (classes only if needed) |
| Inner pages | `src/styles/pages-cinema.css`, Booking / Classes / Method styles |
| Explicitly not | `src/pages/HomeClassic.jsx` |

## Interactions & delight budget

### Non-negotiable (all live CTAs)

- Press feedback on primary/secondary buttons and path-quiz option chips
- Remove oversized card lifts (`translateY(-8px)`, scale-up hovers) and shine/sweep decorations on interactive cards
- Nav / bottom-nav: color/background feedback only; no enter/exit page animation

### Three delight moments

| Moment | Purpose | Frequency | Spec |
|--------|---------|-----------|------|
| Path quiz step change | Preventing jarring change | Occasional | Enter from `opacity: 0; transform: translateY(6px)` → settled; `var(--duration-ui)` + `var(--ease-out)`. **Primary:** re-mount or keyed step class so the transition retriggers; `@starting-style` optional enhancement where supported |
| Proof quote/author swap | State indication | Occasional | Same spatial recipe ~`200ms`; prefer transition over keyframe restart when practical; keep existing reduced-motion behavior |
| Booking sheet open/close | Spatial consistency / prevent jarring | Occasional | Enter with slight `translateY` + `scale(0.98)` (modal may stay centered); `var(--duration-sheet)` + `var(--ease-out)`; exit same vector; reduced-motion → opacity only |

### Explicitly no delight

- Nav / bottom-nav route changes
- Filmstrip scrub / progress
- Proof ticker drag / auto-advance physics (behavior unchanged from existing proof-drag design; only polish quote swap if needed)
- Infinite glow / shine loops
- Keyboard-initiated flows

## Migration order

1. **Foundation** — add motion tokens/utilities; delete `all` transition tokens; fix broken call sites
2. **Chrome** — property-specific transitions; press on CTAs; hover gate
3. **Home cinema** — cinema buttons, quiz, proof; wire delight #1–2
4. **Inner pages** — booking sheet delight #3; strip leftover slow/`all` motion on programs/about/booking
5. **Acceptance** — desktop + mobile; reduced-motion; rapid quiz/proof retrigger feels interruptible (not sticky)

## Non-goals

- Visual/brand/layout redesign
- Touching `/home-classic` motion debt
- Adding a JS motion library
- Animating route transitions
- Expanding delight beyond the three listed moments

## Acceptance / testing

- Manual: Home quiz steps, proof ←/→ and drag, open/close booking sheet, nav CTAs, programs/about CTAs
- Toggle OS reduced-motion: movement gone; site remains usable
- Touch device or emulator: no sticky hover lifts; press still works
- Grep gate: no `transition:\s*all` and no `--transition:` `all` tokens remaining under live CSS (excluding `HomeClassic`)

## Risks

- Hover + `:active` transform composition can fight; solve with clear base/hover/active transform rules on `.motion-press` targets
- Quiz enter: keyed step class is the compatibility path; do not depend on `@starting-style` alone
- Existing cinema/page CSS duplication: migrate call sites to tokens without forking a second easing vocabulary

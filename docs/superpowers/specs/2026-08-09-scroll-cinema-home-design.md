# Scroll-Cinema Home Redesign

**Date:** 2026-08-09  
**Status:** Approved for planning  
**Phase:** Home only (full-site rating program, phase 1 of delivery — Home before chrome/other pages)

## Goal

Ship a new scroll-cinema Home at `/` that raises layout, motion, and anti-slop quality versus the current Vite-template landing patterns, while preserving the existing Home at `/home-classic` for comparison and rollback.

This is an overhaul of Home IA and visual language (hybrid: cinematic photography + sharp Cartel typography), not a re-skin of the current tabbed layout.

## Context

Current Home (~5.5/10 against taste-skill criteria) uses:

- Tabbed Training Tiers (Puppy / Foundations / Advanced)
- Centered section headers and equal card grids (Blueprint, Pack’s Voice)
- Inset hero image with floating review overlay
- Material Symbols decorative usage and pravatar social-proof strip
- Light/dark section hopping without a unified surface story

Later phases (out of scope here): design system + chrome, Programs/Method, Booking.

## Routing

| Path | Page |
|------|------|
| `/` | New scroll-cinema Home |
| `/home-classic` | Current Home preserved unchanged |

Nav “Home” continues to point at `/`. A classic link is optional and not required for v1.

## Must keep / can cut

**Must keep (restaged):**

- Booking CTAs
- Program discovery for the three tiers
- Social proof (reviews)
- Path quiz diagnostic + book/learn outcomes

**Can cut or omit on new Home:**

- Blueprint three-card grid
- Regions block (unless a one-line Sydney signal is added later)
- Tabbed tiers UI
- Floating review pill on hero
- Pravatar avatar strip
- Decorative Material icon wallpaper

## Page narrative (top → bottom)

1. **Hero** — Full-bleed photography; brand + one headline + one primary CTA; no overlay cards or review pills.
2. **Programs filmstrip** — Vertical scroll drives horizontal progress through Puppy → Foundations → Advanced; next panel peeks on the right.
3. **Path quiz** — Existing diagnostic logic restyled to the cinematic system (not a dark glass card island).
4. **Proof** — One featured quote + secondary ticker of shorter proof lines (not three equal cards).
5. **Close CTA** — Short, full-width, book-focused.

## Locked visual choices

| Area | Choice |
|------|--------|
| Hero | Full-bleed type over photo; primary CTA lower-left; brand as hero-level signal |
| Programs | Filmstrip with next-panel peek; progress implied by scroll position |
| Proof | Featured quote + ticker |
| Aesthetic | Hybrid cinematic photo + sharp Cartel type; amber/stone retained; Playfair + Plus Jakarta retained as base, hierarchy tightened |

## Visual system rules (Home)

- Photo-led dark surfaces for hero and programs scrub; light band for proof; avoid unexplained light↔dark jumps.
- No equal three-column feature/testimonial card grids on Home.
- No floating badges/pills on hero media.
- Prefer distinct photography per program when assets exist; temporary tonal gradients acceptable as fallback.
- Display serif for major headlines; sans for UI/labels; reduce ALL-CAPS label noise.

## Interaction & motion

### Programs filmstrip

- Section pins (or equivalent sticky stage) while vertical scroll maps to horizontal translate of the filmstrip.
- Three panels: Puppy Preschool → Foundations for Focus → Advanced Skills.
- Each panel: title, short description, key bullets or perks, CTA into booking or programs with program context when useful.
- Desktop: scrub is smooth; next panel partially visible (peek).
- Mobile: no painful wheel hijack — vertical snap or stacked panels with the same content.
- `prefers-reduced-motion: reduce`: disable pin/scrub; show all three panels in a static stacked (or simple swipeable) layout.

### Other motion

- Intentional section entrances only where they support hierarchy.
- Prefer `transform` / `opacity`; avoid layout-property animation.
- Implementation preference: CSS scroll-driven animations and/or lightweight JS (`requestAnimationFrame` / IntersectionObserver). Do not add GSAP unless scrub quality cannot be achieved without it.

## Quiz

- Preserve existing step logic and recommendation outcomes.
- Restyle controls/typography/spacing to match the new Home.
- Results still offer Book Class and Learn More (programs), plus restart.

## Architecture

### Files / components

- Move current `src/pages/Home.jsx` → `src/pages/HomeClassic.jsx` (behavior/styles unchanged).
- Create new `src/pages/Home.jsx` for the scroll-cinema Home at `/`.
- Update `src/App.jsx`: `/` → new Home; `/home-classic` → `HomeClassic`.
- Extract focused units under `src/components/` (or `src/components/home/`):
  - `ProgramsFilmstrip` — scroll scrub + panel content
  - `PathQuiz` — existing quiz state logic, restyled
  - `ProofFeatured` — featured quote + ticker
  - Close CTA may live inline in `Home.jsx` if small

### Data

- Reuse program copy from existing Home tiers / `src/constants/programs.js` where it stays accurate.
- Testimonials: reuse real copy; drop placeholder avatars.

### Dependencies

- Stay on React + Vite + react-router-dom.
- No new motion library unless scrub proves insufficient with CSS/JS.

### Chrome / other pages

- Navbar, Footer, BottomNav, Programs, Method, Booking: unchanged in this phase except routes required for classic Home.

## Accessibility

- Keyboard: filmstrip content reachable without relying on scroll scrub alone (stacked/reduced-motion path).
- Focus states visible on CTAs and quiz controls.
- Meaningful alt text on hero/program images.
- Respect `prefers-reduced-motion` as specified above.

## Success criteria

- Classic Home available at `/home-classic` and visually unchanged.
- New Home at `/` follows the narrative and locked choices above.
- Home no longer relies on tabbed tiers, three equal testimonial cards, hero review overlay, or pravatar strip.
- Programs journey is scroll-driven on desktop with filmstrip peek; mobile has a usable non-hijack fallback.
- Quiz still recommends a program and routes to booking/programs.
- Subjective target: Home quality ~8/10 on layout/motion/anti-slop vs prior ~5.5/10 audit.

## Out of scope

- Full redesign of Programs, Method, Booking
- Global design-system extraction beyond what Home needs
- Navbar/Footer/BottomNav visual overhaul
- Image generation pipeline as a hard dependency (optional comps later)
- Regions map / blueprint section rebuild

## Phased program (beyond this spec)

1. **This spec** — Scroll-cinema Home + classic route  
2. Design system + chrome  
3. Programs + Method  
4. Booking conversion polish  

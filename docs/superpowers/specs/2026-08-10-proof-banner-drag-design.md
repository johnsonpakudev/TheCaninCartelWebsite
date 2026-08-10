# Drag-Scrub Proof Banner Design

**Date:** 2026-08-10  
**Status:** Approved  
**Scope:** `ProofFeatured` on cinema Home only

## Goal

Let users drag the reviews banner to scrub chips. The featured review above updates live to whichever chip is closest to a fixed center focus line. Keep desktop auto-motion; touch is drag-only.

## Locked decisions

| Decision | Choice |
|----------|--------|
| Featured review while dragging | Updates from center-hit chip (Approach A) |
| Auto-marquee | Desktop: always on; drag temporarily overrides, then resumes from current offset (B) |
| Touch | Drag-only; no auto-advance (D) |
| Implementation approach | Pointer-drag + center-hit testing (Approach 1) |

## Behavior

### Desktop
- Slow continuous auto-advance of banner `offsetPx` (JS-driven; not CSS keyframe marquee).
- Pointer drag overrides offset while active; featured review updates via center-hit.
- On pointer up: keep offset; auto-advance resumes (no jump back).
- Click still selects a review (movement threshold distinguishes click vs drag).
- ←/→ buttons and keyboard still work; preferably nudge offset so the active chip sits under the focus line.

### Touch
- No auto-advance.
- Drag/scrub only; same center-hit → featured update.
- Optional light momentum; must not break hit-testing.

### Reduced motion
- No auto-advance.
- Drag and buttons remain available (or static wrap + buttons if drag is awkward).

## Architecture

**Files**
- Modify: `src/components/home/ProofFeatured.jsx`
- Modify: `src/components/home/home-cinema.css` (remove CSS marquee as the driver; keep visual chip styles)

**State**
- `offsetPx` — translate of duplicated track
- `activeIndex` — review shown above
- `isDragging` — pauses auto-advance
- Mode flags: touch / `prefers-reduced-motion`

**Mechanics**
- Duplicate chip list for seamless wrap; modulo offset by one loop width.
- Focus line at horizontal center of ticker viewport.
- Nearest chip center to focus line wins → `activeIndex` (rAF-throttled).
- Pointer capture on down; move adds `dx` to offset; up/cancel ends drag.
- Desktop auto-advance: rAF adds small px/frame when not dragging and not reduced-motion/touch.

**UI**
- `grab` / `grabbing` cursor on banner.
- Active chip highlight follows `activeIndex`.
- Featured quote fade on index change retained.
- `aria-live` on featured quote retained.

## Out of scope
- Changing review copy set beyond what’s needed for the interaction
- New dependencies (no GSAP/drag libraries)
- Other Home sections

## Success criteria
- Dragging the banner updates the featured review to the centered chip.
- Desktop auto-moves; after drag, motion continues from the new position.
- Touch does not auto-move; drag works.
- Click, ←/→, and keyboard still select reviews.
- Reduced motion disables auto-advance.

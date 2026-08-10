# Booking Focus-Stage Redesign

**Date:** 2026-08-10  
**Status:** Approved for planning  
**Phase:** Booking page remake (UI/UX) — same cinema system, new layout

## Goal

Remake `/booking` for **first-time conversion**: Consultation is visually primary and pre-selected, while Private and Classes remain full, equal peer options (quieter styling). Keep cinema tokens/type; replace the current tab-panel composition with a **focus stage** + **calendar sheet**.

## Context

Current Booking is a cinema-styled three-tab picker (Classes / Private / Consultation) with on-page Google Calendar scheduling buttons, expect strip, waitlist mailto, loading/error fallbacks, and deep-link/`localStorage` defaults.

That model improved conversion hygiene but still reads as “tabs + bolted calendar.” This remake changes **composition and interaction**, not brand language.

## Locked decisions

| Decision | Choice |
|----------|--------|
| Primary optimize | First-time conversion (consult-first) |
| Path visibility | All three options visible; Consult primary + pre-selected |
| Visual system | Same cinema system (paper/ink/amber, Playfair + Plus Jakarta); new layout only |
| Calendar | Hybrid: on-page details + strong CTA; Google scheduling in modal/sheet |
| Classes | Full selectable third path (waitlist + programs), not demoted/hidden |
| Layout approach | Focus stage |

## Must keep / can cut

**Must keep**

- Three bookable/intent paths: Consultation, Private, Classes
- Google Calendar scheduling for Consult + Private (`VITE_GOOGLE_CALENDAR_*` URLs)
- Classes waitlist (`mailto:caninecartel@gmail.com`) + View programs + phone
- Deep links: `location.state.tab`, `location.state.selectedProgram`
- Returning-client Private default via `localStorage` (`tcc_booking_returning`)
- Phone trust/fallback: `0428 077 817`
- SW Sydney service area signal
- Expect details before booking (duration / format / prep or intake)
- Calendar loading + error fallback (no silent empty host)
- Accessibility for path selection (roles, keyboard)

**Can cut / replace**

- Pill-tab strip + dual-column ink panel as the primary composition
- Inline Google button host as the only calendar surface (moves into sheet)
- Competing multi-panel booking chrome

**Out of scope**

- Custom booking backend or replacing Google Calendar
- Live cohort inventory / intake CMS
- Redesign of Programs, Method, Home, or chrome
- Photo-led Booking hero (Home remains the cinema photo beat)

## Page structure

### Above the fold (one composition)

1. **Header** — Short title + one supporting line that new clients start with a consult  
2. **Path chooser** — Three options; Consultation pre-selected and emphasized (“Start here”); Private and Classes quieter peers with equal hit targets  
3. **Focus stage** — Content for the active path only: title, short why, expect strip, 2–3 bullets, one primary CTA  

### Adjacent / light trust

- SW Sydney + phone  
- No second competing booking panel  

### Calendar sheet

- Opens from Consult / Private primary CTA  
- Contains path title, Google scheduling host, loading / error / phone fallback + retry, dismiss  
- Escape + backdrop close; focus trap; body scroll lock on mobile  
- Short handoff copy: finish booking in Google Calendar  

## Components

| Component | Responsibility |
|-----------|----------------|
| `Booking` page shell | Defaults, deep links, path state, sheet open/close |
| Path chooser | Three path controls; consult emphasis; keyboard/ARIA |
| Focus stage | Active path copy, expect strip, points, primary CTA |
| Booking sheet | Modal/sheet overlay hosting calendar load lifecycle |
| Calendar host (inside sheet) | Google `schedulingButton` load; status UI |

Classes primary CTA is **Join waitlist** (mailto); secondary **View programs**. No calendar sheet for Classes.

## Interaction & defaults

1. First visit (no deep link, not returning) → Consultation selected  
2. `state.tab` if valid → that path  
3. `selectedProgram` → Private  
4. Returning flag set when user selects Private → later visits default Private unless deep-linked  
5. Changing path updates focus stage and closes sheet if open  
6. Consult/Private CTA opens sheet and initializes calendar for that path  
7. Sheet error if script fails, URL missing, or load throws → call CTA + retry  

## Visual rules

- Paper page background; one strong focus-stage surface (ink or warm-ink), not a card grid  
- Path chooser above the stage, not inside competing boxes  
- No photo hero on Booking  
- Desktop: chooser + stage in one viewport band  
- Mobile: chooser → stage stacked; CTA remains obvious within stage  
- Reuse cinema button/token language; restyle chooser/stage/sheet only as needed  

## Error handling

| Condition | Behavior |
|-----------|----------|
| Calendar script slow | Sheet shows loading |
| Script/URL/load failure | Sheet shows alert + phone + retry |
| Classes selected | No calendar; waitlist + programs actions |
| Missing env URLs | Treat as calendar error (same fallback) |

## Success criteria

- First-time visitor lands on Consult with one obvious CTA  
- Private and Classes reachable in one click without drowning Consult  
- Booking completes via sheet without feeling like tabs + bolted Google button  
- Existing deep links and waitlist/phone paths still work  
- Desktop and mobile remain usable; sheet is accessible  

## Testing (manual)

- Default first visit → Consult selected; “Start here” visible  
- Clear/set returning flag → Private default vs Consult default  
- Navigate with `tab: 'private' \| 'classes' \| 'consultation'`  
- Navigate with `selectedProgram` → Private  
- Open sheet for Consult and Private; dismiss via Escape, backdrop, close control  
- Force missing URL / blocked script → error fallback + retry  
- Classes → waitlist mailto + View programs  
- Keyboard: arrow between paths; focus trap in open sheet  

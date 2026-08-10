# Scroll-Cinema Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a new scroll-cinema Home at `/` while preserving the current Home at `/home-classic`.

**Architecture:** Move current `Home.jsx` to `HomeClassic.jsx`. Build a new `Home.jsx` composed of `ProgramsFilmstrip`, `PathQuiz`, and `ProofFeatured`. Desktop vertical scroll scrubs a horizontal filmstrip; reduced-motion and mobile use stacked panels. App routing and a full-bleed main wrapper enable the cinematic layout.

**Tech Stack:** React 19, Vite, react-router-dom 7, existing CSS variables in `src/index.css` (Plus Jakarta Sans + Playfair Display). No new motion libraries.

## Global Constraints

- Classic Home at `/home-classic` must remain visually/behaviorally unchanged.
- No GSAP unless scrub cannot be achieved with CSS/JS (default: no GSAP).
- Respect `prefers-reduced-motion: reduce` (stacked panels, no pin/scrub).
- Must keep: booking CTAs, three programs, social proof, path quiz.
- Cut from new Home: blueprint grid, regions, tabbed tiers, hero review pill, pravatar strip.
- Hero: full-bleed type over photo; programs: filmstrip with peek; proof: featured quote + ticker.
- No test runner in repo — verify manually via `npm run dev`.
- Commits require git `user.name` / `user.email` (currently unset); skip commits if identity missing.

---

## File structure

| File | Responsibility |
|------|----------------|
| `src/pages/HomeClassic.jsx` | Exact current Home (moved) |
| `src/pages/Home.jsx` | New scroll-cinema Home composition |
| `src/components/home/ProgramsFilmstrip.jsx` | Pin/scrub filmstrip + mobile/reduced-motion fallback |
| `src/components/home/PathQuiz.jsx` | Diagnostic quiz (logic from classic) |
| `src/components/home/ProofFeatured.jsx` | Featured quote + ticker |
| `src/components/home/home-cinema.css` | Styles for new Home + children |
| `src/App.jsx` | Routes + full-bleed main for `/` and `/home-classic` |

---

### Task 1: Preserve classic Home + routing

**Files:**
- Create: `src/pages/HomeClassic.jsx` (copy of current Home)
- Modify: `src/App.jsx`
- Create: `src/pages/Home.jsx` (temporary stub)

**Interfaces:**
- Produces: `HomeClassic` default export; routes `/` → stub Home, `/home-classic` → HomeClassic

- [ ] **Step 1: Copy current Home to HomeClassic**

Copy `src/pages/Home.jsx` → `src/pages/HomeClassic.jsx` unchanged (keep `export default Home` or rename component to `HomeClassic` with same JSX).

- [ ] **Step 2: Add stub new Home**

```jsx
// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="home-cinema">
      <p>New Home scaffolding</p>
    </div>
  );
}
```

- [ ] **Step 3: Update App routes and full-bleed main**

```jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import HomeClassic from './pages/HomeClassic';
// ...other imports

function AppShell() {
  const { pathname } = useLocation();
  const isFullBleed = pathname === '/' || pathname === '/home-classic';

  return (
    <div className="app-container">
      <Navbar />
      <main className={isFullBleed ? 'site-main' : 'content'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home-classic" element={<HomeClassic />} />
          <Route path="/about" element={<Method />} />
          <Route path="/programs" element={<Classes />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppShell />
    </Router>
  );
}
```

Add to `src/index.css`:

```css
.site-main {
  flex: 1;
  width: 100%;
  min-width: 0;
}
```

- [ ] **Step 4: Verify**

Run: `npm run dev`  
Expected: `/` shows stub; `/home-classic` shows original Home.

- [ ] **Step 5: Commit** (if git identity configured)

```bash
git add src/pages/HomeClassic.jsx src/pages/Home.jsx src/App.jsx src/index.css
git commit -m "feat: preserve classic Home at /home-classic and stub cinema Home"
```

---

### Task 2: ProgramsFilmstrip

**Files:**
- Create: `src/components/home/ProgramsFilmstrip.jsx`
- Create: `src/components/home/home-cinema.css` (filmstrip section)

**Interfaces:**
- Consumes: `useNavigate` from react-router-dom
- Produces: `<ProgramsFilmstrip />` with three panels from shared program data inline or imported from `PROGRAMS`

- [ ] **Step 1: Implement filmstrip component**

Behavior:
- Desktop (`min-width: 768px`) and `prefers-reduced-motion: no-preference`: sticky stage; scroll height ≈ `100vh + (panels - 1) * 80vh`; map progress 0–1 to `translateX` so panel 0..2 move with next panel peeking (~12–18% visible).
- Mobile or reduced-motion: render stacked vertical panels (no sticky scrub).
- Each panel: eyebrow, title, description, 3 bullets, CTA → `/booking` with `state.selectedProgram`.

Use `requestAnimationFrame` + scroll listener on the pin spacer, or CSS `position: sticky` + JS progress from `getBoundingClientRect`.

- [ ] **Step 2: Style filmstrip in `home-cinema.css`**

Dark surface, amber accents, peek gutter, progress indicator optional.

- [ ] **Step 3: Mount temporarily in Home and verify scrub + stacked fallback**

- [ ] **Step 4: Commit** (if identity set)

---

### Task 3: PathQuiz + ProofFeatured + Close CTA

**Files:**
- Create: `src/components/home/PathQuiz.jsx`
- Create: `src/components/home/ProofFeatured.jsx`
- Modify: `src/components/home/home-cinema.css`
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- PathQuiz: same recommendation logic as classic Home (`calculateRecommendation`)
- ProofFeatured: props or internal data — `featured` + `tickerItems[]`
- Home composes: Hero → ProgramsFilmstrip → PathQuiz → ProofFeatured → Close CTA

- [ ] **Step 1: Extract PathQuiz** with restyled markup (no dark-glass island cliché; match cinema system)

- [ ] **Step 2: Build ProofFeatured** — one large quote + CSS-animated ticker (pause on `prefers-reduced-motion`)

- [ ] **Step 3: Build full-bleed hero + close CTA in `Home.jsx`**

Hero rules: edge-to-edge image (`/DogTrainer5.jpg` or better asset if present), brand, headline `MASTER YOUR PACK.`, one primary CTA to booking. No review overlay.

Close: short book-focused band.

- [ ] **Step 4: Wire Home composition and polish spacing**

- [ ] **Step 5: Manual QA checklist**

- `/` hero full-bleed, no overlay pill  
- Filmstrip scrubs on desktop; stacked on mobile / reduced-motion  
- Quiz completes and navigates to booking/programs  
- Proof shows featured + ticker  
- `/home-classic` unchanged  
- No blueprint/regions/pravatar on new Home  

- [ ] **Step 6: Commit** (if identity set)

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| `/` new, `/home-classic` classic | Task 1 |
| Full-bleed hero A | Task 3 |
| Filmstrip peek B | Task 2 |
| Proof featured + ticker A | Task 3 |
| Quiz kept | Task 3 |
| Cut blueprint/regions/tabs/pravatar | Task 3 (omit) |
| Reduced-motion / mobile fallback | Task 2 |
| No GSAP by default | Task 2 |
| Full-bleed vs `.content` max-width | Task 1 (`site-main`) |

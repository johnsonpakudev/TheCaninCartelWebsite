/** Scroll-scrubbed imagery — no time-based CSS transitions. */

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Per-panel easing remaps linear scroll segment → varied slide speed while scrubbing. */
export const PANEL_ENTER_EASE = [
  (t) => t, // panel 0 — already settled at start
  (t) => 1 - (1 - t) ** 2.6, // puppy path: quick snap-in at end of segment
  (t) => t ** 2 * (3 - 2 * t), // foundations: smoothstep (even acceleration)
  (t) => t ** 3.2, // advanced: slow start, rush finish
];

/** Horizontal slide distance (px) per panel — larger = more dramatic enter. */
export const PANEL_SLIDE_X = [0, 64, 88, 112];

/**
 * Linear 0→1 enter progress for filmstrip panel `index` from global scrub progress 0→1.
 * Panel 0 starts fully entered; later panels enter over one scroll segment each.
 */
export function panelEnterProgress(globalProgress, index, panelCount) {
  if (index === 0) return 1;

  const steps = Math.max(panelCount - 1, 1);
  const position = globalProgress * steps;
  const raw = (position - (index - 1)) / 1;
  return clamp(raw, 0, 1);
}

export function easeScrollSegment(linearT, panelIndex) {
  const ease = PANEL_ENTER_EASE[panelIndex] ?? PANEL_ENTER_EASE[2];
  return ease(clamp(linearT, 0, 1));
}

function motionProfile(panelIndex, variant) {
  if (variant === 'stacked') {
    const profileIndex = panelIndex + 1;
    return { easeIndex: profileIndex, slideIndex: profileIndex };
  }
  if (panelIndex === 0) {
    return { easeIndex: 0, slideIndex: 0 };
  }
  return { easeIndex: panelIndex, slideIndex: panelIndex };
}

export function imageScrollStyleFromEnter(linearEnterT, panelIndex, motionEnabled, variant = 'filmstrip') {
  if (!motionEnabled) return undefined;

  const { easeIndex, slideIndex } = motionProfile(panelIndex, variant);
  const t = easeScrollSegment(linearEnterT, easeIndex);
  const slideX = PANEL_SLIDE_X[slideIndex] ?? 72;
  const slideY = slideX * 0.14;
  const remain = 1 - t;

  return {
    opacity: 0.28 + t * 0.72,
    transform: `translate3d(${remain * slideX}px, ${remain * slideY}px, 0) scale(${1 + remain * 0.07})`,
  };
}

/**
 * Stacked layout: map element position in viewport → 0..1 enter (scroll-driven).
 */
export function stackedEnterProgressFromRect(rect, viewportHeight) {
  const start = viewportHeight * 0.92;
  const end = viewportHeight * 0.52;
  const raw = (start - rect.top) / (start - end);
  return clamp(raw, 0, 1);
}

/** Hero: split scroll progress so photo vs copy move at different scrub rates. */
export function heroScrollLayers(scrollProgress) {
  const p = clamp(scrollProgress, 0, 1);
  const mediaP = p ** 1.35;
  const copyP = 1 - (1 - p) ** 2.1;
  return { mediaP, copyP };
}

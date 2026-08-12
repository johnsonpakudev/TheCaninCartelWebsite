import { useEffect, useId, useRef, useState } from 'react';

const REVIEWS = [
  {
    id: 'sarah-luna',
    blurb: 'Off-lead reliability',
    text: 'Douglas achieved off-lead reliability with our GSD that we thought was impossible. Calm, clear coaching.',
    author: 'Sarah & Luna',
    meta: 'German Shepherd',
    stars: 5,
  },
  {
    id: 'chloe-max',
    blurb: 'Focus finally clicked',
    text: "Douglas transformed Max's reactivity into total focus. Their bond is now stronger than ever.",
    author: 'Chloe & Max',
    meta: 'Border Collie',
    stars: 5,
  },
  {
    id: 'mark-buster',
    blurb: 'Best investment we made',
    text: 'The Puppy Preschool was the best investment we made. Buster is so well-behaved now!',
    author: 'Mark & Buster',
    meta: 'Golden Retriever',
    stars: 5,
  },
  {
    id: 'sarah-max',
    blurb: 'Recall is now reliable',
    text: "Advanced skills totally changed our off-lead life. Max's recall is now 100% reliable.",
    author: 'Sarah & Max',
    meta: 'German Shepherd',
    stars: 5,
  },
  {
    id: 'james-cooper',
    blurb: 'Walks are calm again',
    text: 'House manners and lead work clicked within weeks. Walks feel calm instead of stressful.',
    author: 'James & Cooper',
    meta: 'Labrador',
    stars: 5,
  },
];

const LOOP = [...REVIEWS, ...REVIEWS];
const AUTO_SPEED = 0.45; // px per frame at ~60fps
const DRAG_CLICK_THRESHOLD = 6;

function Stars({ count }) {
  return (
    <span className="proof-featured__stars" aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}
    </span>
  );
}

export default function ProofFeatured() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [shown, setShown] = useState(REVIEWS[0]);
  const [quoteShown, setQuoteShown] = useState(true);
  const labelId = useId();

  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const chipRefs = useRef([]);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const activeIndexRef = useRef(0);
  const draggingRef = useRef(false);
  const dragMovedRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const autoEnabledRef = useRef(true);
  const suppressClickRef = useRef(false);
  const pendingReviewRef = useRef(null);

  const active = REVIEWS[activeIndex];

  useEffect(() => {
    if (active.id === shown.id) return;
    pendingReviewRef.current = active;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(active);
      pendingReviewRef.current = null;
      setQuoteShown(true);
      return undefined;
    }

    setQuoteShown(false);
    const failSafe = window.setTimeout(() => {
      const next = pendingReviewRef.current;
      if (!next) return;
      setShown(next);
      pendingReviewRef.current = null;
      setQuoteShown(true);
    }, 280);
    return () => window.clearTimeout(failSafe);
  }, [active, shown.id]);

  function onQuoteTransitionEnd(e) {
    if (e.propertyName !== 'opacity') return;
    if (quoteShown) return;
    const next = pendingReviewRef.current;
    if (!next) return;
    setShown(next);
    pendingReviewRef.current = null;
    setQuoteShown(true);
  }

  function measureLoopWidth() {
    const first = chipRefs.current[0];
    const second = chipRefs.current[REVIEWS.length];
    if (!first || !second) return;
    loopWidthRef.current = second.offsetLeft - first.offsetLeft;
  }

  function wrapOffset(value) {
    const width = loopWidthRef.current;
    if (width <= 0) return value;
    return ((value % width) + width) % width;
  }

  function applyTransform() {
    offsetRef.current = wrapOffset(offsetRef.current);
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }
  }

  function updateActiveFromCenter() {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const focusX = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let bestIndex = activeIndexRef.current;
    let bestDist = Infinity;

    chipRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(centerX - focusX);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i % REVIEWS.length;
      }
    });

    if (bestIndex !== activeIndexRef.current) {
      activeIndexRef.current = bestIndex;
      setActiveIndex(bestIndex);
    }
  }

  function centerChip(index) {
    const viewport = viewportRef.current;
    const el = chipRefs.current[index];
    if (!viewport || !el) return;

    measureLoopWidth();
    const focusX = viewport.clientWidth / 2;
    offsetRef.current = el.offsetLeft + el.offsetWidth / 2 - focusX;
    applyTransform();
    activeIndexRef.current = index;
    setActiveIndex(index);
  }

  function step(delta) {
    const next = (activeIndexRef.current + delta + REVIEWS.length) % REVIEWS.length;
    centerChip(next);
  }

  useEffect(() => {
    const touchMq = window.matchMedia('(pointer: coarse)');
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    function syncAuto() {
      autoEnabledRef.current = !touchMq.matches && !reduceMq.matches;
    }

    syncAuto();
    touchMq.addEventListener('change', syncAuto);
    reduceMq.addEventListener('change', syncAuto);

    measureLoopWidth();
    applyTransform();
    updateActiveFromCenter();

    let frame = 0;
    function tick() {
      if (!draggingRef.current && autoEnabledRef.current) {
        offsetRef.current += AUTO_SPEED;
        applyTransform();
        updateActiveFromCenter();
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    function onResize() {
      measureLoopWidth();
      applyTransform();
      updateActiveFromCenter();
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      touchMq.removeEventListener('change', syncAuto);
      reduceMq.removeEventListener('change', syncAuto);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  function onPointerDown(e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    draggingRef.current = true;
    dragMovedRef.current = 0;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    suppressClickRef.current = false;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    dragMovedRef.current = Math.max(dragMovedRef.current, Math.abs(dx));
    offsetRef.current = dragStartOffsetRef.current - dx;
    applyTransform();
    updateActiveFromCenter();
  }

  function onPointerUp(e) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (dragMovedRef.current >= DRAG_CLICK_THRESHOLD) {
      suppressClickRef.current = true;
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }

  function onChipClick(index, e) {
    if (suppressClickRef.current) {
      e.preventDefault();
      suppressClickRef.current = false;
      return;
    }
    centerChip(index);
  }

  function onSectionKeyDown(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  }

  return (
    <section
      className="proof-featured"
      aria-label="Client proof"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={onSectionKeyDown}
    >
      <div className="proof-featured__inner">
        <div className="proof-featured__top">
          <span className="proof-featured__eyebrow" id={labelId}>
            THE PACK&apos;S VOICE
          </span>
          <div className="proof-featured__controls" role="group" aria-label="Browse reviews">
            <button type="button" className="proof-nav-btn" onClick={() => step(-1)} aria-label="Previous review">
              ←
            </button>
            <span className="proof-featured__count">
              {activeIndex + 1} / {REVIEWS.length}
            </span>
            <button type="button" className="proof-nav-btn" onClick={() => step(1)} aria-label="Next review">
              →
            </button>
          </div>
        </div>

        <div className="proof-featured__viewer" aria-live="polite">
          <Stars count={shown.stars} />
          <blockquote
            className={`proof-featured__quote${quoteShown ? ' is-shown' : ''}`}
            onTransitionEnd={onQuoteTransitionEnd}
          >
            “{shown.text}”
          </blockquote>
          <div className={`proof-featured__author${quoteShown ? ' is-shown' : ''}`}>
            — {shown.author} · {shown.meta}
          </div>
        </div>

        <p className="proof-featured__hint">Drag the banner to browse · click a chip to jump</p>

        <div
          ref={viewportRef}
          className={`proof-ticker${isDragging ? ' is-dragging' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="proof-ticker__focus" aria-hidden="true" />
          <div ref={trackRef} className="proof-ticker__track">
            {LOOP.map((review, i) => {
              const sourceIndex = i % REVIEWS.length;
              const isActive = sourceIndex === activeIndex;
              return (
                <button
                  key={`${review.id}-${i}`}
                  type="button"
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  className={`proof-ticker__item${isActive ? ' is-active' : ''}`}
                  onClick={(e) => onChipClick(sourceIndex, e)}
                  aria-pressed={isActive}
                  aria-label={`View review from ${review.author}`}
                >
                  <span aria-hidden="true">★★★★★</span>
                  “{review.blurb}” — {review.author}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

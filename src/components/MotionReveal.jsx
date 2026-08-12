import { useEffect, useRef, useState } from 'react';

/**
 * One-time scroll enter for page depth.
 * CSS-only motion; IntersectionObserver flips `.is-in`.
 * `when="late"` waits until the block is nearer mid-viewport.
 */
export function MotionReveal({ as: Tag = 'div', className = '', when = 'default', children, ...rest }) {
  const ref = useRef(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsIn(true);
      return undefined;
    }

    // Use threshold 0 — a high threshold + negative rootMargin can never fire
    // when the observed block is taller than the shrunken root (tall sections).
    const observerOpts =
      when === 'late'
        ? { rootMargin: '0px 0px -42% 0px', threshold: 0 }
        : { rootMargin: '0px 0px -10% 0px', threshold: 0 };

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsIn(true);
      io.disconnect();
    }, observerOpts);

    io.observe(el);
    return () => io.disconnect();
  }, [when]);

  const classes = ['motion-reveal', isIn ? 'is-in' : '', className].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}

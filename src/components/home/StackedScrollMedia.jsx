import { useEffect, useRef, useState } from 'react';
import {
  imageScrollStyleFromEnter,
  stackedEnterProgressFromRect,
} from './scrollImageryMotion';

/**
 * Mobile / stacked panels: slide-in tied to scroll position (not CSS transition reveals).
 */
export default function StackedScrollMedia({ panelIndex, motionEnabled, children }) {
  const rootRef = useRef(null);
  const [enterT, setEnterT] = useState(motionEnabled ? 0 : 1);

  useEffect(() => {
    if (!motionEnabled) {
      setEnterT(1);
      return undefined;
    }

    let frame = 0;

    function measure() {
      const el = rootRef.current;
      if (!el) return;
      const next = stackedEnterProgressFromRect(el.getBoundingClientRect(), window.innerHeight);
      setEnterT(next);
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [motionEnabled]);

  const innerStyle = imageScrollStyleFromEnter(enterT, panelIndex, motionEnabled, 'stacked');

  return (
    <div ref={rootRef} className="filmstrip-panel__media-reveal filmstrip-panel__media-reveal--scrub">
      <div className="filmstrip-panel__media-inner filmstrip-panel__media-inner--scrub" style={innerStyle}>
        {children}
      </div>
    </div>
  );
}

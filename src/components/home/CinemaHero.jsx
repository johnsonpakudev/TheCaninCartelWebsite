import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SITE_IMAGES } from '../../constants/images';

export default function CinemaHero() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [motionEnabled, setMotionEnabled] = useState(true);

  useEffect(() => {
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    function sync() {
      setMotionEnabled(!reduceMq.matches);
    }
    sync();
    reduceMq.addEventListener('change', sync);
    return () => reduceMq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!motionEnabled) return undefined;

    let frame = 0;

    function measure() {
      const hero = heroRef.current;
      if (!hero) return;
      const height = hero.offsetHeight || 1;
      const top = hero.getBoundingClientRect().top;
      const next = Math.min(Math.max(-top / height, 0), 1);
      setScrollProgress(next);
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

  const mediaTransform = motionEnabled
    ? `translate3d(0, ${scrollProgress * 32}px, 0) scale(${1 + scrollProgress * 0.07})`
    : undefined;
  const contentTransform = motionEnabled ? `translate3d(0, ${scrollProgress * -28}px, 0)` : undefined;
  const contentOpacity = motionEnabled ? 1 - scrollProgress * 0.4 : 1;

  return (
    <section ref={heroRef} className="cinema-hero" aria-label="Canine Cartel hero">
      <div className="cinema-hero__media">
        <div className="cinema-hero__media-inner" style={{ transform: mediaTransform }}>
          <img src={SITE_IMAGES.homeHero.src} alt={SITE_IMAGES.homeHero.alt} />
        </div>
        <div className="cinema-hero__shade" />
      </div>
      <div
        className="cinema-hero__content"
        style={{
          transform: contentTransform,
          opacity: contentOpacity,
        }}
      >
        <div className="cinema-hero__brand">Canine Cartel</div>
        <h1 className="cinema-hero__title">
          Steady dogs.
          <br />
          <em>Clear handlers.</em>
        </h1>
        <p className="cinema-hero__sub">
          Science-led training with Douglas Davenport — manners that hold at home, on walks, and across SW
          Sydney.
        </p>
        <button
          type="button"
          className="cinema-btn cinema-btn--primary"
          onClick={() => navigate('/booking', { state: { tab: 'consultation' } })}
        >
          Book training
        </button>
      </div>
    </section>
  );
}

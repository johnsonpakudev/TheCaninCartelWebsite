import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MotionReveal } from '../MotionReveal';
import { SITE_IMAGES } from '../../constants/images';

function panelFocus(progress, index, panelCount) {
  if (panelCount <= 1) return 1;
  const peak = progress * (panelCount - 1);
  return Math.max(0, 1 - Math.abs(peak - index));
}

function imageScrollStyle(focus, motionEnabled) {
  if (!motionEnabled) return undefined;
  const eased = focus * focus;
  const slideX = (1 - eased) * 36;
  const slideY = (1 - eased) * 18;
  const scale = 1 + (1 - eased) * 0.08;
  const opacity = 0.42 + eased * 0.58;
  return {
    opacity,
    transform: `translate3d(${slideX}px, ${slideY}px, 0) scale(${scale})`,
  };
}

const PANELS = [
  {
    id: 'puppy',
    eyebrow: '01 — PUPPY',
    title: 'Puppy Preschool',
    desc: 'Socialization, basic manners, and preventing bad habits before they start.',
    bullets: ['House Training Blueprint', 'Social Confidence Skills', 'Marker Neutrality'],
    btnText: 'Join waitlist',
    img: SITE_IMAGES.filmstripPuppy.src,
    imgAlt: SITE_IMAGES.filmstripPuppy.alt,
  },
  {
    id: 'foundations',
    eyebrow: '02 — FOUNDATIONS',
    title: 'Foundations for Focus',
    desc: 'The essential bridge between puppyhood and adult reliability.',
    bullets: ['Reliable Impulse Control', 'Stress-Free Walking', 'Cooperative Care'],
    btnText: 'Join waitlist',
    img: SITE_IMAGES.filmstripFoundations.src,
    imgAlt: SITE_IMAGES.filmstripFoundations.alt,
  },
  {
    id: 'advanced',
    eyebrow: '03 — ADVANCED',
    title: 'Advanced Skills',
    desc: 'High-level independence and total harmony with your dog.',
    bullets: ['Off-Lead Reliability', 'Distance Mastery', 'Neutrality in Public'],
    btnText: 'Join waitlist',
    img: SITE_IMAGES.filmstripAdvanced.src,
    imgAlt: SITE_IMAGES.filmstripAdvanced.alt,
  },
];

function Panel({ panel, onBook, imageFocus = 1, scrollMotion = false, stackedReveal = false }) {
  const imgStyle = scrollMotion ? imageScrollStyle(imageFocus, true) : undefined;

  const media = (
    <div className="filmstrip-panel__media">
      <div className="filmstrip-panel__media-inner">
        <img
          src={panel.img}
          alt={panel.imgAlt || `${panel.title} training`}
          style={imgStyle}
          className={scrollMotion ? 'filmstrip-panel__media-img--scrub' : undefined}
        />
      </div>
      <div className="filmstrip-panel__media-cta">
        <button type="button" className="cinema-btn cinema-btn--amber" onClick={() => onBook(panel.title)}>
          {panel.btnText}
        </button>
      </div>
    </div>
  );

  return (
    <article className="filmstrip-panel">
      <div className="filmstrip-panel__copy">
        <div className="filmstrip-panel__eyebrow">{panel.eyebrow}</div>
        <h3>{panel.title}</h3>
        <p>{panel.desc}</p>
        <ul>
          {panel.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
      {stackedReveal ? (
        <MotionReveal className="filmstrip-panel__media-reveal motion-reveal--slide-x motion-reveal--from-end">
          {media}
        </MotionReveal>
      ) : (
        media
      )}
    </article>
  );
}

export default function ProgramsFilmstrip() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [useStacked, setUseStacked] = useState(false);
  const [translatePx, setTranslatePx] = useState(0);
  const [scrollMotion, setScrollMotion] = useState(true);

  function book(programTitle) {
    navigate('/booking', { state: { selectedProgram: programTitle } });
  }

  useEffect(() => {
    const mobileMq = window.matchMedia('(max-width: 767px)');
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    function syncMode() {
      const reduced = mobileMq.matches || reduceMq.matches;
      setUseStacked(reduced);
      setScrollMotion(!reduceMq.matches);
    }

    syncMode();
    mobileMq.addEventListener('change', syncMode);
    reduceMq.addEventListener('change', syncMode);
    return () => {
      mobileMq.removeEventListener('change', syncMode);
      reduceMq.removeEventListener('change', syncMode);
    };
  }, []);

  useEffect(() => {
    if (useStacked) return undefined;

    let frame = 0;

    function measure() {
      const section = scrollRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const scrollable = section.offsetHeight - window.innerHeight;
      const sectionTop = section.getBoundingClientRect().top;
      const scrolled = Math.min(Math.max(-sectionTop, 0), Math.max(scrollable, 0));
      const nextProgress = scrollable > 0 ? scrolled / scrollable : 0;

      const maxTranslate = Math.max(track.scrollWidth - track.parentElement.clientWidth, 0);
      setProgress(nextProgress);
      setTranslatePx(nextProgress * maxTranslate);
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
  }, [useStacked]);

  if (useStacked) {
    return (
      <section className="filmstrip-stacked" id="tiers" aria-label="Training programs">
        <div className="filmstrip-header">
          <h2>Training path</h2>
          <span>THREE LEVELS</span>
        </div>
        {PANELS.map((panel) => (
          <Panel key={panel.id} panel={panel} onBook={book} stackedReveal />
        ))}
      </section>
    );
  }

  const activeIndex = Math.min(PANELS.length - 1, Math.round(progress * (PANELS.length - 1)));

  return (
    <section
      ref={scrollRef}
      className="filmstrip-scroll filmstrip-scroll--pinned"
      id="tiers"
      aria-label="Training programs"
    >
      <div className="filmstrip-sticky">
        <div className="filmstrip-header">
          <h2>Training path</h2>
          <span>SCROLL TO ADVANCE</span>
        </div>
        <div className="filmstrip-viewport">
          <div
            ref={trackRef}
            className="filmstrip-track"
            style={{ transform: `translate3d(-${translatePx}px, 0, 0)` }}
          >
            {PANELS.map((panel, index) => (
              <Panel
                key={panel.id}
                panel={panel}
                onBook={book}
                imageFocus={panelFocus(progress, index, PANELS.length)}
                scrollMotion={scrollMotion}
              />
            ))}
          </div>
        </div>
        <div className="filmstrip-progress" aria-hidden="true">
          <div className="filmstrip-progress__bar">
            <i style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="filmstrip-progress__label">
            0{activeIndex + 1} / 0{PANELS.length}
          </div>
        </div>
      </div>
    </section>
  );
}

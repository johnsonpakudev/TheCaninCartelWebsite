import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PROGRAMS } from '../constants/programs';
import { MotionReveal } from '../components/MotionReveal';
import '../styles/pages-cinema.css';

const FOCUSES = [
  {
    id: 'leash',
    title: 'Leash pulling',
    details: 'Dragging, forging, and lead reactivity solved through clear pressure and focus work.',
    points: ['Pressure awareness', 'Focus heeling', 'Environmental neutrality'],
  },
  {
    id: 'reactivity',
    title: 'Reactivity',
    details: 'Shift triggers from react → engage/disengage with distance management and trust rebuilding.',
    points: ['Counter-conditioning', 'Distance work', 'Handler trust'],
  },
  {
    id: 'anxiety',
    title: 'Separation anxiety',
    details: 'Build independence so alone-time feels safe — gradual routines, not sudden absences.',
    points: ['Departure cues', 'Crate mastery', 'Gradual scaling'],
  },
  {
    id: 'recall',
    title: 'Recall',
    details: 'Enthusiastic returns even in high-distraction places like beaches and parks.',
    points: ['Long-line work', 'Whistle training', 'High-value response'],
  },
];

const MORE_FOCUSES = ['Excessive barking', 'Aggression', 'Resource guarding', 'Housebreaking'];

const FAQS = [
  {
    q: 'What if I miss a class?',
    a: 'Miss more than two sessions and you may need to re-enroll later. Refunds are not provided for non-attendance.',
  },
  {
    q: 'Vaccination requirements?',
    a: 'Puppies need a C3 at least 10 days before class one — bring your certificate.',
  },
  {
    q: 'Who can attend?',
    a: 'Up to two people per puppy. Ages 10+; under 18 needs a guardian. Under 10 can observe only.',
  },
  {
    q: 'On-lead interaction?',
    a: 'Dogs stay on-lead. Do not approach other puppies without permission.',
  },
  {
    q: 'What to bring?',
    a: 'Closed-toe shoes, flat collar + 1.2–1.4m lead, mat/towel, and soft high-value treats. No martingales or check chains.',
  },
  {
    q: 'Feed before class?',
    a: 'Skip a meal just before class when you can — hunger helps treat motivation.',
  },
];

const BLUEPRINT = [
  { num: '01', h: 'Precision results', p: 'Protocols that hold outside class.' },
  { num: '02', h: 'Handler partnership', p: 'You and your dog trained as a team.' },
  { num: '03', h: 'Small classes', p: 'Individual feedback every session.' },
  { num: '04', h: 'Homework support', p: 'Weekly goals for home practice.' },
];

const MEDIA_FOCUS = ['center 30%', 'center 55%', 'center 70%'];

export default function Classes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedPrograms, setExpandedPrograms] = useState([]);

  useEffect(() => {
    if (location.state?.scrollTo === 'faq') {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  function toggleProgram(id) {
    setExpandedPrograms((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  return (
    <div className="cinema-page cinema-page--programs">
      <header className="programs-hero">
        <div className="programs-hero__copy">
          <span className="cinema-page__eyebrow">Programs</span>
          <h1>
            Training that fits
            <br />
            <em>your dog&apos;s stage.</em>
          </h1>
          <p className="cinema-page__lead">
            Three structured courses — from critical puppy weeks through advanced reliability.
          </p>
        </div>
        <nav className="programs-hero__jump" aria-label="Jump to program">
          {PROGRAMS.map((program, i) => (
            <a key={program.id} href={`#${program.id}`} className="programs-hero__jump-link">
              <span>0{i + 1}</span>
              {program.title}
            </a>
          ))}
        </nav>
      </header>

      <section className="programs-catalog" aria-label="Training programs">
        {PROGRAMS.map((program, index) => {
          const isOpen = expandedPrograms.includes(program.id);
          const isFlip = index % 2 === 1;
          return (
            <MotionReveal
              as="article"
              className={`program-row motion-reveal--slide-x${
                isFlip ? ' program-row--flip motion-reveal--from-end' : ''
              }`}
              key={program.id}
              id={program.id}
            >
              <div className="program-row__media">
                <img
                  src="/DogTrainer5.jpg"
                  alt=""
                  style={{ objectPosition: MEDIA_FOCUS[index % MEDIA_FOCUS.length] }}
                />
                <div className="program-row__index">0{index + 1}</div>
              </div>
              <div className="program-row__copy">
                <div className="program-row__meta">
                  <span className="program-row__chip program-row__chip--ink">{program.subtitle}</span>
                  <span className="program-row__chip">{program.age}</span>
                </div>
                <h2>{program.title}</h2>
                <p className="program-row__desc">{program.desc}</p>
                <ul className="program-row__perks">
                  {program.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                <div className="program-row__actions">
                  <button
                    type="button"
                    className="cinema-btn cinema-btn--amber"
                    onClick={() => navigate('/booking', { state: { selectedProgram: program.title } })}
                  >
                    {program.btnText}
                  </button>
                  <button
                    type="button"
                    className="cinema-btn cinema-btn--ghost"
                    onClick={() => toggleProgram(program.id)}
                  >
                    {isOpen ? 'Hide curriculum' : 'View curriculum'}
                  </button>
                </div>
                {isOpen && (
                  <div className="program-row__curriculum motion-enter">
                    <h3>{program.curriculumTitle}</h3>
                    <p>{program.curriculumDesc}</p>
                    <ul>
                      {program.curriculumItems.map((item) => (
                        <li key={item.label}>
                          <strong>{item.label}</strong>
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </MotionReveal>
          );
        })}
      </section>

      <MotionReveal
        as="section"
        when="late"
        className="cinema-page__section cinema-page__section--ink programs-blueprint motion-reveal--blueprint"
      >
        <div className="cinema-page__section-inner">
          <div className="programs-blueprint__head">
            <div>
              <span className="cinema-page__eyebrow">The methodology</span>
              <h2>The Cartel blueprint</h2>
            </div>
            <p>Four habits that make results stick beyond the classroom.</p>
          </div>
          <ol className="blueprint-rail">
            {BLUEPRINT.map((item) => (
              <li key={item.num} className="motion-reveal__item">
                <span className="blueprint-rail__num">{item.num}</span>
                <h3>{item.h}</h3>
                <p>{item.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </MotionReveal>

      <MotionReveal
        as="section"
        when="late"
        className="cinema-page__section cinema-page__section--warm programs-focus motion-reveal--focus"
      >
        <div className="cinema-page__section-inner">
          <div className="programs-focus__head">
            <div>
              <span className="cinema-page__eyebrow">Support areas</span>
              <h2>Training focus</h2>
            </div>
            <p>The issues handlers ask about most.</p>
          </div>
          <div className="focus-grid">
            {FOCUSES.map((item) => (
              <article className="focus-tile is-open" key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.details}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="focus-more">
            <span>Also supported:</span>
            {MORE_FOCUSES.map((label) => (
              <span className="focus-more__chip" key={label}>
                {label}
              </span>
            ))}
            <button
              type="button"
              className="cinema-btn cinema-btn--ink focus-more__cta"
              onClick={() => navigate('/booking', { state: { tab: 'consultation' } })}
            >
              Book a consult
            </button>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal as="section" className="cinema-page__section programs-faq" id="faq">
        <div className="programs-faq__head">
          <span className="cinema-page__eyebrow">Common questions</span>
          <h2>Before you join</h2>
        </div>
        <div className="faq-columns">
          {FAQS.map((faq) => (
            <details key={faq.q} className="motion-reveal__item">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </MotionReveal>

      <MotionReveal as="section" className="programs-cta">
        <div className="programs-cta__inner">
          <h2>
            Ready to
            <em> start?</em>
          </h2>
          <p>Book a class or consult — we&apos;ll match you to the right path.</p>
          <button type="button" className="cinema-btn cinema-btn--amber" onClick={() => navigate('/booking')}>
            Book a class
          </button>
        </div>
      </MotionReveal>
    </div>
  );
}

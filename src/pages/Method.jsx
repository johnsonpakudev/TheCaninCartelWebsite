import { useNavigate } from 'react-router-dom';
import { MotionReveal } from '../components/MotionReveal';
import '../styles/pages-cinema.css';

const PILLARS = [
  {
    title: 'Positive reinforcement',
    desc: 'Reward-based teaching that builds confidence and a desire to work with you. Learning comes from focus and clarity — not fear.',
  },
  {
    title: 'Holistic approach',
    desc: 'We look at mind, body, and environment together: social skills, routines, and the places your dog actually lives day to day.',
  },
];

const CREDENTIALS = [
  'Pro dog trainer accreditation',
  'Canine behavioral studies',
  'Reactive dog specialist',
  'Pack management & handler coaching',
];

export default function Method() {
  const navigate = useNavigate();

  return (
    <div className="cinema-page">
      <section className="method-hero" aria-label="Douglas Davenport">
        <div className="method-hero__media">
          <img src="/DogTrainer5.jpg" alt="Douglas Davenport working with a dog" />
        </div>
        <div className="method-hero__copy">
          <span className="cinema-page__eyebrow">About</span>
          <h1>
            Douglas
            <br />
            Davenport
          </h1>
          <p className="method-hero__role">Principal consultant &amp; training architect</p>
          <p className="method-hero__quote">
            “We bridge the gap between human and canine — building partnerships that hold in real life.”
          </p>
          <div className="method-hero__contacts">
            <a href="tel:0428077817">0428 077 817</a>
            <a href="mailto:caninecartel@gmail.com">caninecartel@gmail.com</a>
            <a href="https://www.instagram.com/the_caninecartel" target="_blank" rel="noreferrer">
              @the_caninecartel
            </a>
          </div>
          <button type="button" className="cinema-btn cinema-btn--amber" onClick={() => navigate('/booking')}>
            Book a consult
          </button>
        </div>
      </section>

      <MotionReveal as="section" className="cinema-page__section cinema-page__section--warm">
        <div className="cinema-page__section-inner">
          <div className="cinema-page__section-head">
            <span className="cinema-page__eyebrow">The philosophy</span>
            <h2>The Cartel method</h2>
            <p>Warm, structured, science-led training for handlers who want calm focus and reliable manners.</p>
          </div>
          <div className="method-pillars">
            {PILLARS.map((item) => (
              <article key={item.title} className="motion-reveal__item">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </MotionReveal>

      <MotionReveal as="section" className="cinema-page__section cinema-page__section--ink">
        <div className="cinema-page__section-inner">
          <div className="cinema-page__section-head">
            <span className="cinema-page__eyebrow">Credentials</span>
            <h2>Standards we train to</h2>
            <p>Ongoing study in canine psychology and behavior so methods stay effective and kind.</p>
          </div>
          <ul className="cred-list">
            {CREDENTIALS.map((item) => (
              <li key={item} className="motion-reveal__item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </MotionReveal>

      <MotionReveal as="section" className="cinema-page__section">
        <div className="cinema-page__section-head">
          <span className="cinema-page__eyebrow">Success spotlight</span>
          <h2>Gus &amp; the blueprint</h2>
        </div>
        <div className="success-split">
          <div className="success-split__media">
            <img src="/DogTrainer5.jpg" alt="Training result" />
          </div>
          <div className="success-split__copy">
            <h3>From unmanageable to calm and responsive</h3>
            <blockquote>
              “After one cycle with Douglas we are looking at a dog who is happy, calm and perfectly responsive.
              Truly life-changing.”
            </blockquote>
            <div className="success-split__meta">Sarah · Golden Retriever</div>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal className="cinema-page__cta-band">
        <h2>Join the Cartel</h2>
        <p>Start with a consult or enroll in the program that fits your dog.</p>
        <button type="button" className="cinema-btn cinema-btn--ink" onClick={() => navigate('/booking')}>
          Enroll / book
        </button>
      </MotionReveal>
    </div>
  );
}

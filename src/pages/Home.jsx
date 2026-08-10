import { useNavigate } from 'react-router-dom';
import ProgramsFilmstrip from '../components/home/ProgramsFilmstrip';
import PathQuiz from '../components/home/PathQuiz';
import ProofFeatured from '../components/home/ProofFeatured';
import '../components/home/home-cinema.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-cinema">
      <section className="cinema-hero" aria-label="Canine Cartel hero">
        <div className="cinema-hero__media">
          <img src="/DogTrainer5.jpg" alt="Handler working with a dog in training" />
          <div className="cinema-hero__shade" />
            </div>
        <div className="cinema-hero__content">
          <div className="cinema-hero__brand">Canine Cartel</div>
          <h1 className="cinema-hero__title">
            MASTER
            <br />
            YOUR <em>PACK.</em>
          </h1>
          <p className="cinema-hero__sub">
            We don&apos;t just train dogs — we build handlers. Elite communication and science-based results.
          </p>
          <button
            type="button"
            className="cinema-btn cinema-btn--primary"
            onClick={() => navigate('/booking', { state: { tab: 'private' } })}
          >
            Join the Cartel
              </button>
        </div>
      </section>

      <section className="cinema-intro" aria-label="About Canine Cartel">
        <div className="cinema-intro__grid">
          <div className="cinema-intro__lead">
            <span className="cinema-intro__eyebrow">A calmer way forward</span>
            <h2>
              Training that fits
              <br />
              <em>your life together.</em>
            </h2>
          </div>
          <div className="cinema-intro__body">
            <p>
              Canine Cartel is Douglas Davenport&apos;s practice for people who want a steadier dog and a
              clearer relationship — manners that hold at home, on walks, and out in the world.
            </p>
            <p>
              Sessions are warm, structured, and science-led: reward-based teaching, patient coaching for
              you as the handler, and practice in the everyday places that matter across SW Sydney.
            </p>
            <dl className="cinema-intro__facts">
              <div>
                <dt>Your trainer</dt>
                <dd>Douglas Davenport</dd>
              </div>
              <div>
                <dt>How we work</dt>
                <dd>Kind, clear, reward-based guidance</dd>
              </div>
              <div>
                <dt>Where</dt>
                <dd>SW Sydney &amp; surrounds</dd>
              </div>
            </dl>
            <button type="button" className="cinema-btn cinema-btn--soft" onClick={() => navigate('/about')}>
              Learn about the method
            </button>
          </div>
        </div>
      </section>

      <ProgramsFilmstrip />
      <PathQuiz />
      <ProofFeatured />

      <section className="cinema-close" aria-label="Book training">
        <h2>
          READY TO
          <br />
          <em>LEAD?</em>
        </h2>
        <p>Book a class or consultation and start building reliability that holds in the real world.</p>
        <button type="button" className="cinema-btn cinema-btn--amber" onClick={() => navigate('/booking')}>
          Book a class
        </button>
      </section>
        </div>
  );
}

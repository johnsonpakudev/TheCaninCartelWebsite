import { useNavigate } from 'react-router-dom';
import CinemaHero from '../components/home/CinemaHero';
import ProgramsFilmstrip from '../components/home/ProgramsFilmstrip';
import PathQuiz from '../components/home/PathQuiz';
import ProofFeatured from '../components/home/ProofFeatured';
import { MotionReveal } from '../components/MotionReveal';
import '../components/home/home-cinema.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-cinema">
      <CinemaHero />

      <MotionReveal as="section" className="cinema-intro" aria-label="About Canine Cartel">
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
              Sessions are warm, structured, and science-led: reward-based teaching, patient coaching for you
              as the handler, and practice in the everyday places that matter across SW Sydney.
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
                <dd>Cumberland · Fairfield · Liverpool · Camden · Macarthur</dd>
              </div>
            </dl>
            <button type="button" className="cinema-btn cinema-btn--soft" onClick={() => navigate('/about')}>
              Learn about the method
            </button>
          </div>
        </div>
      </MotionReveal>

      <ProgramsFilmstrip />
      <PathQuiz />
      <ProofFeatured />

      <section className="cinema-close" aria-label="Book training">
        <h2>
          Ready to
          <br />
          <em>begin?</em>
        </h2>
        <p>Start with a consult, or join the waitlist for the next group intake.</p>
        <button type="button" className="cinema-btn cinema-btn--amber" onClick={() => navigate('/booking')}>
          Book training
        </button>
      </section>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div>
            <div className="site-footer__brand-mark">
              Canine<em>Cartel</em>
            </div>
            <p className="site-footer__desc">
              Calm, clear training for handlers who want manners that hold at home, on walks, and out in the
              world.
            </p>
            <div className="site-footer__social">
              <a href="https://www.instagram.com/the_caninecartel" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>

          <div className="site-footer__col">
            <h4>Explore</h4>
            <Link to="/programs">Programs</Link>
            <Link to="/about">About</Link>
            <Link to="/booking">Booking</Link>
          </div>

          <div className="site-footer__col">
            <h4>Contact</h4>
            <a href="tel:0428077817">0428 077 817</a>
            <a href="mailto:caninecartel@gmail.com">caninecartel@gmail.com</a>
          </div>

          <div className="site-footer__col">
            <h4>Get started</h4>
            <p className="site-footer__cta-copy">Book a consult or join the waitlist — we&apos;ll match you to the right path.</p>
            <button type="button" className="site-footer__cta motion-press" onClick={() => navigate('/booking')}>
              Book training
            </button>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__regions">
            Proudly serving Cumberland · Fairfield · Liverpool · Camden · Macarthur
          </p>
          <p className="site-footer__copy">© {new Date().getFullYear()} Canine Cartel</p>
        </div>
      </div>
    </footer>
  );
}

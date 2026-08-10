import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    function onScroll() {
      setIsTop(window.scrollY < 40);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return (
    <header className={`site-navbar${isHome ? ' is-home' : ''}${isTop ? ' is-top' : ''}`}>
      <div className="site-navbar__bar">
        <Link to="/" className="site-navbar__brand">
          <img src="/BlackLogo.png" alt="" className="site-navbar__logo" />
          <span className="site-navbar__wordmark">
            Canine<em>Cartel</em>
          </span>
        </Link>

        <nav className="site-navbar__links" aria-label="Primary">
          <NavLink to="/" className={({ isActive }) => `site-navbar__link${isActive ? ' is-active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/programs" className={({ isActive }) => `site-navbar__link${isActive ? ' is-active' : ''}`}>
            Programs
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `site-navbar__link${isActive ? ' is-active' : ''}`}>
            About
          </NavLink>
        </nav>

        <button type="button" className="site-navbar__cta motion-press" onClick={() => navigate('/booking')}>
          Join the Cartel
        </button>
      </div>
    </header>
  );
}

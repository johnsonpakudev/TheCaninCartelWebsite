import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="site-bottom-nav" aria-label="Mobile">
      <NavLink to="/" className={({ isActive }) => `site-bottom-nav__item${isActive ? ' is-active' : ''}`} end>
        <span className="material-symbols-outlined" aria-hidden="true">
          home
        </span>
        Home
      </NavLink>
      <NavLink
        to="/programs"
        className={({ isActive }) => `site-bottom-nav__item${isActive ? ' is-active' : ''}`}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          school
        </span>
        Classes
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => `site-bottom-nav__item${isActive ? ' is-active' : ''}`}>
        <span className="material-symbols-outlined" aria-hidden="true">
          person
        </span>
        About
      </NavLink>
      <NavLink
        to="/booking"
        className={({ isActive }) => `site-bottom-nav__item${isActive ? ' is-active' : ''}`}
      >
        <div className="site-bottom-nav__book">
          <span className="material-symbols-outlined" aria-hidden="true">
            calendar_today
          </span>
        </div>
        Booking
      </NavLink>
    </nav>
  );
}

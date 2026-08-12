import { useEffect, useId, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MotionReveal } from '../components/MotionReveal';
import { resolveBookingFromSelection } from '../constants/programs';
import '../styles/pages-cinema.css';

const RETURNING_KEY = 'tcc_booking_returning';
const CONTACT_EMAIL = 'caninecartel@gmail.com';
const PATH_IDS = ['consultation', 'private', 'classes'];

const PATHS = [
  {
    id: 'consultation',
    label: 'Consultation',
    title: 'Initial consultation',
    desc: 'Best starting point for new clients. Tell us about your dog and we will map the right path forward.',
    recommended: true,
    cta: 'Send a message',
    expect: [
      { label: 'Duration', value: 'About 60 minutes' },
      { label: 'Format', value: 'Message to schedule' },
      { label: 'Prep', value: 'Note behaviors you want to change' },
    ],
    points: [
      'Recommended for new clients',
      'Behaviour & goals review',
      'Clear plan before you enroll',
    ],
  },
  {
    id: 'private',
    label: 'Private',
    title: 'Private 1-on-1',
    desc: 'Personalized coaching for you and your dog — book a focused session tailored to your goals.',
    cta: 'Book private session',
    expect: [
      { label: 'Duration', value: 'About 60 minutes' },
      { label: 'Format', value: '1-on-1 in SW Sydney' },
      { label: 'Prep', value: 'Bring goals + recent challenges' },
    ],
    points: [
      '1-on-1 calendar booking',
      'Tailored goals for your dog',
      'Ideal for focused skill work',
    ],
  },
  {
    id: 'classes',
    label: 'Classes',
    title: 'Group classes',
    desc: 'Seasonal group intakes for Puppy, Foundations, and Advanced. Join the waitlist for the next cohort.',
    cta: 'Join waitlist',
    expect: [
      { label: 'Format', value: '5-week group courses' },
      { label: 'Next intake', value: 'Openings announced seasonally' },
      { label: 'Best start', value: 'Consult first if unsure' },
    ],
    points: [
      'Puppy · Foundations · Advanced pathways',
      'Small groups with individual feedback',
      'Waitlist notifies you when a cohort opens',
    ],
  },
];

function readReturningFlag() {
  try {
    return localStorage.getItem(RETURNING_KEY) === '1';
  } catch {
    return false;
  }
}

function markReturningClient() {
  try {
    localStorage.setItem(RETURNING_KEY, '1');
  } catch {
    /* ignore private mode */
  }
}

function resolveInitialPath(state) {
  if (state?.tab && PATH_IDS.includes(state.tab)) return state.tab;
  const fromProgram = resolveBookingFromSelection(state?.selectedProgram);
  if (fromProgram) return fromProgram.path;
  return readReturningFlag() ? 'private' : 'consultation';
}

function buildWaitlistMail(programLabel) {
  const preferred = programLabel || 'Puppy / Foundations / Advanced';
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    'Group class waitlist'
  )}&body=${encodeURIComponent(
    `Hi — please add me to the group class waitlist.\n\nDog name:\nAge / breed:\nPreferred program: ${preferred}\nSuburb:\nPhone:\n`
  )}`;
}

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const baseId = useId();
  const [activePath, setActivePath] = useState(() => resolveInitialPath(location.state));
  const [selectedProgram, setSelectedProgram] = useState(() => location.state?.selectedProgram || null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState('idle');
  const [stageEnterKey, setStageEnterKey] = useState(0);
  const pathRef = useRef(activePath);
  const retryTimerRef = useRef(null);
  const sheetCloseTimerRef = useRef(null);

  useEffect(() => {
    pathRef.current = activePath;
  }, [activePath]);

  useEffect(() => {
    if (location.state?.tab && PATH_IDS.includes(location.state.tab)) {
      clearSheetCloseTimer();
      setActivePath(location.state.tab);
      setSelectedProgram(location.state.selectedProgram || null);
      setSheetOpen(false);
      setSheetClosing(false);
      return;
    }
    if (location.state?.selectedProgram) {
      const resolved = resolveBookingFromSelection(location.state.selectedProgram);
      clearSheetCloseTimer();
      setActivePath(resolved?.path || 'consultation');
      setSelectedProgram(location.state.selectedProgram);
      setSheetOpen(false);
      setSheetClosing(false);
    }
  }, [location.state]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      clearRetryTimer();
      clearSheetCloseTimer();
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  function clearSheetCloseTimer() {
    if (sheetCloseTimerRef.current) {
      window.clearTimeout(sheetCloseTimerRef.current);
      sheetCloseTimerRef.current = null;
    }
  }

  function finishSheetClose() {
    clearSheetCloseTimer();
    setSheetOpen(false);
    setSheetClosing(false);
  }

  function clearRetryTimer() {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }

  function initializeCalendar(attempt = 0) {
    if (pathRef.current !== 'private') return;

    const url = import.meta.env.VITE_GOOGLE_CALENDAR_PRIVATE_URL;
    if (!url) {
      setCalendarStatus('error');
      return;
    }

    if (!window.calendar?.schedulingButton) {
      if (attempt >= 10) {
        setCalendarStatus('error');
        return;
      }
      setCalendarStatus('loading');
      clearRetryTimer();
      retryTimerRef.current = window.setTimeout(() => initializeCalendar(attempt + 1), 250);
      return;
    }

    const container = document.getElementById('booking-sheet-calendar');
    if (!container) {
      setCalendarStatus('error');
      return;
    }

    try {
      container.innerHTML = '';
      window.calendar.schedulingButton.load({
        url,
        color: '#D97706',
        label: 'Book private session',
        target: container,
      });
      setCalendarStatus('ready');
    } catch {
      setCalendarStatus('error');
    }
  }

  useEffect(() => {
    if (!sheetOpen || activePath !== 'private') {
      clearRetryTimer();
      if (!sheetOpen) setCalendarStatus('idle');
      return undefined;
    }

    setCalendarStatus('loading');
    const timer = window.setTimeout(() => initializeCalendar(), 60);
    return () => {
      window.clearTimeout(timer);
      clearRetryTimer();
    };
  }, [sheetOpen, activePath]);

  function selectPath(pathId, { animate = false } = {}) {
    clearSheetCloseTimer();
    setActivePath(pathId);
    setSheetOpen(false);
    setSheetClosing(false);
    if (pathId === 'private') markReturningClient();
    // Pointer path changes get a soft enter; keyboard arrowing stays instant.
    if (animate) setStageEnterKey((key) => key + 1);
  }

  function closeSheet() {
    if (!sheetOpen || sheetClosing) return;
    setSheetClosing(true);
    clearSheetCloseTimer();
    sheetCloseTimerRef.current = window.setTimeout(finishSheetClose, 400);
  }

  function handleSheetAnimationEnd(e) {
    if (e.target !== e.currentTarget) return;
    if (!sheetClosing) return;
    finishSheetClose();
  }

  function openSheet() {
    if (activePath === 'private') markReturningClient();
    clearSheetCloseTimer();
    setSheetClosing(false);
    setSheetOpen(true);
  }

  function onPathKeyDown(event) {
    const index = PATH_IDS.indexOf(activePath);
    if (index < 0) return;

    let next = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = PATH_IDS[(index + 1) % PATH_IDS.length];
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = PATH_IDS[(index - 1 + PATH_IDS.length) % PATH_IDS.length];
    }
    if (event.key === 'Home') next = PATH_IDS[0];
    if (event.key === 'End') next = PATH_IDS[PATH_IDS.length - 1];

    if (!next) return;
    event.preventDefault();
    selectPath(next);
    document.getElementById(`${baseId}-path-${next}`)?.focus();
  }

  const active = PATHS.find((path) => path.id === activePath) || PATHS[0];

  return (
    <div className="cinema-page cinema-page--booking">
      <header className="booking-hero">
        <div className="booking-hero__copy">
          <span className="cinema-page__eyebrow">Booking</span>
          <h1>
            Book your
            <br />
            <em>next step.</em>
          </h1>
          <p className="cinema-page__lead">
            New clients usually start with a consultation. Choose your path, then take one clear next step.
          </p>
        </div>
        <aside className="booking-hero__trust" aria-label="Service area and contact">
          <p>
            <strong>SW Sydney</strong>
            Serving Cumberland, Fairfield, Liverpool, Camden &amp; Macarthur.
          </p>
          <a href="tel:0428077817">0428 077 817</a>
        </aside>
      </header>

      <MotionReveal as="section" className="booking-shell" aria-label="Book a service">
        {selectedProgram && (
          <div className="booking-recommendation" role="status">
            <span className="booking-recommendation__label">Based on your choice</span>
            <strong>{selectedProgram}</strong>
            <button
              type="button"
              className="booking-recommendation__clear"
              onClick={() => setSelectedProgram(null)}
            >
              Clear
            </button>
          </div>
        )}
        <div
          className="booking-chooser"
          role="tablist"
          aria-label="Booking path"
          onKeyDown={onPathKeyDown}
        >
          {PATHS.map((path) => (
            <button
              key={path.id}
              id={`${baseId}-path-${path.id}`}
              type="button"
              role="tab"
              aria-selected={activePath === path.id}
              aria-controls={`${baseId}-stage`}
              tabIndex={activePath === path.id ? 0 : -1}
              className={`booking-chooser__btn${activePath === path.id ? ' is-active' : ''}${
                path.recommended ? ' is-recommended' : ''
              }`}
              onClick={() => selectPath(path.id, { animate: true })}
            >
              <span className="booking-chooser__label">{path.label}</span>
              {path.recommended && <span className="booking-chooser__hint">Start here</span>}
            </button>
          ))}
        </div>

        <div
          id={`${baseId}-stage`}
          className="booking-stage"
          role="tabpanel"
          aria-labelledby={`${baseId}-path-${active.id}`}
        >
          <div
            key={stageEnterKey}
            className={`booking-stage__copy${stageEnterKey > 0 ? ' motion-enter' : ''}`}
          >
            <span className="cinema-page__eyebrow">{active.label}</span>
            <h2>{active.title}</h2>
            <p>{active.desc}</p>

            <dl className="booking-expect">
              {active.expect.map((item) => (
                <div key={item.label} className="booking-expect__item">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="booking-stage__points">
              {active.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="booking-stage__cta">
            {activePath === 'classes' && (
              <>
                <a className="cinema-btn cinema-btn--amber" href={buildWaitlistMail(selectedProgram)}>
                  Join waitlist
                </a>
                <button
                  type="button"
                  className="cinema-btn cinema-btn--ghost"
                  onClick={() => navigate('/programs')}
                >
                  View programs
                </button>
                <p className="booking-stage__aside">
                  Prefer a call? <a href="tel:0428077817">0428 077 817</a>
                </p>
              </>
            )}

            {activePath === 'private' && (
              <>
                <button type="button" className="cinema-btn cinema-btn--amber" onClick={openSheet}>
                  {active.cta}
                </button>
                <p className="booking-stage__aside">You&apos;ll finish booking in Google Calendar.</p>
              </>
            )}

            {activePath === 'consultation' && (
              <>
                <button type="button" className="cinema-btn cinema-btn--amber" onClick={openSheet}>
                  {active.cta}
                </button>
                <p className="booking-stage__aside">Opens a short form — sends to {CONTACT_EMAIL}.</p>
              </>
            )}
          </div>
        </div>
      </MotionReveal>

      {(sheetOpen || sheetClosing) && activePath === 'private' && (
        <BookingSheet
          mode="calendar"
          title={active.title}
          status={calendarStatus}
          closing={sheetClosing}
          onClose={closeSheet}
          onAnimationEnd={handleSheetAnimationEnd}
          onRetry={() => {
            setCalendarStatus('loading');
            initializeCalendar();
          }}
        />
      )}

      {(sheetOpen || sheetClosing) && activePath === 'consultation' && (
        <BookingSheet
          mode="message"
          title={active.title}
          selectedProgram={selectedProgram}
          closing={sheetClosing}
          onClose={closeSheet}
          onAnimationEnd={handleSheetAnimationEnd}
        />
      )}
    </div>
  );
}

function BookingSheet({ mode, title, selectedProgram, status, closing, onClose, onAnimationEnd, onRetry }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="booking-sheet" role="presentation">
      <button type="button" className="booking-sheet__backdrop" aria-label="Close booking sheet" onClick={onClose} />
      <div
        ref={dialogRef}
        className={`booking-sheet__dialog${mode === 'message' ? ' booking-sheet__dialog--form' : ''}${closing ? ' is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-sheet-title"
        onAnimationEnd={onAnimationEnd}
      >
        <div className="booking-sheet__head">
          <div>
            <span className="cinema-page__eyebrow">{mode === 'message' ? 'Message us' : 'Book now'}</span>
            <h2 id="booking-sheet-title">{title}</h2>
          </div>
          <button ref={closeRef} type="button" className="booking-sheet__close" onClick={onClose}>
            Close
          </button>
        </div>

        {mode === 'message' ? (
          <ConsultMessageForm selectedProgram={selectedProgram} />
        ) : (
          <>
            <p className="booking-sheet__handoff">You&apos;ll finish booking in Google Calendar.</p>

            {status === 'loading' && (
              <p className="booking-sheet__status" role="status">
                Loading calendar…
              </p>
            )}

            {status === 'error' && (
              <div className="booking-sheet__fallback" role="alert">
                <p>Calendar is unavailable right now. Call or text and we&apos;ll lock in a time.</p>
                <a className="cinema-btn cinema-btn--amber" href="tel:0428077817">
                  Call 0428 077 817
                </a>
                <button type="button" className="cinema-btn cinema-btn--ghost" onClick={onRetry}>
                  Try calendar again
                </button>
              </div>
            )}

            <div
              id="booking-sheet-calendar"
              className={`google-btn-host${status === 'ready' ? ' is-ready' : ''}`}
              hidden={status === 'error'}
              aria-hidden={status !== 'ready'}
            />
          </>
        )}
      </div>
    </div>
  );
}

function ConsultMessageForm({ selectedProgram }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dog: '',
    suburb: '',
    message: '',
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();

    const body = [
      'Hi — I would like to book an initial consultation.',
      '',
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `Phone: ${form.phone.trim() || '—'}`,
      `Dog: ${form.dog.trim() || '—'}`,
      `Suburb: ${form.suburb.trim() || '—'}`,
      selectedProgram ? `Suggested path: ${selectedProgram}` : null,
      '',
      'Message:',
      form.message.trim(),
    ]
      .filter((line) => line !== null)
      .join('\n');

    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      'Consultation enquiry'
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
  }

  return (
    <form className="booking-form" onSubmit={onSubmit} noValidate={false}>
      <p className="booking-sheet__handoff">
        Send a short message and we will reply to schedule your consultation.
      </p>

      <div className="booking-form__grid">
        <label className="booking-form__field">
          <span>Your name</span>
          <input name="name" type="text" required autoComplete="name" value={form.name} onChange={updateField} />
        </label>
        <label className="booking-form__field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={updateField}
          />
        </label>
        <label className="booking-form__field">
          <span>Phone</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={updateField}
          />
        </label>
        <label className="booking-form__field">
          <span>Dog name / breed</span>
          <input name="dog" type="text" value={form.dog} onChange={updateField} />
        </label>
        <label className="booking-form__field booking-form__field--full">
          <span>Suburb</span>
          <input name="suburb" type="text" value={form.suburb} onChange={updateField} />
        </label>
        <label className="booking-form__field booking-form__field--full">
          <span>What do you want help with?</span>
          <textarea
            name="message"
            required
            rows={4}
            value={form.message}
            onChange={updateField}
            placeholder="Goals, challenges, age, and anything useful to know…"
          />
        </label>
      </div>

      <div className="booking-form__actions">
        <button type="submit" className="cinema-btn cinema-btn--amber">
          Send message
        </button>
        <p className="booking-form__note">
          Opens your email app to {CONTACT_EMAIL}. Or call{' '}
          <a href="tel:0428077817">0428 077 817</a>.
        </p>
      </div>
    </form>
  );
}

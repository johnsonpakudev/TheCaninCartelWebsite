import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeClassic = () => {
  const navigate = useNavigate();
  const [activeTier, setActiveTier] = useState('puppy');
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [result, setResult] = useState(null);

  const tiers = {
    puppy: {
      title: "Puppy Preschool",
      subtitle: "FOR PUPPIES 8-16 WEEKS OLD",
      desc: "Socialization, basic manners, and preventing bad habits before they start.",
      bullets: ["House Training Blueprint", "Social Confidence Skills", "Marker Neutrality"],
      btnText: "Secure a Spot",
      img: "/DogTrainer5.jpg"
    },
    foundations: {
      title: "Foundations for Focus",
      subtitle: "FOR DOGS 4-12 MONTHS OLD",
      desc: "The essential bridge between puppyhood and adult reliability.",
      bullets: ["Reliable Impulse Control", "Stress-Free Walking", "Cooperative Care"],
      btnText: "Start Foundations",
      img: "/DogTrainer5.jpg"
    },
    advanced: {
      title: "Advanced Skills",
      subtitle: "FOR THE RELIABLE DOG",
      desc: "Designed for high-level independence and total harmony with your dog.",
      bullets: ["Off-Lead Reliability", "Distance Mastery", "Neutrality in Public"],
      btnText: "Master Advanced",
      img: "/DogTrainer5.jpg"
    }
  };

  const blueprints = [
    {
      icon: "visibility",
      title: "Discovery",
      desc: "Psychology & manners for a balanced environment."
    },
    {
      icon: "psychology",
      title: "Immersion",
      desc: "Advanced handling and real-world controllability."
    },
    {
      icon: "person_celebrate",
      title: "The Dominator",
      desc: "Mastery of the art of canine communication."
    }
  ];

  const handleQuizNext = (key, value) => {
    const newAnswers = { ...quizAnswers, [key]: value };
    setQuizAnswers(newAnswers);

    if (quizStep < 5) {
      setQuizStep(quizStep + 1);
    } else {
      calculateRecommendation(newAnswers);
    }
  };

  const calculateRecommendation = (answers) => {
    let rec = "";
    let reason = "";

    if (answers.social === 'reactive' || answers.social === 'fearful') {
      rec = "Behavioral Consultation";
      reason = "Reactive or fearful behaviors require an expert diagnostic approach before entering a group environment.";
    } else if (answers.age === 'puppy') {
      rec = "Puppy Preschool";
      reason = "Your puppy is in their critical development window—now is the time for structured socialization.";
    } else if (answers.history === 'failed' || answers.history === 'zero') {
      rec = "One-on-One Training";
      reason = "A tailored individual session will provide the reset needed to build a successful foundation.";
    } else if (answers.lead === 'pulls' || answers.history === 'basics') {
      rec = "Foundations for Focus";
      reason = "Refining engagement and impulse control is the bridge to the reliability you're looking for.";
    } else if (answers.lead === 'advanced' && answers.history === 'advanced') {
      rec = "Advanced Skills";
      reason = "You're ready for the mastery phase: achieving total off-lead freedom and public neutrality.";
    } else {
      rec = "Foundations for Focus";
      reason = "This program provides the most versatile results for dogs needing real-world reliability.";
    }

    setResult({ title: rec, reason: reason });
    setQuizStep(6);
  };

  const resetQuiz = () => {
    setQuizStep(1);
    setQuizAnswers({});
    setResult(null);
  };

  const testimonials = [
    {
      initial: "C",
      stars: 5,
      text: "Douglas transformed Max's reactivity into total focus. Their bond is now stronger than ever.",
      author: "Chloe & Max",
      breed: "Border Collie"
    },
    {
      initial: "M",
      stars: 5,
      text: "The Puppy Preschool was the best investment we made. Buster is so well-behaved now!",
      author: "Mark & Buster",
      breed: "Golden Retriever"
    },
    {
      initial: "S",
      stars: 5,
      text: "Advanced skills totally changed our off-lead life. Max's recall is now 100% reliable.",
      author: "Sarah & Max",
      breed: "G. Shepherd"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="material-symbols-outlined bolt-icon">bolt</span>
              <span>THE CANINE CARTEL</span>
            </div>
            <h1>MASTER <br />YOUR <br /><span className="gold-italic">PACK.</span></h1>
            <p className="hero-subtext">
              We don't just train dogs; we build handlers. Experience elite communication and reclaim your relationship through science-based results.
            </p>
            <div className="hero-buttons">
              <button className="btn-dark-pill" onClick={() => navigate('/booking', { state: { tab: 'private' } })}>
                Join the Cartel <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="btn-outline-pill" onClick={() => navigate('/booking', { state: { tab: 'consultation' } })}>
                Free Consultation
              </button>
            </div>
            <div className="social-proof">
              <div className="avatar-group">
                {[1, 2, 3, 4].map(i => <div key={i} className={`avatar-small avatar-${i}`}></div>)}
              </div>
              <p><b>500+ Packs</b> Transformed this year</p>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-box">
              <img src="/DogTrainer5.jpg" alt="Douglas Training" />
              <div className="review-overlay-pill">
                <div className="review-stars">★★★★★</div>
                <p>"Douglas achieved off-lead reliability with our GSD that we thought was impossible. Truly elite handling."</p>
                <div className="review-author-line">— SARAH & LUNA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find Your Path - Interactive Questionnaire */}
      <section className="find-path-section">
        <div className="path-card dark-glass-card">
          <div className="path-header">
            <h2>Find Your Path</h2>
            <p>Tell us about your dog to find the right program for your needs.</p>
          </div>

          <div className="path-quiz">
            {quizStep === 1 && (
              <div className="quiz-step animate-fade-in">
                <span className="step-tag">Phase 01/05: Profiles</span>
                <h3>What is your dog's current age?</h3>
                <div className="quiz-options">
                  <button onClick={() => handleQuizNext('age', 'puppy')}>8-16 Weeks</button>
                  <button onClick={() => handleQuizNext('age', 'teenager')}>4-12 Months</button>
                  <button onClick={() => handleQuizNext('age', 'adult')}>1-3 Years</button>
                  <button onClick={() => handleQuizNext('age', 'senior')}>4 Years +</button>
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div className="quiz-step animate-fade-in">
                <span className="step-tag">Phase 02/05: History</span>
                <h3>Current level of training?</h3>
                <div className="quiz-options">
                  <button onClick={() => handleQuizNext('history', 'zero')}>Zero/Beginner</button>
                  <button onClick={() => handleQuizNext('history', 'basics')}>Knows the Basics</button>
                  <button onClick={() => handleQuizNext('history', 'failed')}>Failed Other Methods</button>
                  <button onClick={() => handleQuizNext('history', 'advanced')}>Advanced but Inconsistent</button>
                </div>
              </div>
            )}

            {quizStep === 3 && (
              <div className="quiz-step animate-fade-in">
                <span className="step-tag">Phase 03/05: Temperament</span>
                <h3>How is their social behavior?</h3>
                <div className="quiz-options">
                  <button onClick={() => handleQuizNext('social', 'neutral')}>Neutral/Focused</button>
                  <button onClick={() => handleQuizNext('social', 'friendly')}>Over-Friendly/Excitable</button>
                  <button onClick={() => handleQuizNext('social', 'reactive')}>Barky/Reactive</button>
                  <button onClick={() => handleQuizNext('social', 'fearful')}>Timid/Fearful</button>
                </div>
              </div>
            )}

            {quizStep === 4 && (
              <div className="quiz-step animate-fade-in">
                <span className="step-tag">Phase 04/05: Mobility</span>
                <h3>How are their lead manners?</h3>
                <div className="quiz-options">
                  <button onClick={() => handleQuizNext('lead', 'pulls')}>Pulls Constantly</button>
                  <button onClick={() => handleQuizNext('lead', 'moderate')}>Moderate Pulling</button>
                  <button onClick={() => handleQuizNext('lead', 'good')}>Good - Needs Off-Lead Work</button>
                </div>
              </div>
            )}

            {quizStep === 5 && (
              <div className="quiz-step animate-fade-in">
                <span className="step-tag">Phase 05/05: Objectives</span>
                <h3>What is your primary objective?</h3>
                <div className="quiz-options">
                  <button onClick={() => handleQuizNext('goal', 'family')}>Stress-free Family Living</button>
                  <button onClick={() => handleQuizNext('goal', 'elite')}>Elite Reliability & Freedom</button>
                  <button onClick={() => handleQuizNext('goal', 'safety')}>Basic Control & Safety</button>
                </div>
              </div>
            )}

            {quizStep === 6 && (
              <div className="quiz-result animate-fade-in">
                <span className="step-tag">YOUR DIAGNOSTIC RESULT</span>
                <div className="result-main">
                  <span className="material-symbols-outlined result-icon">verified</span>
                  <h3>{result.title}</h3>
                  <p>{result.reason}</p>
                  <div className="result-buttons">
                    <button className="btn-warm-orange" onClick={() => navigate('/booking', { state: { selectedProgram: result.title } })}>
                      BOOK CLASS
                    </button>
                    <button className="btn-outline-white" onClick={() => navigate('/programs')}>
                      LEARN MORE
                    </button>
                    <button className="btn-reset" onClick={resetQuiz}>Restart Diagnostic</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <span className="material-symbols-outlined background-icon">search</span>
        </div>
      </section>

      {/* Training Tiers */}
      <section className="tiers-wrapper" id="tiers">
        <div className="tiers-header">
          <h2>Training Tiers</h2>
          <p>Systematic program levels for every stage of dog handling.</p>
        </div>

        <div className="tiers-tabs">
          <button className={activeTier === 'puppy' ? 'active' : ''} onClick={() => setActiveTier('puppy')}>PUPPY</button>
          <button className={activeTier === 'foundations' ? 'active' : ''} onClick={() => setActiveTier('foundations')}>FOUNDATIONS</button>
          <button className={activeTier === 'advanced' ? 'active' : ''} onClick={() => setActiveTier('advanced')}>ADVANCED</button>
        </div>

        <div className="tier-content animate-fade-in" key={activeTier}>
          <div className="tier-info">
            <span className="tier-subtitle">{tiers[activeTier].subtitle}</span>
            <h3>{tiers[activeTier].title}</h3>
            <p>{tiers[activeTier].desc}</p>
            <ul className="tier-list">
              {tiers[activeTier].bullets.map((b, i) => (
                <li key={i}>
                  <span className="material-symbols-outlined bullet-icon">check_circle</span>
                  {b}
                </li>
              ))}
            </ul>
            <button className="btn-dark-small" onClick={() => navigate('/booking')}>
              {tiers[activeTier].btnText}
            </button>
          </div>
          <div className="tier-image">
            <div className="tier-img-container">
              <img src={tiers[activeTier].img} alt={tiers[activeTier].title} />
              <div className="play-btn-overlay">
                <span className="material-symbols-outlined">play_circle</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blueprint Section */}
      <section className="blueprint-section">
        <div className="blueprint-header">
          <h2>The Blueprint to Freedom</h2>
          <p>Our proven framework for sustainable behavior change.</p>
        </div>
        <div className="blueprint-grid">
          {blueprints.map((item, i) => (
            <div className="blueprint-card" key={i}>
              <div className="bp-icon-gold">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pack's Voice */}
      <section className="voice-section">
        <div className="voice-header">
          <h2>THE PACK'S VOICE</h2>
          <div className="tag-50">5.0</div>
        </div>
        <div className="voice-grid">
          {testimonials.map((t, i) => (
            <div className="voice-card glass-card interactive-card" key={i}>
              <div className="stars-row-gold">★★★★★</div>
              <p className="voice-text">"{t.text}"</p>
              <div className="voice-footer">
                <div className="author-circle">
                  <span>{t.initial}</span>
                </div>
                <div className="author-meta">
                  <strong>{t.author}</strong>
                  <span>{t.breed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regions Served Section */}
      <section className="regions-section">
        <div className="regions-header">
          <span className="sub-label-gold">LOCAL OPERATIONAL REACH</span>
          <h2>PROUDLY SERVING</h2>
          <p>Elite canine education delivered across Sydney's primary growth corridors.</p>
        </div>

        <div className="regions-grid">
          <div className="region-card interactive-card">
            <span className="region-nickname">THE NORTHERN ANCHOR</span>
            <h3>Cumberland Council</h3>
            <p className="region-desc">Established, high-density residential areas serving as our northern operational base.</p>
            <div className="region-hubs">
              <strong>Primary Hub:</strong> Merrylands / Merrylands West
            </div>
            <div className="region-suburbs">
              <strong>Key Suburbs:</strong> Greystanes, Pemulwuy, Guildford, Guildford West, Woodpark, Mays Hill, Granville (South).
            </div>
          </div>

          <div className="region-card interactive-card">
            <span className="region-nickname">THE CENTRAL LINK</span>
            <h3>Fairfield City Council</h3>
            <p className="region-desc">Moving south, the strategic bridge between the West and South West corridors.</p>
            <div className="region-hubs">
              <strong>Primary Hubs:</strong> Fairfield, Smithfield, Wetherill Park
            </div>
            <div className="region-suburbs">
              <strong>Key Suburbs:</strong> Fairfield Heights & West, Prairiewood, Wakeley, Bossley Park, Abbotsbury, Canley Heights & Vale, Bonnyrigg & Heights, St Johns Park.
            </div>
          </div>

          <div className="region-card interactive-card">
            <span className="region-nickname">THE REGIONAL HEART</span>
            <h3>Liverpool City Council</h3>
            <p className="region-desc">The central "engine room" featuring a mix of established blocks and major growth estates.</p>
            <div className="region-hubs">
              <strong>Primary Hub:</strong> Liverpool CBD
            </div>
            <div className="region-suburbs">
              <strong>Key Corridors:</strong> M5/Hume (Casula, Lurnea, Warwick Farm, Moorebank), The Western Belt (Hoxton Park, Prestons, Hinchinbrook, Green Valley), The Growth Fringe (Edmondson Park, Cecil Hills, Elizabeth Hills).
            </div>
          </div>

          <div className="region-card interactive-card">
            <span className="region-nickname">SOUTHERN GROWTH AREA</span>
            <h3>Camden Council</h3>
            <p className="region-desc">The "Macarthur" region: dominated by new, family-oriented master-planned estates.</p>
            <div className="region-hubs">
              <strong>Primary Hub:</strong> Gregory Hills
            </div>
            <div className="region-suburbs">
              <strong>Key Developments:</strong> Oran Park, Gledswood Hills, Leppington, Denham Court, Narellan, Mount Annan, Catherine Field.
            </div>
          </div>
        </div>
      </section>


      <style>{`
                .home-page { background: #FFFFFF; width: 100%; }
                
                /* Hero Section */
                .hero-section { padding: 40px 0 30px; }
                .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
                @media (max-width: 991px) { .hero-grid { grid-template-columns: 1fr; text-align: center; } }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #FEF3C7;
                    color: #D97706;
                    padding: 8px 16px;
                    border-radius: 50px;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    margin-bottom: 40px;
                }
                .bolt-icon { font-size: 14px; }
                .hero-text h1 {
                    font-size: 100px;
                    line-height: 0.85;
                    font-weight: 900;
                    margin-bottom: 32px;
                    letter-spacing: -4px;
                    color: #1a1a1a;
                }
                .gold-italic { 
                    font-family: 'Playfair Display', serif; 
                    font-style: italic; 
                    color: #D97706; 
                    font-weight: 700;
                }
                .hero-subtext { 
                    font-size: 20px; 
                    color: #666; 
                    line-height: 1.5; 
                    margin-bottom: 48px; 
                    max-width: 480px; 
                    font-weight: 400;
                }
                @media (max-width: 991px) { .hero-subtext { margin: 0 auto 48px; } }

                .hero-buttons { display: flex; gap: 16px; margin-bottom: 60px; }
                @media (max-width: 991px) { .hero-buttons { justify-content: center; } }
                
                .btn-dark-pill {
                    background: #1C1917;
                    color: white;
                    padding: 20px 36px;
                    border-radius: 50px;
                    font-weight: 900;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 14px;
                    letter-spacing: 0.5px;
                    transition: transform 100ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms ease, box-shadow 200ms ease;
                    border: none;
                    cursor: pointer;
                }
                .btn-dark-pill:hover {
                    background: #000;
                    transform: none;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.25);
                }
                @media (hover: hover) and (pointer: fine) {
                    .btn-dark-pill:hover { transform: translateY(-1px); }
                }
                .btn-dark-pill:active {
                    transform: scale(0.97);
                    transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms ease, box-shadow 200ms ease;
                }
                .btn-outline-pill {
                    background: #FFFFFF;
                    border: 1px solid #E5E7EB;
                    color: #1a1a1a;
                    padding: 20px 36px;
                    border-radius: 50px;
                    font-weight: 800;
                    font-size: 14px;
                    letter-spacing: 0.5px;
                    transition: transform 100ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms ease, border-color 200ms ease, color 200ms ease, box-shadow 200ms ease;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                    cursor: pointer;
                }
                .btn-outline-pill:hover {
                    background: #D97706;
                    border-color: #D97706;
                    color: white;
                    transform: none;
                    box-shadow: 0 10px 25px rgba(217, 119, 6, 0.3);
                }
                @media (hover: hover) and (pointer: fine) {
                    .btn-outline-pill:hover { transform: translateY(-1px); }
                }
                .btn-outline-pill:active {
                    transform: scale(0.97);
                    transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms ease, border-color 200ms ease, color 200ms ease, box-shadow 200ms ease;
                }

                .social-proof { display: flex; align-items: center; gap: 20px; }
                @media (max-width: 991px) { .social-proof { justify-content: center; } }
                .avatar-group { display: flex; }
                .avatar-small { 
                    width: 36px; 
                    height: 36px; 
                    border-radius: 50%; 
                    background-size: cover;
                    background-position: center;
                    border: 2px solid white; 
                    margin-left: -12px; 
                    background-color: #F3F4F6;
                }
                .avatar-small:first-child { margin-left: 0; }
                /* Dummy avatar images */
                .avatar-1 { background-image: url('https://i.pravatar.cc/100?u=1'); }
                .avatar-2 { background-image: url('https://i.pravatar.cc/100?u=2'); }
                .avatar-3 { background-image: url('https://i.pravatar.cc/100?u=3'); }
                .avatar-4 { background-image: url('https://i.pravatar.cc/100?u=4'); }
                
                .social-proof p { font-size: 14px; color: #666; }
                .social-proof p b { color: #1a1a1a; }

                .hero-img-box { 
                    position: relative; 
                    border-radius: 100px; 
                    overflow: hidden; 
                    height: 700px; 
                    box-shadow: 0 40px 100px rgba(0,0,0,0.1);
                }
                .hero-img-box img { width: 100%; height: 100%; object-fit: cover; }
                
                .review-overlay-pill {
                    position: absolute; 
                    bottom: 40px; 
                    left: 40px; 
                    right: 40px;
                    padding: 32px; 
                    border-radius: 40px;
                    background: rgba(28, 25, 23, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                }
                .review-stars { color: #F59E0B; margin-bottom: 12px; font-size: 16px; }
                .review-overlay-pill p { 
                    font-size: 15px; 
                    font-weight: 500; 
                    line-height: 1.6; 
                    margin-bottom: 16px; 
                    font-style: italic; 
                    color: rgba(255,255,255,0.9);
                }
                .review-author-line { 
                    font-size: 11px; 
                    font-weight: 800; 
                    letter-spacing: 2px;
                    color: #F59E0B; 
                    text-transform: uppercase;
                }

                /* Find Path */
                .find-path-section { background: #1C1917; padding: 30px 0; }
                .path-card { 
                    max-width: 900px; margin: 0 auto; background: rgba(255,255,255,0.03); 
                    border-radius: 40px; padding: 30px 40px; position: relative; overflow: hidden;
                    text-align: center; color: white;
                }
                .path-header h2 { font-size: 32px; color: white; margin-bottom: 4px; }
                .path-header p { color: #9CA3AF; margin-bottom: 20px; font-size: 14px; }
                .step-tag { color: #F59E0B; font-size: 8px; font-weight: 800; letter-spacing: 2px; display: block; margin-bottom: 4px; }
                .path-quiz h3 { font-size: 20px; color: #FFFFFF; margin-bottom: 20px; }
                .quiz-options { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
                 .quiz-options button {
                    background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1);
                    padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 13px;
                    transition: transform 100ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
                    cursor: pointer;
                }
                .quiz-options button:hover { 
                    background: #D97706; 
                    border-color: #F59E0B; 
                    transform: none;
                    box-shadow: 0 10px 20px rgba(217, 119, 6, 0.3);
                }
                @media (hover: hover) and (pointer: fine) {
                    .quiz-options button:hover { transform: translateY(-1px); }
                }
                .quiz-options button:active {
                    transform: scale(0.97);
                    transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
                }
                
                .quiz-result { text-align: center; padding: 10px 0; }
                .result-icon { font-size: 40px; color: #F59E0B; margin-bottom: 12px; }
                .result-main h3 { font-size: 36px; color: white; margin-bottom: 12px; text-transform: uppercase; letter-spacing: -1px; }
                .result-main p { color: #888; margin-bottom: 24px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.5; font-size: 15px; }
                .result-buttons { display: flex; flex-direction: column; align-items: center; gap: 14px; }
                .btn-outline-white {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    padding: 16px 40px;
                    border-radius: 14px;
                    font-weight: 800;
                    font-size: 14px;
                    letter-spacing: 1px;
                    width: 280px;
                    transition: background 200ms ease, border-color 200ms ease, transform 100ms cubic-bezier(0.23, 1, 0.32, 1);
                }
                .btn-outline-white:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: white;
                }
                .btn-outline-white:active {
                    transform: scale(0.97);
                    transition: background 200ms ease, border-color 200ms ease, transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
                }
                .btn-warm-orange { width: 280px; }
                .btn-reset { margin-top: 8px; background: transparent; color: #666; font-size: 11px; font-weight: 800; letter-spacing: 1px; }
                .btn-reset:hover { color: white; }
                .background-icon { position: absolute; right: -20px; bottom: -20px; font-size: 200px; color: rgba(255,255,255,0.03); transform: rotate(-15deg); }

                /* Tiers */
                .tiers-wrapper { padding: 60px 40px; max-width: 1400px; margin: 0 auto; }
                .tiers-header { text-align: center; margin-bottom: 32px; }
                .tiers-header h2 { font-size: 48px; margin-bottom: 8px; }
                .tiers-tabs { display: flex; justify-content: center; gap: 12px; margin-bottom: 32px; }
                .tiers-tabs button {
                    background: #F3F4F6; color: #9CA3AF; padding: 12px 32px; border-radius: 50px;
                    font-weight: 800; font-size: 11px; letter-spacing: 1px;
                }
                .tiers-tabs button.active { background: #F59E0B; color: white; }
                
                .tier-content { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
                @media (max-width: 991px) { .tier-content { grid-template-columns: 1fr; } }
                .tier-subtitle { color: #F59E0B; font-size: 10px; font-weight: 800; letter-spacing: 2px; display: block; margin-bottom: 16px; }
                .tier-info h3 { font-size: 42px; margin-bottom: 24px; }
                .tier-info p { color: #666; font-size: 16px; margin-bottom: 32px; }
                .tier-list { list-style: none; margin-bottom: 40px; }
                .tier-list li { display: flex; items-center; gap: 12px; font-weight: 700; margin-bottom: 14px; }
                .bullet-icon { color: #F59E0B; font-size: 20px; }
                 .btn-dark-small { 
                    background: #1C1917; color: white; padding: 16px 32px; border-radius: 12px; 
                    font-weight: 800; font-size: 13px; border: none; cursor: pointer;
                    transition: transform 100ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms ease, box-shadow 200ms ease;
                }
                .btn-dark-small:hover {
                    background: #000;
                    transform: none;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                }
                @media (hover: hover) and (pointer: fine) {
                    .btn-dark-small:hover { transform: translateY(-1px); }
                }
                .btn-dark-small:active {
                    transform: scale(0.97);
                    transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms ease, box-shadow 200ms ease;
                }

                .tier-img-container { position: relative; border-radius: 40px; overflow: hidden; height: 400px; }
                .tier-img-container img { width: 100%; height: 100%; object-fit: cover; }
                .play-btn-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
                .play-btn-overlay span { font-size: 80px; color: white; opacity: 0.8; }

                /* Blueprint */
                .blueprint-section { background: #1C1917; padding: 60px 0; text-align: center; }
                .blueprint-header h2 { font-size: 36px; color: white; margin-bottom: 8px; }
                .blueprint-header p { color: #888; margin-bottom: 32px; font-size: 15px; }
                .blueprint-grid { 
                    display: grid; 
                    grid-template-columns: repeat(3, 1fr); 
                    gap: 20px; 
                    max-width: 900px; 
                    margin: 0 auto;
                    padding: 0 20px; 
                }
                @media (max-width: 768px) { 
                    .blueprint-section { padding: 40px 0; }
                    .blueprint-grid { grid-template-columns: 1fr; gap: 0; } 
                    .blueprint-card { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
                    .blueprint-card:last-child { border-bottom: none; }
                    .bp-icon-gold { margin-bottom: 10px; }
                    .bp-icon-gold .material-symbols-outlined { font-size: 24px; }
                    .blueprint-card h3 { font-size: 18px; margin-bottom: 6px; }
                    .blueprint-card p { font-size: 13px; line-height: 1.4; }
                }
                .blueprint-card { padding: 20px 0; text-align: left; cursor: default; }
                .bp-icon-gold { color: #F59E0B; font-size: 32px; display: flex; align-items: center; justify-content: left; margin-bottom: 20px; }
                .bp-icon-gold .material-symbols-outlined { font-size: 32px; }
                .blueprint-card h3 { font-size: 20px; color: white; margin-bottom: 12px; transition: color 200ms ease; }
                .blueprint-card p { color: #666; font-size: 14px; line-height: 1.6; transition: color 200ms ease; }
                
                .blueprint-card:hover h3 { color: #F59E0B; }
                .blueprint-card:hover p { color: #FFFFFF; }

                /* Voice */
                .voice-section { padding: 60px 40px; max-width: 1400px; margin: 0 auto; }
                .voice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
                .voice-header h2 { font-size: 32px; letter-spacing: 2px; }
                .tag-50 { background: #F59E0B; color: white; padding: 10px 20px; border-radius: 12px; font-weight: 800; }
                
                .voice-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
                @media (max-width: 991px) { .voice-grid { grid-template-columns: 1fr; } }
                .voice-card { background: #F5F5F7; padding: 48px; border-radius: 40px; border: 1px solid #F59E0B; }
                .stars-row-gold { color: #F59E0B; margin-bottom: 24px; }
                .voice-text { font-size: 16px; font-weight: 500; font-style: italic; color: #4B5563; margin-bottom: 40px; }
                .voice-footer { display: flex; align-items: center; gap: 16px; }
                .author-circle { width: 48px; height: 48px; background: #FEF3C7; color: #F59E0B; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; }
                .author-meta strong { display: block; font-size: 14px; }
                .author-meta span { font-size: 12px; color: #9CA3AF; }

                /* Final CTA */
                .final-banner { padding: 10px; }
                .banner-content { background: #1C1917; border-radius: 60px; padding: 50px 40px; text-align: center; color: white; display: flex; flex-direction: column; align-items: center; gap: 24px; }
                .banner-content h2 { font-size: 88px; color: white; margin: 0; letter-spacing: -3px; line-height: 1; }
                .banner-subtext { font-size: 18px; color: #888; margin: 0; max-width: 600px; line-height: 1.6; }
                .gold-serif { color: #F59E0B; font-family: 'Playfair Display', serif; font-style: italic; }
                .btn-warm-orange { 
                    background: #F59E0B; 
                    color: white; 
                    padding: 22px 64px; 
                    border-radius: 50px; 
                    font-weight: 900; 
                    font-size: 16px; 
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    transition: transform 100ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms ease, box-shadow 200ms ease;
                    box-shadow: 0 15px 35px rgba(245, 158, 11, 0.4);
                    border: none;
                    cursor: pointer;
                }
                .btn-warm-orange:hover {
                    background: #D97706;
                    transform: none;
                    box-shadow: 0 25px 50px rgba(217, 119, 6, 0.5);
                }
                @media (hover: hover) and (pointer: fine) {
                    .btn-warm-orange:hover { transform: translateY(-1px); }
                }
                .btn-warm-orange:active {
                    transform: scale(0.97);
                    transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background 200ms ease, box-shadow 200ms ease;
                }
                .banner-footer { display: flex; justify-content: center; gap: 40px; color: #666; font-size: 13px; font-weight: 800; margin-top: 8px; }
                .banner-footer span { display: flex; items-center; gap: 10px; }

                /* Regions Section */
                .regions-section { padding: 100px 40px; background: #F9FAFB; text-align: center; }
                .regions-header { margin-bottom: 60px; }
                .sub-label-gold { color: #D97706; font-weight: 800; font-size: 11px; letter-spacing: 3px; display: block; margin-bottom: 16px; }
                .regions-header h2 { font-size: 56px; line-height: 0.9; margin-bottom: 16px; letter-spacing: -2px; }
                .regions-header p { color: #666; font-size: 18px; max-width: 500px; margin: 0 auto; }
                
                .regions-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 32px;
                  max-width: 1200px;
                  margin: 0 auto;
                }
                @media (max-width: 768px) {
                  .regions-grid { grid-template-columns: 1fr; }
                }
                
                .region-card {
                  background: white;
                  padding: 48px;
                  border-radius: 40px;
                  border: 1px solid rgba(0,0,0,0.06);
                  text-align: left;
                  transition: border-color 200ms ease, box-shadow 200ms ease;
                  display: flex;
                  flex-direction: column;
                }
                .region-card:hover {
                  border-color: #F59E0B;
                  box-shadow: 0 12px 28px rgba(0,0,0,0.06);
                }
                .region-nickname { 
                    font-size: 10px; 
                    font-weight: 900; 
                    color: #F59E0B; 
                    letter-spacing: 2px; 
                    margin-bottom: 12px;
                    text-transform: uppercase;
                }
                .region-card h3 { font-size: 24px; margin-bottom: 16px; color: #1a1a1a; letter-spacing: -0.5px; }
                .region-desc { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 24px; flex-grow: 1; }
                
                .region-hubs, .region-suburbs {
                    font-size: 13px;
                    line-height: 1.6;
                    color: #4B5563;
                    padding-top: 16px;
                    border-top: 1px solid #F3F4F6;
                    margin-top: 16px;
                }
                .region-hubs strong, .region-suburbs strong { color: #1a1a1a; font-weight: 800; }
                .region-suburbs { border: none; padding-top: 8px; margin-top: 0; }

                .animate-fade-in {
                  opacity: 1;
                  transform: translateY(0);
                  transition: opacity 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
                }
                @starting-style {
                  .animate-fade-in {
                    opacity: 0;
                    transform: translateY(6px);
                  }
                }
                @media (prefers-reduced-motion: reduce) {
                  .animate-fade-in { transition: none; opacity: 1; transform: none; }
                  .btn-dark-pill:active,
                  .btn-outline-pill:active,
                  .quiz-options button:active,
                  .btn-outline-white:active,
                  .btn-dark-small:active,
                  .btn-warm-orange:active { transform: none; }
                }

                /* Mobile Optimizations */
                @media (max-width: 768px) {
                    .hero-text h1 { font-size: 64px; letter-spacing: -2px; }
                    .hero-subtext { font-size: 16px; margin-bottom: 32px; }
                    .hero-img-box { height: 500px; border-radius: 60px; }
                    .review-overlay-pill { padding: 24px; bottom: 20px; left: 20px; right: 20px; border-radius: 30px; }
                    
                    .regions-section { padding: 60px 20px; }
                    .regions-header h2 { font-size: 42px; }
                    .region-card { padding: 32px; border-radius: 30px; }
                    
                    .banner-content h2 { font-size: 56px; letter-spacing: -1px; }
                    .banner-content { padding: 60px 20px; border-radius: 40px; }
                    .banner-footer { flex-direction: column; gap: 16px; }
                    .btn-warm-orange { width: 100%; padding: 20px 32px; font-size: 14px; }
                }

                @media (max-width: 480px) {
                    .hero-text h1 { font-size: 52px; }
                    .hero-buttons { flex-direction: column; }
                    .btn-dark-pill, .btn-outline-pill { width: 100%; justify-content: center; }
                    
                    .tiers-wrapper { padding: 40px 20px; }
                    .tier-info h3 { font-size: 32px; }
                    .tier-img-container { height: 300px; }
                    
                    .voice-section { padding: 40px 20px; }
                    .voice-card { padding: 32px; }
                    
                    .banner-content h2 { font-size: 42px; }
                }
            `}</style>
    </div >
  );
};

export default HomeClassic;

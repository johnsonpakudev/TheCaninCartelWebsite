import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function calculateRecommendation(answers) {
  if (answers.social === 'reactive' || answers.social === 'fearful') {
    return {
      title: 'Behavioral Consultation',
      reason:
        'Reactive or fearful behaviours need a careful plan before group classes — a consult maps the right next step.',
    };
  }
  if (answers.age === 'puppy') {
    return {
      title: 'Puppy Preschool',
      reason:
        'Your puppy is in their critical development window — structured socialisation and house manners now pay off later.',
    };
  }
  if (answers.history === 'failed' || answers.history === 'zero') {
    return {
      title: 'One-on-One Training',
      reason: 'A tailored private session gives you a clear reset and a foundation that fits your dog.',
    };
  }
  if (answers.lead === 'pulls' || answers.history === 'basics') {
    return {
      title: 'Foundations for Focus',
      reason: 'Engagement and impulse control are the bridge to the everyday reliability you want.',
    };
  }
  if (answers.lead === 'advanced' && answers.history === 'advanced') {
    return {
      title: 'Advanced Skills',
      reason: 'You are ready for the next layer: off-lead reliability and calm focus in busy public places.',
    };
  }
  return {
    title: 'Foundations for Focus',
    reason: 'This program gives the most versatile results for dogs needing real-world reliability.',
  };
}

const STEPS = {
  1: {
    tag: 'Step 1 of 5',
    question: "What is your dog's current age?",
    options: [
      { label: '8–15 Weeks', key: 'age', value: 'puppy' },
      { label: '4–12 Months', key: 'age', value: 'teenager' },
      { label: '1–3 Years', key: 'age', value: 'adult' },
      { label: '4 Years +', key: 'age', value: 'senior' },
    ],
  },
  2: {
    tag: 'Step 2 of 5',
    question: 'Current level of training?',
    options: [
      { label: 'Zero / Beginner', key: 'history', value: 'zero' },
      { label: 'Knows the Basics', key: 'history', value: 'basics' },
      { label: 'Tried other methods', key: 'history', value: 'failed' },
      { label: 'Advanced but inconsistent', key: 'history', value: 'advanced' },
    ],
  },
  3: {
    tag: 'Step 3 of 5',
    question: 'How is their social behaviour?',
    options: [
      { label: 'Neutral / Focused', key: 'social', value: 'neutral' },
      { label: 'Over-Friendly / Excitable', key: 'social', value: 'friendly' },
      { label: 'Barky / Reactive', key: 'social', value: 'reactive' },
      { label: 'Timid / Fearful', key: 'social', value: 'fearful' },
    ],
  },
  4: {
    tag: 'Step 4 of 5',
    question: 'How are their lead manners?',
    options: [
      { label: 'Pulls Constantly', key: 'lead', value: 'pulls' },
      { label: 'Moderate Pulling', key: 'lead', value: 'moderate' },
      { label: 'Good — Needs Off-Lead Work', key: 'lead', value: 'good' },
    ],
  },
  5: {
    tag: 'Step 5 of 5',
    question: 'What is your primary goal?',
    options: [
      { label: 'Stress-free family living', key: 'goal', value: 'family' },
      { label: 'Off-lead reliability & freedom', key: 'goal', value: 'elite' },
      { label: 'Basic control & safety', key: 'goal', value: 'safety' },
    ],
  },
};

export default function PathQuiz() {
  const navigate = useNavigate();
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [result, setResult] = useState(null);

  function handleQuizNext(key, value) {
    const newAnswers = { ...quizAnswers, [key]: value };
    setQuizAnswers(newAnswers);

    if (quizStep < 5) {
      setQuizStep(quizStep + 1);
      return;
    }

    setResult(calculateRecommendation(newAnswers));
    setQuizStep(6);
  }

  function goBack() {
    if (quizStep <= 1) return;
    setQuizStep((step) => Math.max(1, step - 1));
  }

  function resetQuiz() {
    setQuizStep(1);
    setQuizAnswers({});
    setResult(null);
  }

  const step = STEPS[quizStep];

  return (
    <section className="path-quiz" aria-label="Find your path">
      <div className="path-quiz__inner">
        <span className="path-quiz__eyebrow">Quick quiz</span>
        <h2>Find your path</h2>
        <p className="path-quiz__lead">A few questions about your dog — we&apos;ll suggest the right next step.</p>

        {quizStep <= 5 && step && (
          <div className="path-quiz__step motion-enter" key={quizStep}>
            <span className="path-quiz__eyebrow">{step.tag}</span>
            <h3>{step.question}</h3>
            <div className="path-quiz__options">
              {step.options.map((opt) => (
                <button key={opt.value} type="button" onClick={() => handleQuizNext(opt.key, opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
            {quizStep > 1 && (
              <button type="button" className="path-quiz__reset" onClick={goBack}>
                Back
              </button>
            )}
          </div>
        )}

        {quizStep === 6 && result && (
          <div className="path-quiz__result motion-enter" key="result">
            <span className="path-quiz__eyebrow">Suggested next step</span>
            <h3>{result.title}</h3>
            <p>{result.reason}</p>
            <div className="path-quiz__actions">
              <button
                type="button"
                className="cinema-btn cinema-btn--amber"
                onClick={() => navigate('/booking', { state: { selectedProgram: result.title } })}
              >
                Book this path
              </button>
              <button type="button" className="cinema-btn cinema-btn--ghost" onClick={() => navigate('/programs')}>
                See programs
              </button>
              <button type="button" className="path-quiz__reset" onClick={resetQuiz}>
                Start over
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

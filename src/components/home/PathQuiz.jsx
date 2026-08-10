import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function calculateRecommendation(answers) {
  if (answers.social === 'reactive' || answers.social === 'fearful') {
    return {
      title: 'Behavioral Consultation',
      reason:
        'Reactive or fearful behaviors require an expert diagnostic approach before entering a group environment.',
    };
  }
  if (answers.age === 'puppy') {
    return {
      title: 'Puppy Preschool',
      reason:
        'Your puppy is in their critical development window—now is the time for structured socialization.',
    };
  }
  if (answers.history === 'failed' || answers.history === 'zero') {
    return {
      title: 'One-on-One Training',
      reason: 'A tailored individual session will provide the reset needed to build a successful foundation.',
    };
  }
  if (answers.lead === 'pulls' || answers.history === 'basics') {
    return {
      title: 'Foundations for Focus',
      reason: 'Refining engagement and impulse control is the bridge to the reliability you are looking for.',
    };
  }
  if (answers.lead === 'advanced' && answers.history === 'advanced') {
    return {
      title: 'Advanced Skills',
      reason: 'You are ready for the mastery phase: total off-lead freedom and public neutrality.',
    };
  }
  return {
    title: 'Foundations for Focus',
    reason: 'This program provides the most versatile results for dogs needing real-world reliability.',
  };
}

const STEPS = {
  1: {
    tag: 'Phase 01 / 05',
    question: "What is your dog's current age?",
    options: [
      { label: '8-16 Weeks', key: 'age', value: 'puppy' },
      { label: '4-12 Months', key: 'age', value: 'teenager' },
      { label: '1-3 Years', key: 'age', value: 'adult' },
      { label: '4 Years +', key: 'age', value: 'senior' },
    ],
  },
  2: {
    tag: 'Phase 02 / 05',
    question: 'Current level of training?',
    options: [
      { label: 'Zero / Beginner', key: 'history', value: 'zero' },
      { label: 'Knows the Basics', key: 'history', value: 'basics' },
      { label: 'Failed Other Methods', key: 'history', value: 'failed' },
      { label: 'Advanced but Inconsistent', key: 'history', value: 'advanced' },
    ],
  },
  3: {
    tag: 'Phase 03 / 05',
    question: 'How is their social behavior?',
    options: [
      { label: 'Neutral / Focused', key: 'social', value: 'neutral' },
      { label: 'Over-Friendly / Excitable', key: 'social', value: 'friendly' },
      { label: 'Barky / Reactive', key: 'social', value: 'reactive' },
      { label: 'Timid / Fearful', key: 'social', value: 'fearful' },
    ],
  },
  4: {
    tag: 'Phase 04 / 05',
    question: 'How are their lead manners?',
    options: [
      { label: 'Pulls Constantly', key: 'lead', value: 'pulls' },
      { label: 'Moderate Pulling', key: 'lead', value: 'moderate' },
      { label: 'Good — Needs Off-Lead Work', key: 'lead', value: 'good' },
    ],
  },
  5: {
    tag: 'Phase 05 / 05',
    question: 'What is your primary objective?',
    options: [
      { label: 'Stress-free Family Living', key: 'goal', value: 'family' },
      { label: 'Elite Reliability & Freedom', key: 'goal', value: 'elite' },
      { label: 'Basic Control & Safety', key: 'goal', value: 'safety' },
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

  function resetQuiz() {
    setQuizStep(1);
    setQuizAnswers({});
    setResult(null);
  }

  const step = STEPS[quizStep];

  return (
    <section className="path-quiz" aria-label="Find your path">
      <div className="path-quiz__inner">
        <span className="path-quiz__eyebrow">DIAGNOSTIC</span>
        <h2>Find your path</h2>
        <p className="path-quiz__lead">Tell us about your dog to find the right program.</p>

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
          </div>
        )}

        {quizStep === 6 && result && (
          <div className="path-quiz__result motion-enter" key="result">
            <span className="path-quiz__eyebrow">YOUR RESULT</span>
            <h3>{result.title}</h3>
            <p>{result.reason}</p>
            <div className="path-quiz__actions">
              <button
                type="button"
                className="cinema-btn cinema-btn--amber"
                onClick={() => navigate('/booking', { state: { selectedProgram: result.title } })}
              >
                Book class
              </button>
              <button type="button" className="cinema-btn cinema-btn--ghost" onClick={() => navigate('/programs')}>
                Learn more
              </button>
              <button type="button" className="path-quiz__reset" onClick={resetQuiz}>
                Restart diagnostic
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

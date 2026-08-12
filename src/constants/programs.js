export const PROGRAMS = [
  {
    id: 'puppy-preschool',
    title: 'Puppy Preschool',
    subtitle: 'BEGINNER',
    age: '8–15 WEEKS',
    desc: 'Set your puppy up for success in their most critical development window. This 5-week course focuses on relationship building, essential house manners and social discovery.',
    perks: ['Confident Socialization', 'House Manners Mastery', 'Foundation Focus'],
    btnText: 'Join waitlist',
    curriculumTitle: 'The Discovery Phase',
    curriculumDesc:
      'The first five weeks are dedicated to the critical development window where your puppy’s personality and confidence are formed.',
    curriculumItems: [
      { label: 'Troubleshooting', text: 'Addressing toilet training, mouthing, and chewing.' },
      { label: 'Socialization', text: 'Structured interaction to teach calm focus near others.' },
      { label: 'The Marker System', text: 'Introducing the "Marker and Release" system for clear communication.' },
      { label: 'Relaxation', text: 'Early Mat Training for relaxation and safety.' },
    ],
  },
  {
    id: 'foundations',
    title: 'Foundations for Focus',
    subtitle: 'INTERMEDIATE',
    age: 'GRADUATES & OLDER DOGS',
    desc: 'The essential bridge between puppyhood and adult reliability. This 5-week course moves beyond the basics to ensure your dog can maintain focus even when the world gets busy.',
    perks: ['Reliable Impulse Control', 'Stress-Free Walking', 'Cooperative Care'],
    btnText: 'Join waitlist',
    curriculumTitle: 'The Engagement Phase',
    curriculumDesc:
      'Over five weeks, we focus on reclaiming attention during adolescence and building "real-world" manners.',
    curriculumItems: [
      { label: 'Proofing Distraction', text: 'Adding Distance, Duration, and Distraction to commands.' },
      { label: 'Impulse Control', text: 'Core focus on "Leave It" to ignore environmental temptations.' },
      { label: 'Active Walking', text: 'Advanced "Targeting" for active choice-based leading.' },
      { label: 'Vet Prep', text: 'Practicing "Body Checks" for cooperative vet visits.' },
    ],
  },
  {
    id: 'advanced-skills',
    title: 'Advanced Skills',
    subtitle: 'ADVANCED',
    age: 'THE RELIABLE DOG',
    desc: 'Designed for the ultimate graduate, this 5-week course focuses on total harmony and transitioning away from constant lures to achieve high-level independence.',
    perks: ['Off-Lead Reliability', 'Distance Mastery', 'Neutrality in Public'],
    btnText: 'Join waitlist',
    curriculumTitle: 'The Mastery Phase',
    curriculumDesc:
      'Across five weeks, we transition from training to living, building a dog that is reliable without constant rewards.',
    curriculumItems: [
      { label: 'Distance Control', text: 'Cueing "Drop" or "Stay" from several meters away.' },
      { label: 'Public Neutrality', text: 'Ignoring joggers, cyclists, and other dogs.' },
      { label: 'Super Recall', text: 'High-speed, enthusiastic return in any environment.' },
      { label: 'Off-Lead Freedom', text: 'Bridge the gap from lead work to total freedom safely.' },
    ],
  },
];

export const OTHER_SERVICES = ['Behavioral Consultation', 'One-on-One Training'];

/** Maps recommendation / CTA titles → booking path + optional program id */
export const BOOKING_FROM_PROGRAM = {
  'Puppy Preschool': { path: 'classes', programId: 'puppy-preschool' },
  'Foundations for Focus': { path: 'classes', programId: 'foundations' },
  'Advanced Skills': { path: 'classes', programId: 'advanced-skills' },
  'Behavioral Consultation': { path: 'consultation' },
  'One-on-One Training': { path: 'private' },
};

export function resolveBookingFromSelection(selectedProgram) {
  if (!selectedProgram) return null;
  const mapped = BOOKING_FROM_PROGRAM[selectedProgram];
  if (mapped) {
    return {
      path: mapped.path,
      programId: mapped.programId || null,
      label: selectedProgram,
    };
  }
  return { path: 'consultation', programId: null, label: selectedProgram };
}

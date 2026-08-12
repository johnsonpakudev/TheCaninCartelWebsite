/** Phase 1: Unsplash CDN hotlinks. Swap to /images/*.jpg before next durable deploy. */

function unsplash(photoId, w = 1600) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&q=80`;
}

export const SITE_IMAGES = {
  homeHero: {
    src: unsplash('photo-1648304887391-a6c2cf2228e4'),
    alt: 'Handler walking a dog on a leash outdoors',
    page: 'https://unsplash.com/photos/a-man-walking-a-dog-on-a-leash-fl-_xSZaI1I',
  },
  filmstripPuppy: {
    src: unsplash('photo-1760615303236-e5923d66a450'),
    alt: 'Golden retriever puppy on a leash outdoors',
    page: 'https://unsplash.com/photos/a-golden-retriever-puppy-walks-on-a-leash-outdoors-wQzmEm52F_8',
  },
  filmstripFoundations: {
    src: unsplash('photo-1534361960057-19889db9621e'),
    alt: 'Puppy running with focus on green grass',
    page: 'https://unsplash.com/photos/shallow-focus-photography-of-white-shih-tzu-puppy-running-on-the-grass-qO-PIF84Vxg',
  },
  filmstripAdvanced: {
    src: unsplash('photo-1675191785627-b89b7c4042bb'),
    alt: 'Dog running on a beach with a ball',
    page: 'https://unsplash.com/photos/a-dog-running-on-a-beach-with-a-ball-in-its-mouth--WfoRhklcVY',
  },
  programPuppy: {
    src: unsplash('photo-1484190929067-65e7edd5a22f'),
    alt: 'Handler working with a white puppy on grass',
    page: 'https://unsplash.com/photos/man-squatting-holding-two-foot-of-a-white-puppy-on-green-sod-at-daytime-OPAUTV_6n10',
  },
  programFoundations: {
    src: unsplash('photo-1636998094055-ec16a40164f5'),
    alt: 'Person walking a white dog on a leash',
    page: 'https://unsplash.com/photos/a-person-walking-a-white-dog-on-a-leash-kqLl6Ao7V4k',
  },
  programAdvanced: {
    src: unsplash('photo-1682532339427-7804e24b88f1'),
    alt: 'Handler walking multiple dogs on a beach',
    page: 'https://unsplash.com/photos/a-man-walking-three-dogs-on-a-beach-PS3Hs1C80SU',
  },
  aboutHero: {
    src: unsplash('photo-1551779891-b83901e1f8b3'),
    alt: 'Handler sitting outdoors with a dog',
    page: 'https://unsplash.com/photos/woman-sitting-and-playing-with-dog-outdoors-xvYxGcwFvuE',
  },
  aboutSuccess: {
    src: unsplash('photo-1597067269970-90c3766446d2'),
    alt: 'Joyful dog running on the beach',
    page: 'https://unsplash.com/photos/brown-long-coated-dog-running-on-beach-during-daytime-AH9w3TBSk_k',
  },
};

/** Map program ids → catalog images */
export const PROGRAM_IMAGES = {
  'puppy-preschool': SITE_IMAGES.programPuppy,
  foundations: SITE_IMAGES.programFoundations,
  'advanced-skills': SITE_IMAGES.programAdvanced,
};

# Unsplash Image Set — Design

**Date:** 2026-08-12  
**Status:** Approved; phase 1 implemented (CDN hotlinks)  
**Goal:** Replace repeated `/DogTrainer5.jpg` with section-fit Unsplash photos across the live cinema surfaces.

## Locked decisions

| Decision | Choice |
|----------|--------|
| Scope | Full visual set: Home hero, filmstrip ×3, Programs catalog ×3, About hero + success |
| Delivery | Phase 1 hotlink CDN → Phase 2 download to `public/images/` before durable deploy |
| Fit | Section-specific subjects |
| Subject mix | Heroes + program rows = handler+dog; filmstrip = dog-forward |
| Approach | Curated slot map in `src/constants/images.js` |

## Slot map (Unsplash pages)

| Slot | Page |
|------|------|
| Home hero | https://unsplash.com/photos/a-man-walking-a-dog-on-a-leash-fl-_xSZaI1I |
| Filmstrip Puppy | https://unsplash.com/photos/a-golden-retriever-puppy-walks-on-a-leash-outdoors-wQzmEm52F_8 |
| Filmstrip Foundations | https://unsplash.com/photos/shallow-focus-photography-of-white-shih-tzu-puppy-running-on-the-grass-qO-PIF84Vxg |
| Filmstrip Advanced | https://unsplash.com/photos/a-dog-running-on-a-beach-with-a-ball-in-its-mouth--WfoRhklcVY |
| Programs Puppy | https://unsplash.com/photos/man-squatting-holding-two-foot-of-a-white-puppy-on-green-sod-at-daytime-OPAUTV_6n10 |
| Programs Foundations | https://unsplash.com/photos/a-person-walking-a-white-dog-on-a-leash-kqLl6Ao7V4k |
| Programs Advanced | https://unsplash.com/photos/a-man-walking-three-dogs-on-a-beach-PS3Hs1C80SU *(replacement; original two-dog walk returned 403 on download)* |
| About hero | https://unsplash.com/photos/woman-sitting-and-playing-with-dog-outdoors-xvYxGcwFvuE |
| About success | https://unsplash.com/photos/brown-long-coated-dog-running-on-beach-during-daytime-AH9w3TBSk_k |

## Architecture

- `src/constants/images.js` — `SITE_IMAGES` + `PROGRAM_IMAGES`
- Call sites: `Home.jsx`, `ProgramsFilmstrip.jsx`, `Classes.jsx`, `Method.jsx`
- Out of scope: logos, Booking UI, Unsplash+

## Phase 2 checklist

1. Download free files into `public/images/`
2. Point `src` fields to local paths
3. Keep `page` / credit URLs for attribution notes
4. Redeploy Firebase Hosting

## License

Use only Unsplash License (“Download free”) assets. Do not use Unsplash+.

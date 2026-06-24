# Dreams Into Reality - Project Architecture

## Objective

Build a static, cinematic luxury lifestyle website that can deploy directly to GitHub Pages. The site should feel like an automotive film: full-screen visuals, restrained luxury typography, scroll-driven chapters, and a sound-enabled intro experience that works within browser autoplay rules.

## File Structure

- `index.html` - Semantic one-page experience with intro, hero, chapters, garage reveals, motivation wall, sound controls, and final scene.
- `css/styles.css` - Mobile-first visual system, responsive full-screen layouts, glass controls, performance-safe effects, and reduced-motion support.
- `js/main.js` - GSAP/ScrollTrigger animation orchestration, lazy media loading, generated Web Audio sound design, counters, particles, and interaction handlers.
- `assets/README.md` - Royalty-free media sourcing notes and replacement guidance.
- `.nojekyll` - Ensures GitHub Pages serves static assets exactly as written.

## Experience Flow

1. Opening: black screen, cinematic title fade, generated engine rumble when sound is enabled, then transition into the automotive hero.
2. Hero: muted autoplay luxury car video, cinematic headline, begin/garage calls to action, and glass sound controls.
3. Chapter 1 - The Beginning: workspace, notebook, gym, and discipline imagery with slow zoom and parallax.
4. Chapter 2 - Discipline: counters, moving motivational words, training/work visuals, and scroll-triggered intensity.
5. Chapter 3 - Toronto Nights: full-screen city footage and skyline atmosphere with rain/light overlays.
6. Chapter 4 - Dream Garage: six full-screen vehicle reveals: Ferrari, Lamborghini, Nissan GTR, Mercedes G63, McLaren, and Rolls Royce.
7. Chapter 5 - The Future: mansion, pool, skyline, architecture, and lifestyle reveal.
8. Motivation Wall: premium quote typography appearing one by one.
9. Final Scene: luxury garage background, animated closing doors, music fade cue, and final call to action.

## Technical Plan

- Use plain HTML/CSS/JavaScript for zero build tooling and direct GitHub Pages hosting.
- Use GSAP and ScrollTrigger from CDN for cinematic scroll animation.
- Use Lucide icons from CDN for compact, familiar UI controls.
- Use remote royalty-free media from Pexels and Unsplash; document all source families in `assets/README.md`.
- Lazy-load background images and non-hero videos with IntersectionObserver.
- Keep videos muted by default; sound begins only after user interaction.
- Generate sound design with Web Audio: ambient pad, engine startup, garage door rumble, and city noise texture.
- Respect `prefers-reduced-motion` by shortening motion and disabling heavy scroll transforms.
- Use responsive viewport units, stable section dimensions, and touch-friendly controls for mobile.

## Deployment

No build is required. Push the repository to GitHub and enable GitHub Pages from the default branch/root. `index.html` is the entry point.

# Birthday Website

A premium, fully offline birthday experience built with HTML5, CSS3, and vanilla JavaScript. It has no build step, package manager, external fonts, external services, or network requirements.

## Open locally

Double-click `index.html`, or serve this folder with any static web server. Netlify deployment works by dragging the complete `Birthday` folder into the Netlify dashboard.

## Personalize

1. Replace `Alex` in `index.html` with the birthday person's name.
2. Update the date in the `birthdayDate` setting near the top of `script.js`.
3. Add your own local images to `assets/images/` and replace the CSS gallery backgrounds in `style.css` if desired.
4. Add a local MP3 at `assets/music/birthday.mp3`. The music button remains available even when the file is not present.
5. Edit the message, timeline entries, and wish cards directly in `index.html`.

## Structure

- `index.html` contains semantic content and accessible controls.
- `style.css` contains the responsive visual system, CSS balloons, cake, sparkles, and animations.
- `script.js` contains small independent modules for countdown, confetti, fireworks, lightbox, gift reveal, audio, and progressive reveals.
- `assets/` is reserved for optional local media and icons.

The project intentionally uses stable browser standards and no third-party runtime dependencies so it stays understandable and maintainable for decades.

# Unforgettable Things website

The website for the [Unforgettable Things](https://unforgettablethings.app) Android app: a landing page with a small interactive demo, and the privacy policy that Google Play asks for.

Live at **https://unforgettablethings.app**, published by GitHub Pages from the root of `main`. The custom domain is set in `CNAME`; DNS is on Cloudflare (records set to DNS only, not proxied). Every push to `main` updates the site within a minute or two.

Plain HTML, CSS and a little JavaScript. No build step, no frameworks, no cookies, no analytics, no third-party requests.

## Files

| file | what it is |
|---|---|
| `index.html` | landing page |
| `privacy.html` | privacy policy (the URL to give Google Play: `…/privacy.html`) |
| `404.html` | shown by GitHub Pages for missing pages |
| `assets/css/site.css` | all styles; colours match the app's Matryoshka theme in `lib/ui.dart` |
| `assets/js/demo.js` | the hero demo: places, pins and their positions |
| `assets/img/scene-*.svg` | the illustrated hallway, wardrobe and box used by the demo |
| `assets/img/og.png` | preview image for links shared on chat apps and social sites |
| `assets/fonts/` | Lexend, subset to Latin, under the SIL Open Font License (`OFL.txt`) |
| `.nojekyll` | tells GitHub Pages to serve the files as they are |

## Common edits

- **App goes live on Google Play.** In `index.html`, find the comment above `<span class="store">` and swap the `<span>` for the `<a>` it shows, changing "Coming soon to" to "Get it on".
- **Privacy policy changes.** Edit `privacy.html` and update the effective date at the top.
- **Demo pins.** In `assets/js/demo.js`, each pin has `x` and `y` as fractions of the photo (0 to 1), like the app. `open` makes it a close-up; `align: "end"` or `"start"` moves its label when it's near an edge.

## Preview locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Contact

`feedback@unforgettablethings.app` is forwarded by Cloudflare Email Routing. It's the contact address in the footer and the privacy policy.

# Unforgettable Things website

The website for the [Unforgettable Things](https://unforgettablethings.app) Android app: a landing page with a small interactive demo, and the privacy policy that Google Play asks for.

Live at **https://unforgettablethings.app**, published by GitHub Pages from the root of `main`. The custom domain is set in `CNAME`; DNS is on Cloudflare (records set to DNS only, not proxied). Every push to `main` updates the site within a minute or two.

Plain HTML, CSS and a little JavaScript. No build step, no frameworks, no cookies, no analytics, no third-party requests.

## Files

| file | what it is |
|---|---|
| `index.html` | landing page |
| `privacy.html` | privacy policy (the URL to give Google Play: `…/privacy.html`) |
| `it/index.html`, `it/privacy.html` | Italian versions; keep them in step with the English pages. The demo's Italian labels are in `assets/js/demo.js` |
| `404.html` | shown by GitHub Pages for missing pages |
| `delete-account.html`, `it/delete-account.html` | how to delete a sync account and what happens to its data, with or without the app. The URL to give Google Play's Data safety form for account deletion: `…/delete-account.html`. The deletion itself is on the sync server's own page, `https://sync.unforgettablethings.app/delete-account` (`server/src/delete-page.ts` in the app repo), so this site stays free of scripts |
| `join.html` | what an invite link (`/join#<code>.<key>`) shows on a phone without the app. With the app, the link opens in it. The part after `#` holds the household key and never reaches the site: keep this page free of scripts |
| `.well-known/assetlinks.json` | lets the app open `/join` links itself (Android App Links). Lists the SHA-256 of each key the app is signed with: the upload key now, and Play's app signing key once the app is on Google Play (Play Console › Test and release › App integrity) |
| `assets/css/site.css` | all styles; colours match the app's Matryoshka theme in `lib/ui.dart` |
| `assets/js/demo.js` | the hero demo: places, pins and their positions |
| `assets/img/scene-*.svg` | the illustrated hallway, wardrobe and box used by the demo |
| `assets/img/og.png` | preview image for links shared on chat apps and social sites |
| `assets/fonts/` | Lexend, subset to Latin, under the SIL Open Font License (`OFL.txt`) |
| `.nojekyll` | tells GitHub Pages to serve the files as they are, `.well-known/` included |

## Common edits

- **App goes public on Google Play.** In `index.html` and `it/index.html`, find the comment above `<a class="store">`, point the link at the Play listing it shows, and change the "Join the test" text as it says.
- **Privacy policy changes.** Edit `privacy.html` and `it/privacy.html` together and update the effective date at the top of both. The policy describes the app and sync server as of build 106 (a comment at the top says so): when a new build changes what the app stores or sends, or what the server keeps, change the policy before that build is released.
- **Demo pins.** In `assets/js/demo.js`, each pin has `x` and `y` as fractions of the photo (0 to 1), like the app. `open` makes it a close-up; `align: "end"` or `"start"` moves its label when it's near an edge.

## Preview locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Contact

`feedback@unforgettablethings.app` is forwarded by Cloudflare Email Routing. It's the contact address in the footer and the privacy policy.
`enroll@unforgettablethings.app` is where the "Join the test" button on the landing page sends people who want to test the app.
`bugs@unforgettablethings.app` goes to a Cloudflare Email Worker that forwards a copy to the same inbox and opens a private issue (label `from-email`) in the app repo.

LIFEPAK 15 Simulator — installable web app
==========================================

Files (keep them together, same folder layout):
  index.html            the simulator
  manifest.webmanifest  app name, icon, full-screen + landscape settings
  sw.js                 offline cache
  icons/                app icons

1) PUT IT ONLINE (free, one time) — GitHub Pages
   a. Sign in at github.com and create a new PUBLIC repository, e.g. "lp15-sim".
   b. On the repo page: Add file > Upload files. Drag in index.html,
      manifest.webmanifest, sw.js and the icons folder. Commit.
   c. Settings > Pages > "Build and deployment": Source = Deploy from a branch,
      Branch = main, folder = / (root). Save.
   d. After a minute the site is at:  https://<your-username>.github.io/lp15-sim/
   (Any HTTPS host works — Netlify Drop, Cloudflare Pages, etc. It must be
   HTTPS; opening the file straight from the tablet's storage can't install.)

2) INSTALL ON THE ANDROID TABLET
   a. Open that address in Chrome (or Edge).
   b. Chrome: menu (three dots) > "Install app" (or "Add to Home screen" > Install).
      Edge: menu (three dots) > "Add to phone" / "Install".
   c. Launch "LP15 Sim" from the home screen. It opens full screen, landscape,
      with no address bar or toolbar. Swipe in from an edge to show Android's
      own navigation temporarily.
   It works offline after the first launch.

3) UPDATING LATER
   Upload the new index.html over the old one, and in sw.js change
   CACHE_VERSION (e.g. 'lp15-sim-v1' -> 'lp15-sim-v2'). Close and reopen the
   app (twice if needed) to pick up the new version.

Notes
 - Bluetooth CPR sensor: Chrome/Edge on Android support Web Bluetooth, so the
   Bluetooth box can pair the sensor there. Android asks for Nearby devices /
   Location permission the first time.
 - Without installing, Home menu > FULL SCREEN hides the browser bars in a
   normal Chrome/Edge tab (until you exit or switch apps).
 - While the monitor is ON the screen is kept awake so it won't dim mid-scenario.

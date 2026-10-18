SECONDS — TIMER WEBSITE (VERSION 2)
==================================

What changed?
- Type HOURS, MINUTES and SECONDS in three separate boxes.
- The big countdown ALWAYS shows seconds only.
- Example: 1 hour + 2 minutes + 3 seconds = 3723 seconds.
- Quick presets, pause/resume/reset, a finish beep, an app icon and optional offline support.

FILES / WHAT THEY DO
- index.html: the CONTENT: text, buttons, inputs, and timer display.
- style.css: the APPEARANCE: colors, shapes, spacing, sizes.
- script.js: the BEHAVIOR: math and timer buttons.
- manifest.webmanifest: tells the iPhone the Home Screen app's name/icons.
- sw.js: helps the website open offline after a previous successful visit.
- icon-192.png, icon-512.png, apple-touch-icon.png: images for the app icon.

START LEARNING
1. Open index.html in a code editor (VS Code is fine).
2. Open index.html in your browser to try it.
3. Change the heading 'SECONDS.' or the tagline in index.html, save, refresh.
4. In style.css change '#a38af8' (the main button color), save, refresh.
5. In script.js find 'hours * 3600 + minutes * 60 + seconds'. This converts
   your inputs to a number of seconds.
6. Change the quick-preset HTML attributes data-seconds='...' if you want
   different times. Their values are always in SECONDS.

FREE PUBLISHING ON GITHUB PAGES
1. Create a public repository at https://github.com/new named seconds-timer.
2. Unzip the download, open the seconds-timer-v2 folder and upload its FILES
   to the top-level of the repository (index.html must be at the root).
3. Open Settings -> Pages -> Deploy from branch -> main / (root) -> Save.
4. Visit https://YOUR-USERNAME.github.io/seconds-timer/ once published.
5. On iPhone: Safari -> Share -> Add to Home Screen (enable Open as Web App).
6. For updates, upload changed files. After changes to cached files, change
   the CACHE string in sw.js to v3, v4 etc. so offline visitors receive updates.

TECHNICAL NOTES
- Minutes and seconds must be from 0 to 59; hours from 0 to 999.
- Total time must be at least one second.
- The display uses Math.ceil(remainingMilliseconds / 1000), so a set of
  1:02:03 begins at 3723 and counts down 3722, 3721 and so on.
- The calculation uses Date.now() to avoid interval drift.
- On iOS, the alarm may be silenced or delayed when the phone locks or
  suspends the app. A website CANNOT guarantee background sound/notifications.
- Opening index.html directly runs the timer, but service worker offline
  caching requires HTTPS hosting (or localhost).

# ANTIGRAVITY IMPLEMENTATION PROMPT
## GENESIS — Premium About Background, Pixel-Faithful Layout, and Smooth Horizontal Timeline

### ROLE AND PROJECT
Work as a senior Next.js UI engineer, responsive design specialist, and interaction-performance engineer. Apply changes inside the **existing** project at `G:\genesis` (Next.js 16, React 19, TypeScript, Tailwind v4, existing CSS/Web Audio). This is a **targeted quality-repair task**. Do not rebuild the website, create routes, or add new windows, popups, links, or functionality.

### SUPPLIED ASSETS AND REFERENCES
- Newly supplied cinematic About background: `Neon Moonlit Mecha City Battle 1.jpg` (1440 × 1024 original).
- Prepared faithful 3× upscale: `about-moonlit-city-upscaled-3x.webp` (4320 × 3072). The user will copy this file into `G:\genesis\public\about-v2\background-city-hq.webp`. Inspect its actual location; do not assume it exists until verified.
- Existing About design reference: `about (1).svg` and related assets in `public/about-v2/`.
- Existing Timeline reference: `timeline.svg`, the event-card SVGs, the golden track, and character illustration under `public/timeline/`.
- Recent screenshots/video of the current Timeline: evidence of cut-off blue information icons, clipped cards, visual divergence, jerky drag/snap movement. Do not treat successful TypeScript compilation as evidence that the result looks correct.

**CRITICAL:** The upscale has more pixels but cannot mathematically restore detail missing from the original photo. Compare it to the source; do not falsely claim AI detail reconstruction, nor apply over-sharpening or an artificial 'HDR' look. If an AI-enhanced alternative is supplied, compare it for fidelity and use it only if it preserves the characters, scene, palette, and silhouettes accurately.

### NON-NEGOTIABLE WEBSITE STRUCTURE
The website is a single vertical-scroll document ordered **Home → About → Timeline**. There is no separate `/about` or `/timeline` route. Keep the About page's Back and Home buttons **removed**. Do not add popups, modals, external links, or new tabs. Keep the Home section's Brochure, Prize, and Sponsors navigation artwork visible but inactive until functionality is explicitly requested, preserving any separately approved sound toggle and GDAI link. Do not change the Register or hamburger behavior. No decorative animations in About. Timeline remains horizontal on desktop and mobile.

---

## MILESTONE 1 — BASELINE INSPECTION AND ASSET AUDIT
Before editing, inspect `app/page.tsx`, `app/components/AboutSection.tsx`, `app/components/TimelineSection.tsx`, `app/components/MilestoneBadge.tsx`, `app/globals.css`, and assets under `public/about-v2/` and `public/timeline/`. Confirm true file names before changes.

1. Identify the actual image displayed behind About, including its decoded intrinsic dimensions, bytes, any preprocessing, `object-fit`, `object-position`, rendered rectangle, CSS filters, parent transforms and browser devicePixelRatio.
2. Examine About's heading/panel/text coordinates relative to the **1440 × 1024** reference. Capture current computed bounding boxes before changes.
3. Trace every horizontal Timeline scroll owner: native `scrollLeft`, CSS scroll snap, pointer drag, JS settle, card-click `scrollTo`, progress update, and any surviving GSAP pin/transform/wheel handlers.
4. Inspect exact card and blue information-icon bounding boxes, SVG `viewBox`/mask/clip path, overflow ancestors and vertical title/track/card geometry.
5. Keep an initial browser screenshot at 1440 × 1024 and 1920 × 1080; report actual measured mismatches. Preserve existing uncommitted work.

## MILESTONE 2 — REPLACE ABOUT BACKGROUND WITH THE BEST ASSET
1. Use `public/about-v2/background-city-hq.webp` after confirming it exists. Prefer it over any lower-resolution or aggressively compressed derivative if it looks sharper at the actual display size.
2. Do not accidentally render the entire Figma composite underneath duplicated title, panel, or foreground layers. Use **one** scenic background layer; foreground remains separate.
3. Preserve the provided artwork EXACTLY: moon, sci-fi skyline, flying purple character, central robotic fighter, foreground red/orange mecha, lighting, color balance, and framing. No recoloring or regenerated character variants.
4. Maintain aspect ratio; never use `object-fit: fill`, disproportionate CSS scales, canvas blur, or unnecessary CSS `filter: blur()` on the primary image.
5. Implement **adaptive full-screen**: decorative edges of the background may crop/extend according to screen ratio, but title, panel, and text must retain the correct Figma relationships. Avoid cropping important background focal elements where composition permits. Calibrate `object-position` separately for wide desktop and portrait viewports.
6. Background **scaling is independent** of foreground geometry. The About title and panel must NOT grow wider just because the monitor is wide. Do not allow a wide/shallow text panel to reappear.
7. If the source still looks soft at 1920px wide or on high-DPI displays, quantify source-to-display pixel ratio and report the limitation; do not add filters to manufacture detail. Make a before/after image comparison. Keep the locally hosted file optimized and high fidelity.
8. Give the background suitable image loading priority for its position in the single scroll page; do not preload multiple full-size alternatives by default. Verify there are no duplicate background requests.

## MILESTONE 3 — PRESERVE ORIGINAL ABOUT DESIGN GEOMETRY
The authoritative reference is `about (1).svg` at **1440 × 1024**. Inspect actual group bounds rather than guessing. Maintain the yellow ABOUT banner, white extruded GENESIS title, skull badge, pale-blue bordered info panel, and full two-paragraph text. **No Back/Home buttons and no decorative animations.**

At reference viewport, position the foreground from a **single shared design coordinate system**, not independent viewport-dependent offsets. Panel source geometry is approximately **741 × 695**, so it must remain reference-proportioned on desktop and must not flatten to a 2:1 banner. Respect the original SVG border shape and do not non-uniformly distort it. If the panel needs extra content height, make a carefully designed responsive frame instead of stretching the entire SVG beyond recognition.

The text MUST be complete and exact:

Paragraph 1: `Brawlers, gear up! The GDXR Club is dropping into the arena with the Fifth Edition of GENESIS 2026 — and this time, the battle is closer to home than ever!`

Paragraph 2: `After the last showdown in 2025, GENESIS is back, bigger and bolder. This isn't just about pixels, code, or pressing buttons — it's about unleashing your inner Brawler, teaming up, showing off your skills, and turning your passion for gaming into an epic real-world showdown. Lock and load, Brawlers. It's time to make history!`

For desktop, either use the provided original outlined text SVG for exact visual line breaks with accessible equivalent HTML, or reproduce its typographic metrics in real HTML. Do not display both visibly. On narrow screens, use readable naturally wrapping HTML, content-driven panel height, and no clipping. Keep vertical site scrolling able to reveal long content on short screens.

## MILESTONE 4 — TIMELINE VISUAL GEOMETRY AND ICON REPAIR
Preserve the supplied original Timeline art: cosmic pattern, orange TIMELINE banner, illustrated character, four cards, numbered badges, gold horizontal rail. Stage sequence: (01) Register for Genesis on Unstop & IndieConnect, (02) Round 1 Online, (03) Round 2 Offline, (04) Result. Keep their native art and copy; don't invent tournament data or change stage status.

The interactive timeline is allowed to be wider than the single 1440 × 1024 static Figma reference; **preserve visual asset proportions** and the alternating high/low composition where viewport height permits.

1. Event cards originate at **275 × 416**. Compute a **single card scale per responsive layout**, using `aspect-ratio: 275 / 416` and `object-fit: contain`. Never crop card text or artwork.
2. Set explicit title-safe, upper-card, rail, and lower-card vertical zones with measurable padding, including a **safe margin around all external blue info badges and hover-scale extent**. The rail must not run through card text.
3. Keep blue info badges fully visible at all tested sizes, including their blue circle and shadow. Inspect and correct SVG-internal `viewBox` clipping if present; a CSS overflow change cannot recover already-clipped SVG pixels. Keep badge action inert: **no popup**.
4. Keep the original illustrated character as a coherent introductory landmark with no extra dialogue windows.
5. Reduce the oversized gold glow; illuminate the selected milestone and a narrow animated progress section, not the entire interface. The golden path must visibly line up with the numbered nodes.
6. For short desktops, adapt vertical spacing or alternate placement carefully so **no card or badge crosses the visible bounds**. Never solve clipping by shrinking cards until they are unreadable.
7. On mobile the timeline stays horizontal; one readable main card and partial next-stage affordance. Cards may use one side of the rail if alternating would clip. No vertical timeline.

## MILESTONE 5 — FIX NATIVE HORIZONTAL DRAG AND SNAP JITTER
**The normal vertical wheel continues moving between Home, About, Timeline.** Do not reintroduce ScrollTrigger pinning, scroll hijacking, forced sideways vertical-wheel conversion, or artificial vertical scroll distance. Inside Timeline: mouse drag, native horizontal trackpad gestures, horizontal touch swipe, and clickable cards/milestones.

Use a **single horizontal native scroll container and `scrollLeft` as the source of truth**. Derive progress, closest stage, and golden line from it. Avoid per-pixel React `setState` updates; use rAF for transient visual values and update selected-stage state only when it changes.

Define one authority for each interaction:
- **Mouse drag**: pointer events, movement threshold to distinguish click, scrollLeft immediately follows pointer (no smooth scrolling during drag), pointer cancellation/capture cleanup, suppress synthetic click after drag. Suspend snap during active drag if necessary.
- **Drag release**: choose ONE settling mechanism; do not run both CSS snap and a simultaneous JS `scrollTo({behavior:'smooth'})` against the same offset. Choose native scroll snap OR one scripted settle appropriate for mouse; document why. Any scripted animation must be cancellable by renewed input.
- **Touch swipe**: browser-native horizontal scrolling and snapping; don't manually rewrite touch movement. Keep vertical page scroll usable.
- **Card/milestone click**: focus the clicked stage by real measured center, clamp target to `[0, scrollWidth-clientWidth]`, animate only one programmatic scroll. Do not issue competing follow-up corrections.
- **Browser resize**: recalculate milestone centers without jump loops; preserve the selected/focused stage if feasible.

Do not apply independent GSAP/CSS transforms to the entire horizontal track while native scrolling is controlling it. Compose hover and active transforms in separate wrappers or one transform owner. Avoid expensive continuously animated glows, filter blur, and shadows. Prefer 180–280ms restrained hover/focus effects. Support reduced motion and keyboard navigation.

## MILESTONE 6 — HOME, ABOUT, AND NAVIGATION REGRESSION SAFETY
Home must retain existing stars, planets, comets, gunslinger, ninja, emblem, platform, sound control, and GDAI flag navigation. Keep **BROCHURE — PRIZE — SPONSORS** visible and correctly aligned from the original screenshot, but do not assign or reactivate modal, route, new-tab or external link behavior. Keep Register and hamburger inert as previously specified. About remains static with no Back/Home controls. Timeline remains the third section of the same scroll document. Existing right-side section dots, if present, must cover exactly Home/About/Timeline.

## MILESTONE 7 — MEASURE, VISUALLY VERIFY, ITERATE
Before reporting success, actually capture and inspect screenshots at **1920×1080, 1917×885, 1440×1024, 1366×768, 1024×768, 768×1024, 390×844, 360×800**. At 1440×1024 compare About heading and panel bounds against the supplied Figma reference. At wide aspect ratios compare background crop and image sharpness. At 1366×768 verify all timeline event cards and blue icons are fully visible. At 390×844 verify horizontal swipe without vertical page scroll lock.

Capture Timeline at stages 01–04 and during intermediate mouse drag. **Interact**, don't merely screenshot an idle state. Test a rapid drag/release, clicking stage 04 from stage 01, reversing direction, repeated stage click, trackpad sideways gesture, returning to About with vertical wheel, mobile swipe, pointer cancel and resizing. Diagnose any jiggle with browser performance traces if available; report observed evidence, not guessed FPS.

Run available TypeScript/lint checks and `npm run build`, check console errors, hydration warnings, missing images, and asset requests. A passing build is NOT sufficient proof of visual correctness.

## DELIVERABLES AND ACCEPTANCE CRITERIA
Only implement within existing site; no new pages, routes, mods, packages unless a truly necessary one is justified, popups, links, or windows. Do not delete unrelated assets.

Finish only when:
- [ ] High-quality supplied background is actually used for About; no accidental blurry derivative is requested.
- [ ] Original About foreground proportions and complete text remain correct at 1440×1024.
- [ ] Adaptive full-screen background never stretches the artwork.
- [ ] About Back/Home remain absent; About has no decorative animation.
- [ ] Timeline 01–04 cards and blue icon circles are wholly visible at tested resolutions.
- [ ] Gold line and number badges visually align with the Figma design.
- [ ] Mouse drag follows the pointer promptly with no double-snapping or visual jumping.
- [ ] Horizontal touch swipe and trackpad movement work, with normal vertical website scrolling.
- [ ] No Timeline ScrollTrigger pinning or wheel hijacking is reinstated.
- [ ] Home remains intact and the three nav labels remain visually present and inactive.
- [ ] Real screenshots inspected and TypeScript/build checks completed.

In the final response report (a) root causes, (b) exact files changed, (c) actual background dimensions/bytes and rendered scale, (d) card/icon before–after bounds, (e) which scroll/snap mechanism was removed and which remains, (f) tested viewports/interaction results, (g) unresolved image or visual limitations. Don't create new documentation files or claim tests you did not run.

### EXECUTION ORDER
Complete **Milestone 1 and 2** first, visibly verify About, then complete **Milestone 4** card/icon geometry, then **Milestone 5** movement, then run all validations. Correct geometry before tuning movement. No vague 'make it smoother' finish reports: demonstrate precisely how conflicting movement controllers were eliminated.

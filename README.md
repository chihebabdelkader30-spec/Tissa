# Tissa / تسعة

An Android-first, offline pass-and-play nine-answer party game built with Expo Router, TypeScript, Zustand, AsyncStorage, Reanimated, Poppins and Cairo.

## Delivered milestone and release status

All requested gameplay screens are connected: first-launch language and privacy choices, menu, setup, handoff, reader timer, result, standings, podium, instructions, shop, settings, statistics, rate, privacy and terms. UI is authored in English, French and Arabic. Arabic layout is mirrored without forcing a process-wide RTL restart; content language is independent of interface language.

**This is a functional offline development build, not a certified production release.** Ads, UMP choices, billing, entitlement restoration and prices are explicitly simulated. No real ads, purchases, account, backend or network-dependent gameplay. Device testing, factual/editorial review, legal replacement, store verification and native commerce integration remain release prerequisites. No AAB build or automated test execution was performed in this environment.

## Run

The builder installs dependencies automatically. Required runtime modules: expo-router, zustand, @react-native-async-storage/async-storage, react-native-svg, react-native-reanimated ~3.17.5, expo-linear-gradient, expo-av (audio only), expo-haptics, expo-keep-awake, expo-font, expo-splash-screen, expo-status-bar, react-native-safe-area-context, @expo-google-fonts/poppins and @expo-google-fonts/cairo. Fonts are packaged assets, not fetched at runtime. Audio is generated as tiny WAV tones locally.

Run `npx expo start`; use Android or OnSpace preview. Native ads and billing cannot run in Expo Go or the browser; use an Android development build when adding those adapters.

## Folder map

- `app/`: Expo Router entry points; all non-menu paths resolved by `[screen].tsx`.
- `screens/`: task-oriented screens, no direct storage or billing calls.
- `components/`: shared controls, nine-dot vector logo, countdown, answer rows, standings, confetti, explicit demo banner.
- `store/`: Zustand vanilla store, synchronous shared gameplay actions.
- `contexts/` + `hooks/`: provider and reactive state/logic consumers.
- `services/`: pure scoring, question drawing, local persistence, development commerce boundaries and audio.
- `constants/`: design tokens, product IDs, test AdMob IDs.
- `i18n/`: three complete UI dictionaries.
- `data/`: original multilingual clue banks plus standard-schema editable question JSON.

## Original content and validation

Bundled content compiles to **181 questions per language (543 total)**: 135 base questions (15 per category), 15 each for football, TV and Tunisia, plus one separately authored geography question. Each generated question has a unique set of nine clues and exactly nine corresponding answers. This deliberately uses original clue-based prompts, rather than copying commercial quiz text or accepting ambiguous broad lists. The fifteen questions in each category are variations compiled from an 18-entry localized factual bank (12 entries for zodiac signs), not 15 independent subject pools. Roughly one-third include an extra bomb decoy. Tunisia sample pack uses ISO governorate codes and is expert-oriented. TV answers are titles, not summaries of mature scenes. Review age suitability and question difficulty before release.

`data/questions_en.json`, `questions_fr.json`, `questions_ar.json` are editable arrays of this schema:

```json
{"id":"my-unique-id","category":"geography","difficulty":1,"question":"Name the nine countries with these capitals: …","answers":["A","B","C","D","E","F","G","H","I"],"bomb":null,"pack":"base"}
```

Simply append entries; the app combines them with the compiled bank. Never reuse IDs when changing semantics. Banks contain manually authored English/French/Arabic clues and answers; there is no runtime machine translation. `data/buildQuestions.js` is pure shared compiler logic.

- Validate counts, schema, unique answers, bomb separation, IDs and i18n keys: `node scripts/validate-questions.cjs`.
- Materialize the entire bank into the three requested standard-schema files: `node scripts/validate-questions.cjs --export`. The app deduplicates exported IDs against the compiler. Export before handoff if standalone JSON data is preferred. For an exported ID, bank content remains authoritative at runtime; edit `banks.json` to change a compiled question, or use a new ID for additions.

Never-repeat-in-game is enforced separately from recent device history. When the selected pool has no fresh questions, recent history for that pool resets; game-used IDs never reset. If the whole game pool is exhausted, the game ends rather than repeating.

## Gameplay decisions

- Classic rounds mean **total team turns**, as requested; 5 turns with 2 teams gives one team 3 turns and the other 2.
- Each correct answer +1; all nine +3. +2 adds two before ×2. The −5 bomb penalty is applied last, never multiplied; prior correct points are retained. Bomb ends immediately. A bomb is an extra tenth answer and is visually indistinguishable until tapped.
- A team gets one +2, one ×2 and one swap. Only one joker per turn. Swap consumes the current question and draws a new one immediately. Scoring jokers are consumed when the timer starts.
- Extra jokers permit reusing a spent +2 or ×2 once. Purchased extras are device-wide consumable credits; a completed development rewarded ad gives the current team one credit, once per turn. Cancellation grants nothing. Remove Ads suppresses all ad surfaces, including rewarded ads.
- Streak keeps the same team playing after finding at least five. First fewer-than-five turn eliminates it. Last standing wins; on content exhaustion, highest streak wins.
- Tied leaders each get one extra sudden-death question. Highest sudden-death result wins; a second equality yields shared winners, documented in the guide. No endless tie-break loops.
- Timer uses an absolute foreground deadline, auto-pauses on backgrounding and stays awake while reading. Paused answers are completely covered. Android back and navigation removal ask for confirmation during a live question.
- Current game state is intentionally not persisted across process termination; preferences, completed stats, entitlements, extras and recent history are.

## Development commerce

`constants/config.ts` fixes `commerceMode = development`. Shop is prominently labeled and charges no money. Every Buy opens an outcome simulator: success, pending, failure or cancellation. Only success unlocks. Consumables add five credits. Restore restores cached simulated non-consumable rights; it is **not Google Play restoration**. Banner slots exist only on menu and standings. Every third completed game shows a demo interstitial before the podium. No ad is mounted on reader screen.

## Configure real Android AdMob / UMP

1. Create AdMob app and Android banner/interstitial/rewarded units. Official Google TEST IDs are centralized in `constants/adConfig.ts`.
2. Install `react-native-google-mobile-ads` and its Expo config plugin with your Android AdMob App ID; create an EAS Android development build. Do not simply change the development flag: the current services deliberately do not import native ad modules.
3. Implement native adapters behind `services/ads.ts`. Call UMP `requestInfoUpdate`/required consent form before initializing Mobile Ads, read can-request-ads, expose the privacy-options form in Settings, and handle unavailable offline consent safely. The current first-launch choices are not legal UMP consent.
4. Replace the demo banner with a native banner only at existing menu/scoreboard placements. Preload interstitials; consume the every-third-game event once, handle load failures without blocking the podium. Never show during a timer.
5. Grant reward ONLY from the native earned-reward event. Respect remove_ads across loading, displaying and rewarded offers. Update production IDs only for signed release builds; register development devices as test devices.

## Configure real Google Play Billing

Product IDs in `constants/config.ts`: `remove_ads`, `pack_football`, `pack_movies`, `pack_tunisia`, `bundle_all` (non-consumable), `jokers_pack` (optional consumable).

1. Create a Play Console app with final package ID; upload a signed internal-testing AAB, create/activate products, pricing regions and licensed testers.
2. Install `react-native-iap`, configure its Expo/native plugin for your selected supported version, and build a native development client. Do not use deprecated expo-in-app-purchases.
3. Replace `services/iap.ts` with billing connection, localized product query, purchase listeners, restore queries and entitlement checks at startup. Never show the demo dollar prices in production.
4. Persist pending transactions; grant once only after purchased/verified, acknowledge non-consumables, consume consumables idempotently and finish transactions. Handle user cancellation, deferred payment, disconnects and retries through localized UI. Cache verified rights for offline play.
5. Client cache is not secure receipt verification. For production purchase-token validation use OnSpace Cloud serverless functions with Google Play Developer API service-account secrets, enabled separately. No account is required, but validation must not trust an unverified client flag. Refunded/revoked entitlement checks are required on reconnection. No Node/Python server is required.

## Logo, adaptive icon and splash

`assets/tissa-icon.svg` is the exact editable nine-dot brand icon: eight yellow dots, center-right coral bomb with fuse on navy. `assets/tissa-wordmark.svg` includes Tissa and تسعة; outline fonts before supplying to designers. The app renders the same mark as vector primitives, not a generated raster.

The preview PNG is a generated brand rendition. Before shipping, rasterize the exact SVG via `scripts/rasterize-icon.cjs` with Sharp installed as a development tool, then set `android.adaptiveIcon.foregroundImage` to `./assets/images/tissa-adaptive.png`. The script creates a transparent safe-zone foreground and exact 1024px icon. Background is #0F1B3D. Splash uses the same icon on navy. Never include text in the adaptive icon. `app.json` contains portrait orientation, version 1.0.0, Android versionCode 1 and placeholder `com.yourname.tissa`.

## AAB and publish checklist

1. Choose permanent package name before Play Console setup. Replace `com.yourname.tissa` in app.json and store URL. Increase Android versionCode on every release.
2. Run validation/export above, `npx tsc --noEmit`, `npx expo-doctor`, and test 320px phones/tablets/landscape system resizing/Arabic/foreground-background transitions on devices.
3. Use `npx eas-cli login`, `npx eas-cli build:configure`, then `npx eas-cli build --platform android --profile production`. `eas.json` requests an AAB; preview profile creates APK.
4. Configure signing and your EAS project ID, native plugins and store-service credentials securely. Download the AAB and upload to internal testing before closed/open/production tracks.
5. Replace legal placeholders and contact emails, publish a public privacy-policy URL, complete Data Safety and ads disclosure, review UMP/EEA choices, purchase restoration, age rating 12+, screenshots and listing translations. Google determines final rating.
6. Exercise failure/pending/cancellation/reward cancellation, entitlement revocation, offline startup, every-third-game ads and rate prompt after five games. Production review must include accessibility/TalkBack, no accidental bomb styling leak, score correctness and sound mute.

## Manual test matrix

- 9 correct: 12; +2:14; ×2:24. 3 correct then bomb:−2; +2 then bomb:0; ×2 then bomb:1.
- Timer expiry and early end score partial finds once. Repeated taps cannot add twice.
- Swap never repeats an ID. Selecting/deselecting scoring joker does not spend it. Start spends it once.
- Classic 5/10/15 total turns. Streak repeats successful team and eliminates below five. Ties each receive one question.
- Success unlocks locally, pending/failure/cancel do not; bundle suppresses all demo ads and unlocks three packs. Restore never adds consumable credits.
- UI languages persist, Arabic direction and independent Arabic questions render correctly; first-launch choice not repeated.
- Background pauses, back confirm, masked pause overlay, mute, haptics toggle, default 45/60/90, history reset and local stats.

This project intentionally avoids adding unconfigured native AdMob/Billing modules to Expo Go or pretending test simulations are production services.

# Geekskai Growth Distribution Backlog

Last updated: 2026-08-12

## Objective

Acquire qualified users for Audio Toolkit and the developer-tool cluster while
Creem review is pending. Distribution must describe the product accurately,
respect community rules, and remain measurable through first-party events.

## Release gate

- Do not promote paid checkout until Creem approves the payout account and a
  production purchase/refund/webhook test passes.
- Organic posts may link to the free Audio Toolkit experience and the LUFS
  guide while checkout is unavailable.
- Read each community's current rules immediately before submitting. No
  automated posting, vote manipulation, or duplicate cross-posting.

## Priority queue

### P0 — execute first

| Channel                               | Why it fits                                                                                                                            | Submission angle                                                                                                                                                                 | Gate                                                                                                              | Success signal                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| GitHub: `amilajack/awesome-web-audio` | A maintained Web Audio resource list with browser audio apps and experiments; 137 stars and updated 2026-06-29 when researched         | Propose Audio Toolkit as a browser-based audio utility, with a concise description of local processing and two-pass loudness normalization                                       | Confirm the maintainer accepts external app additions and choose the closest existing section before opening a PR | Accepted listing or qualified GitHub referral sessions                         |
| Reddit: r/audioengineering            | 649,112 subscribers when researched; conversations about LUFS, normalization, engineering tradeoffs, and tooling are directly relevant | Ask for technical feedback: “I built a two-pass LUFS normalizer that runs in the browser—what edge cases should I test?” Lead with method, limitations, and reproducible details | Read current self-promotion rules and use a permitted feedback/showcase thread; no sales CTA                      | Constructive comments, completed normalizations, and repeat visits             |
| Hacker News: Show HN                  | Technical launch audience fits a browser-local FFmpeg implementation and a transparent engineering write-up                            | “Show HN: A browser-local two-pass LUFS normalizer” linked to the product and implementation article                                                                             | Launch only after the product page, article, analytics, and error handling are production-verified                | Referral sessions, file selections, completed jobs, and substantive discussion |

### P1 — verify, then schedule

| Channel                            | Why it may fit                                                                           | Required verification                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Tiny Tool Town                     | Positions itself as a showcase for free/open-source tools                                | Verify that hosted external tools are accepted and whether an open-source repository is mandatory              |
| yourhack.ai                        | Search result describes a large directory of free, browser-side utilities                | Manually verify the live submission page; automated verification was blocked during research                   |
| Reddit: r/SideProject or r/webdev  | Useful for product and implementation feedback, but less targeted than audio engineering | Verify current self-promotion rules and avoid reposting identical copy                                         |
| Curated developer-tool directories | The JSON, Markdown, and generator tools can earn separate discovery links                | Build a tool-by-tool shortlist based on actual category fit rather than submitting the whole domain everywhere |

## Deprioritized channels

- PlayApp: its current model appears oriented toward uploading self-contained
  HTML/ZIP mini apps, not linking to an existing Next.js product.
- MIDIWeb Hub: focused on WebMIDI projects; Audio Toolkit is not a MIDI tool.
- AI music directories: Audio Toolkit processes user audio and does not
  generate music with AI.
- VST/AU plugin directories: Audio Toolkit is a browser application, not an
  installable audio plugin.
- Facebook and Instagram: useful later for demonstrations, but lower-intent
  than search, GitHub, HN, and audio-engineering communities for the first
  technical launch.

## Approved message foundation

Directory description:

> Geekskai Audio Toolkit is a browser-based audio utility for two-pass LUFS
> normalization. It accepts MP3, WAV, FLAC, and M4A files, processes them
> locally in the browser, and exports WAV or MP3.

Community post foundation:

> I built a two-pass LUFS normalizer that runs locally in the browser. I am
> looking for edge cases around long files, unusual channel layouts, true-peak
> ceilings, and perceived-loudness differences. The implementation notes and
> current limitations are documented, and the free workflow is available
> without enabling paid checkout.

Avoid unsupported claims such as “best,” “lossless” for MP3 output, universal
loudness targets, unlimited processing, or guaranteed privacy beyond the
verified browser-local processing path.

## Measurement

Use source-specific links without placing personal data in query parameters:

- GitHub: `utm_source=github&utm_medium=directory&utm_campaign=audio_toolkit_launch`
- Reddit: `utm_source=reddit&utm_medium=community&utm_campaign=audio_toolkit_launch`
- Hacker News: `utm_source=hacker_news&utm_medium=community&utm_campaign=audio_toolkit_launch`

Evaluate each channel using referral sessions followed by:

1. Audio Toolkit page viewed.
2. File selected.
3. Processing started.
4. Processing completed or failed.
5. Pricing viewed.

Review after either 14 days or 100 attributed sessions per channel. Continue a
channel only if it produces meaningful engagement or completed jobs, not merely
clicks.

## Next execution order

1. Wait for Creem's account-review response and keep checkout disabled.
2. Confirm the newly deployed Audio events appear in Clarity after sufficient
   traffic and validate the pricing-to-toolkit funnel.
3. Publish the LUFS guide and developer-tool cluster update.
4. Prepare, manually review, and submit the GitHub resource-list proposal.
5. Prepare a rules-compliant r/audioengineering feedback post.
6. Run Show HN only after production verification and after incorporating early
   technical feedback.

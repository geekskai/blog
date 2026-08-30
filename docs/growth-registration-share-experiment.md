# Registration and share growth experiment

Status: implementation-ready locally; production experiment off.

## Objective and release gate

The primary metric is `new_account_completed / unique quota_gate_viewed`. Share clicks are diagnostic, not the goal.

No registration-copy, channel-attribution, or AI experiment may run while `/api/download-quota` returns `mode: "local"` for the selected tool. Rollout is deliberately separated into Preview, migration execution, production variables, deployment, canary activation, and experiment activation. This repository change performs none of those production actions.

Registration copy and post-download sharing also have independent server-only kill switches. Both default to disabled even in server quota mode:

- `GROWTH_REGISTRATION_EXPERIMENT_ENABLED=true` enables journey-sticky English A/B copy.
- `GROWTH_SHARE_CHANNELS_ENABLED=true` enables the post-download share card, attribution, and its AI challenger eligibility.

Quota-gate X remains the existing rewarded secondary path and is not controlled by the post-download channel switch.

Production activation order:

1. Apply migration `0011_growth_share_channels` to the intended Preview database and set `DOWNLOAD_QUOTA_SCHEMA_READY=true` only after schema verification.
2. Enable server quota in Preview with both growth experiment switches still false and verify quota and registration-return truth first.
3. Enable each experiment separately in Preview and run its attribution and channel matrix below.
4. Deploy the verified build without enabling all tools or either growth experiment.
5. Enable only `soundcloud-artwork` as a 24-hour production canary through `DOWNLOAD_QUOTA_ENABLED_TOOLS`.
6. Require API error rate below 1%, registration-return success at least 99%, correct UTC quota settlement, no random or expired Share Attribution cookies, and no media input in external URLs.
7. Add the remaining existing quota tools and `youtube-shorts` only after canary acceptance, then authorize each growth experiment separately.

When server mode is unavailable, the gate keeps a generic account action but makes no “+7” promise and emits no server growth experiment data.

## Registration copy experiment

Scope: English quota-gate journeys in server mode only. Assignment is deterministic from the server-issued journey ID and remains 50/50 for the journey.

- A: `Sign up for free — unlock 7 more today`
- B: `Create a free account — keep your progress + 7 downloads today`

Variant B also states that the person returns to the current tool. The redirect contains only the locale/tool pathname plus `quota_return=1`; interrupted tool state remains in same-tab `sessionStorage`.

Run at least 14 days and until each arm has 500 unique quota-gate journeys, with a maximum of 28 days. Adopt B only if relative lift is at least 10%, the 95% confidence interval is above zero, registration-return success is at least 99%, and quota API error rate is below 1%. Otherwise keep A.

`new_account_completed` is server-owned. The server compares Clerk `User.createdAt` with the same journey's recent `signup_started`; existing-account returns become `signin_completed`.

## Sharing boundary

The Quota Gate keeps registration as the primary action and X as the only rewarded secondary action. A reward is granted only after the X composer window opens, at most once per UTC day, and publication is not verified.

After every Successful Download, the non-blocking share card offers X, WhatsApp, Telegram, Reddit, and Copy Link. Each real choice creates a separate server-issued `share_id`. These actions never call `share_unlock`. Reddit opens an editable submit draft without choosing a subreddit or publishing.

External share links contain only the current origin, locale/tool pathname, `ref=quota_share`, and a valid persisted `share_id`. Media URLs, other query parameters, and hashes are excluded. A landing sets the 30-day first-touch cookie only after the database confirms that the Share Attribution exists and is unexpired.

The first release measures Referred Registration but provides no inviter or recipient reward. Reconsider a two-sided reward only after at least 100 referred New Account Completions; any later reward must require a Successful Download within 24 hours of registration.

## AI copy challenger

The template is always rendered first. AI is disabled unless all of these server-only variables are configured:

- `GROWTH_SHARE_CHANNELS_ENABLED=true`
- `GROWTH_SHARE_AI_ENABLED=true`
- `GROWTH_SHARE_AI_MODEL=<evaluated model id ending in -free>`
- `AI_GATEWAY_API_KEY=<dedicated key>`

The code does not set Vercel budgets or purchase credits. Before activation, create a dedicated Gateway key, set a $1 monthly feature budget, disable automatic recharge, and run a fixed copy evaluation. On 2026-08-30, the Gateway directory exposed free-marked text candidates including `inclusionai/ling-3.0-flash-fin-free`, `minimax/minimax-m2.7-free`, `minimax/minimax-m3-free`, and `poolside/laguna-s-2.1-free`; this is a dated candidate list, not a selected model. Re-query the current model directory before configuration. If no candidate passes, leave the feature off.

`/api/growth/share-copy` accepts only Tool ID, English locale, and Share Channel. The server supplies the approved benefit. It requires an active server-issued Growth Journey and permits at most one challenger attempt per journey, tool, and channel in 24 hours. It passes no media URL, title, user information, tool input, or result to the model and does not persist generated copy. The request has a 2.5-second timeout and zero retries. Disabled configuration, control assignment, timeout, 402, 429, provider error, or invalid output leaves the template in place.

Run the AI challenge only after the template baseline, for at least 14 days and 500 share-card exposures per arm. Expand only when channel-open rate improves at least 10%, generation failure is below 2%, and template display remains non-blocking at P95.

## Verification matrix

- Visitor: 3 Successful Downloads, Registration Return produces a 10-download daily limit with visitor usage carried over, and X adds 5 once.
- Channels: WhatsApp, Telegram, Reddit, and Copy Link never alter quota; a blocked popup never rewards X.
- Privacy: tool input restores from session state while media URLs never appear in redirect or share URLs.
- Attribution: random, malformed, expired, and deleted IDs do not set cookies or events; valid first touch is not overwritten.
- Identity: new Clerk account and existing-account sign-in produce distinct server events.
- Concurrency: simultaneous X reward calls produce one database grant through the existing atomic insert/update.
- Shorts: reserve before the request, consume only after a valid file response, release on failure, and use the same gate and sharing surfaces as the other tools.
- AI: every failure class returns or retains the deterministic template without blocking sharing.

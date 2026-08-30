# Registration and share growth rollout

Status: fixed-copy MVP implemented locally; production rollout off.

## Objective and release gate

The first release uses one registration message and deterministic share templates. It does not run a registration A/B test. Existing first-party events remain available for later analysis, but metrics are not a launch gate for this MVP.

Post-download sharing may not run while `/api/download-quota` returns `mode: "local"` for the selected tool. Rollout remains separated into Preview verification, production variables, deployment, and feature activation. This repository change performs none of those production actions.

Post-download sharing has one server-only kill switch and defaults to disabled even in server quota mode:

- `GROWTH_SHARE_CHANNELS_ENABLED=true` enables the post-download share card, attribution, and its AI challenger eligibility.

Quota-gate X remains the existing rewarded secondary path and is not controlled by the post-download channel switch.

Production activation order:

1. Apply migration `0011_growth_share_channels` to the intended Preview database and set `DOWNLOAD_QUOTA_SCHEMA_READY=true` only after schema verification.
2. Enable server quota in Preview with post-download sharing still false and verify the anonymous quota lifecycle.
3. Enable post-download sharing in Preview and run the minimum local channel checks below.
4. Under separate authorization, deploy the verified build and explicitly enable all current quota tools.
5. Confirm correct UTC quota settlement, no random or expired Share Attribution cookies, and no media input in external URLs.

When server mode is unavailable, the gate keeps a generic account action but makes no “+7” promise and emits no server growth experiment data.

## Fixed registration copy

In server mode, the quota gate uses one primary action:

- `Sign up for free — unlock 7 more today`

The supporting text states that the person returns to the current tool. The redirect contains only the locale/tool pathname plus `quota_return=1`; interrupted tool state remains in same-tab `sessionStorage`. When server mode is unavailable, the UI keeps a generic account action and makes no “+7” promise.

`new_account_completed` is server-owned. The server compares Clerk `User.createdAt` with the same journey's recent `signup_started`; existing-account returns become `signin_completed`.

## Sharing boundary

The Quota Gate keeps registration as the primary action and X as the only rewarded secondary action. A reward is granted only after the X composer window opens, at most once per UTC day, and publication is not verified.

After every Successful Download, the non-blocking share card offers X, WhatsApp, Telegram, Reddit, and Copy Link. Each real choice creates a separate server-issued `share_id`. These actions never call `share_unlock`. Reddit opens an editable submit draft without choosing a subreddit or publishing.

External share links contain only the current origin, locale/tool pathname, `ref=quota_share`, and a valid persisted `share_id`. Media URLs, other query parameters, and hashes are excluded. A landing sets the 30-day first-touch cookie only after the database confirms that the Share Attribution exists and is unexpired.

The first release measures Referred Registration but provides no inviter or recipient reward. Reconsider a two-sided reward only after at least 100 referred New Account Completions; any later reward must require a Successful Download within 24 hours of registration.

## Deferred AI copy challenger

The MVP UI ships only deterministic templates and does not request AI copy. The existing AI challenger endpoint remains dormant unless it is reconnected in a later, separately authorized phase with all of these server-only variables:

- `GROWTH_SHARE_CHANNELS_ENABLED=true`
- `GROWTH_SHARE_AI_ENABLED=true`
- `GROWTH_SHARE_AI_MODEL=<evaluated model id ending in -free>`
- `AI_GATEWAY_API_KEY=<dedicated key>`

The code does not set Vercel budgets or purchase credits. Before activation, create a dedicated Gateway key, set a $1 monthly feature budget, disable automatic recharge, and run a fixed copy evaluation. On 2026-08-30, the Gateway directory exposed free-marked text candidates including `inclusionai/ling-3.0-flash-fin-free`, `minimax/minimax-m2.7-free`, `minimax/minimax-m3-free`, and `poolside/laguna-s-2.1-free`; this is a dated candidate list, not a selected model. Re-query the current model directory before configuration. If no candidate passes, leave the feature off.

`/api/growth/share-copy` accepts only Tool ID, English locale, and Share Channel. The server supplies the approved benefit. It requires an active server-issued Growth Journey and permits at most one challenger attempt per journey, tool, and channel in 24 hours. It passes no media URL, title, user information, tool input, or result to the model and does not persist generated copy. The request has a 2.5-second timeout and zero retries. Disabled configuration, control assignment, timeout, 402, 429, provider error, or invalid output leaves the template in place.

Do not activate the AI challenger as part of the template-sharing MVP. Re-evaluate its model, concurrency control, budget, and measurement plan before enabling it.

## Minimum MVP verification

- Local/API: templates and composer URLs cover every tool and channel; external URLs contain no media input.
- Local/API: WhatsApp, Telegram, Reddit, and Copy Link never call `share_unlock`; random or expired IDs do not set attribution cookies.
- Preview: all supported tools return server quota before Production activation.
- Post-launch follow-up: verify real Clerk registration return, browser popup behavior, and the full concurrency matrix.

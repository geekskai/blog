# Registration and share growth rollout

Status: fixed-copy MVP implemented locally; production rollout off.

## Objective and release gate

The first release uses one registration message and deterministic share templates. It does not run a registration A/B test. Existing first-party events remain available for later analysis, but metrics are not a launch gate for this MVP.

Post-download sharing may not run while `/api/download-quota` returns `mode: "local"` for the selected tool. Rollout remains separated into Preview verification, production variables, deployment, and feature activation. This repository change performs none of those production actions.

Post-download sharing has one server-only kill switch and defaults to disabled even in server quota mode:

- `GROWTH_SHARE_CHANNELS_ENABLED=true` enables the post-download share card and attribution.

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

## Deferred AI copy

The MVP ships deterministic templates only. It contains no AI copy endpoint, AI SDK dependency, Gateway configuration, or AI-specific growth events. Reconsider AI copy in a separately researched and authorized phase rather than activating it through environment variables.

## Minimum MVP verification

- Local/API: templates and composer URLs cover every tool and channel; external URLs contain no media input.
- Local/API: WhatsApp, Telegram, Reddit, and Copy Link never call `share_unlock`; random or expired IDs do not set attribution cookies.
- Preview: all supported tools return server quota before Production activation.
- Post-launch follow-up: verify real Clerk registration return, browser popup behavior, and the full concurrency matrix.

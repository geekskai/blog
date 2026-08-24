# ADR 0024: Use Audio Credits with PayPal Orders and Subscriptions

Status: Accepted

Date: 2026-08-24

Supersedes the product catalog, prices, and entitlement mechanics in ADR 0017 and ADR 0021. The PayPal merchant, verification, environment isolation, and release controls in ADR 0016, ADR 0020, ADR 0022, and ADR 0023 still apply.

## Decision

Audio Toolkit usage is measured in Audio Credits. One Credit covers one minute of combined input audio, rounded up once per batch.

- Signed-in Free accounts receive 30 Credits per UTC day, limited to one file per batch without ZIP export.
- Pay As You Go is a server-created and server-captured PayPal Order for 480 Credits at a fixed gross price of $14 USD. The Credits expire 365 days after capture.
- Regular is a server-created PayPal Subscription. Each verified successful $29 USD monthly payment grants 2,800 Credits that expire at the end of that paid period and do not roll over.
- An unexpired paid balance enables up to 50 files per batch and ZIP export.

Credits are reserved before local processing. A successful settlement consumes Credits for the combined duration of successful files. A failed or cancelled batch with no successful output releases the reservation. Deduction order is Free, Regular subscription, then Pay As You Go; earliest expiry is used first within each source.

The browser uses `@paypal/react-paypal-js` SDK v6 components. The server owns PayPal Order creation and capture and PayPal Subscription creation. Client approval is never sufficient to grant Credits. One-time Credits are granted only from a verified completed capture; subscription Credits are granted only from a verified completed payment with a valid billing-period end.

Full refunds and reversals revoke the corresponding payment grant. Partial refunds require manual review. A refund request is eligible within 14 calendar days only when no Credits from the corresponding payment grant have been consumed.

## Consequences

- The legacy Basic/Pro catalog and annual billing choices are no longer offered.
- An existing active legacy subscription blocks new checkout and must be resolved before launch.
- PayPal Live remains behind the server-only staged release control until migration, webhook, legal-copy, and controlled production smoke checks pass. Internal checkout is restricted by an explicit Clerk user allowlist.
- Audio files and filenames remain local. The server stores aggregate duration, file count, reservation, settlement, grant, order, subscription, and payment metadata.

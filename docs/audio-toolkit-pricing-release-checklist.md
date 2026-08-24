# Audio Toolkit PayPal Live release checklist

Audio Credits apply only to browser-local Audio Toolkit processing. Public third-party downloader allowances remain outside the paid product.

## Current status

Orders, subscriptions, Credit grants, and local-processing reservations are implemented behind Billing Release Control. Deployment alone does not authorize live sales.

## Zero-subscriber preflight

- [ ] Query production billing tables for every active or suspended Creem or legacy PayPal Basic/Pro subscription.
- [ ] Stop launch and make an explicit migration decision if any legacy subscriber exists.
- [ ] Preserve provider identifiers and audit records; never rewrite an old subscription as a new Regular subscription.

## Database and application

- [ ] Back up production and apply migration `0009_nifty_proteus.sql` before setting `BILLING_RELEASE_STAGE=credits`.
- [ ] Verify a signed-in account receives exactly 30 Free Credits per UTC day and a visitor cannot reserve Credits.
- [ ] Verify combined duration is rounded up once per batch and reservation deduction order is Free, subscription, then PAYG.
- [ ] Verify failed/cancelled work releases its reservation; partial success charges only successful-file duration.
- [ ] Verify paid access allows at most 50 files, 200 MB per file, 500 MB per batch, and ZIP export.
- [ ] Verify expired or abandoned reservations release safely and duplicate settlement is idempotent.

## PayPal Live setup

- [ ] Confirm the PayPal Business account can use Live Orders, captures, Subscriptions, and the intended funding methods.
- [ ] Create a dedicated Live REST application and webhook.
- [ ] Run `PAYPAL_ENVIRONMENT=live PAYPAL_PROVISION_CONFIRM=CREATE_LIVE yarn paypal:provision` once to create the Audio Credits product and $29 Regular monthly plan.
- [ ] Store `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_ENVIRONMENT=live`, and `PAYPAL_REGULAR_MONTHLY_PLAN_ID` in production secrets.
- [ ] Subscribe the webhook to capture completed/refunded/reversed, sale completed/refunded/reversed/denied, and subscription lifecycle events handled by the application.
- [ ] Confirm the old Basic/Pro Plan IDs are not used by the deployed application.

## Controlled production smoke test

- [ ] Keep `BILLING_RELEASE_STAGE=off` for the migration and configuration deployment.
- [ ] Set `BILLING_SCHEMA_V2_ENABLED=true` after verifying the migration, then set `BILLING_RELEASE_STAGE=credits` to verify the ledger while checkout remains closed.
- [ ] Set `BILLING_INTERNAL_TEST_USER_IDS` to the authorized Clerk user ID, then set `BILLING_RELEASE_STAGE=internal` for the controlled Live smoke test. Confirm every other account receives HTTP 503 from create, capture, and subscription-confirm endpoints.
- [ ] Complete one real $14 PAYG purchase. Verify the server-created order, server capture, verified webhook, exactly 480 Credits, duplicate-event idempotency, and the one-year expiry.
- [ ] Complete one real $29 Regular subscription payment. Verify approval alone grants nothing, the completed sale grants exactly 2,800 Credits, and the grant expires at the verified paid-period end.
- [ ] Verify cancel-at-renewal, payment failure/suspension, full refund/reversal, and partial-refund review behavior.
- [ ] Verify a refund is not issued when any Credit from its corresponding payment grant has been consumed.
- [ ] Confirm Pricing, Billing, Terms, Privacy, and Audio Toolkit behavior on mobile and desktop.

## Public launch

- [ ] Confirm `support@geekskai.com` is monitored and tax, refund, record-retention, receipt/invoice, and dispute wording has received appropriate legal/accounting review.
- [ ] Set `BILLING_RELEASE_STAGE=public` only after the internal smoke test passes; remove stale IDs from `BILLING_INTERNAL_TEST_USER_IDS` afterward.
- [ ] Verify public HTTP behavior, PayPal Live environment, webhook delivery, Credit balances, logs, and machine-readable pricing after deployment.
- [ ] Confirm paid Audio Credits do not change public downloader allowances.

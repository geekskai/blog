# Audio Toolkit PayPal release checklist

Free, Basic, and Pro apply only to the browser-local Audio Toolkit. Public third-party downloader allowances remain outside the paid product.

## Current status

PayPal migration is implemented behind Billing Release Control. Production checkout remains disabled until every Payment Launch Gate item below is verified. Code completion or deployment alone does not authorize live sales.

## Zero-subscriber preflight

- [ ] Query the production billing tables and confirm there are no Creem Subscribers or active Creem-sourced Account Entitlements.
- [ ] Stop the hard cutover and make a migration decision if that premise is false.
- [ ] Preserve the provider-neutral billing tables; never rewrite a Creem identifier as PayPal.

## PayPal Sandbox

- [ ] Create a dedicated Sandbox REST application and Webhook.
- [ ] Run the controlled provisioning script once to create one Product plus Basic Monthly `$10`, Basic Annual `$96`, Pro Monthly `$25`, and Pro Annual `$240` Plans.
- [ ] Configure Sandbox-only `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_ENVIRONMENT=sandbox`, and the four Sandbox Plan IDs.
- [ ] Apply migration `0008`, then keep `BILLING_SCHEMA_V2_ENABLED=true` only in the isolated test environment.
- [ ] Verify Free and arbitrary Plan IDs are rejected and the raw Clerk user ID is absent from PayPal `custom_id`.
- [ ] Verify approval alone does not grant access; `BILLING.SUBSCRIPTION.ACTIVATED` grants Basic or Pro entitlements.
- [ ] Verify duplicate events are idempotent and invalid PayPal transmissions are rejected.
- [ ] Verify one failed payment retains Active access, two failures suspend the PayPal subscription, and verified suspension revokes access.
- [ ] Verify cancellation stops renewal and retains access through the stored paid period.
- [ ] Verify expiration, reversal, dispute, and full refund revoke access; partial refund remains for manual review.
- [ ] Verify the nightly reconciliation reads only Sandbox subscriptions and never changes production entitlements.

## Merchant readiness

- [ ] Confirm the PayPal Business account can use Live REST Subscriptions and guest card funding where intended.
- [ ] Obtain tax and legal confirmation for fixed gross prices, the provisional seven-year billing-record retention period, refund wording, and receipts or invoices.
- [ ] Confirm `support@geekskai.com` is monitored for payment, refund, dispute, and invoice requests.
- [ ] Review Pricing, Billing, Terms, Privacy, and the one-file free Audio Toolkit experience on mobile and desktop.

## PayPal Live

- [ ] Create a separate Live REST application and Webhook; never reuse Sandbox credentials, Product, Plans, Customers, or events.
- [ ] Run the provisioning script once against Live and store the four returned Live Plan IDs.
- [ ] Apply migration `0008` before deploying code that creates billing correlations or payment records.
- [ ] Configure Live PayPal credentials, Webhook ID, and four Live Plan IDs in Production while both checkout flags remain false.
- [ ] Delete the five obsolete Creem production variables only after an action-time confirmation.
- [ ] Verify `BILLING_CHECKOUT_ENABLED=false` keeps the server API closed even if the public interface flag is true.
- [ ] Complete controlled Basic and Pro purchases, cancellation, payment failure, full refund, Webhook verification, entitlement, and reconciliation checks.
- [ ] Set `BILLING_CHECKOUT_ENABLED=true` and `NEXT_PUBLIC_BILLING_CHECKOUT_ENABLED=true` only after every preceding gate passes.
- [ ] Verify Basic and Pro accounts still receive the same public downloader rules as every other Registered User.

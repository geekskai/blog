# Audio Toolkit package release checklist

The four-tier application model and Test Mode checkout may be verified before approval, but production billing and paid downloader allowances have separate release gates.

## Current blockers

- [ ] Creem approves Live Payments for the Geekskai Audio Toolkit product line.
- [ ] Creem gives written approval before `PAID_DOWNLOAD_QUOTAS_ENABLED` can be set to `true`.
- [ ] Keep production downloader allowances on Visitor and Free values until written approval exists.

## Test environment

- [x] Align the Test catalog with the application model: Basic Monthly `$10`, Basic Annual `$96`, Pro Monthly `$25`, and Pro Annual `$240`, all tax-inclusive.
- [ ] Create one Creem Product Bundle containing Basic Monthly, Basic Annual, Pro Monthly, and Pro Annual.
- [x] Configure local `CREEM_BASIC_MONTHLY_PRODUCT_ID`, `CREEM_BASIC_ANNUAL_PRODUCT_ID`, `CREEM_PRO_MONTHLY_PRODUCT_ID`, and `CREEM_PRO_ANNUAL_PRODUCT_ID` with Test product IDs.
- [ ] Keep `PAID_DOWNLOAD_QUOTAS_ENABLED=false` while testing the local Audio Toolkit sales boundary.
- [ ] Verify checkout rejects Free, Enterprise, and arbitrary Product IDs.
- [ ] Verify Basic grants a 20-file local batch and ZIP export; Pro grants a 50-file local batch and ZIP export.
- [ ] Verify upgrade, downgrade, period-end cancellation, past-due retention, full-refund revocation, partial-refund retention, duplicate webhook handling, and daily reconciliation.

## Production after approval

- [x] Prepare four separate zero-sale Live products matching the approved application catalog; do not reuse Test IDs or Test billing data.
- [ ] Create the Live Product Bundle after Creem approves Live Payments.
- [ ] Set `NEXT_PUBLIC_BILLING_CHECKOUT_ENABLED=true` in Production only after Creem approves Live Payments; the default remains disabled.
- [ ] Apply migrations `0005`–`0007`, then set `BILLING_SCHEMA_V2_ENABLED=true` and `DOWNLOAD_QUOTA_SCHEMA_READY=true` before enabling checkout or server-side download quotas.
- [ ] Set `BILLING_CHECKOUT_ENABLED=true` together with the public checkout flag; the API remains closed when the server-only flag is absent.
- [ ] Configure the Live API key, four Live product IDs, webhook endpoint, and webhook secret only in Production.
- [ ] Apply the reviewed database migration before deploying code that reads Package Tier and Billing Interval.
- [ ] Recheck Pricing, Billing, Terms, Privacy, `/audio-toolkit/`, and the `/workspace/` permanent redirect.
- [ ] Complete one real Basic checkout and one real Pro checkout, then verify signed webhook authorization and Customer Portal access.
- [ ] Enable paid downloader allowances only in a later controlled release after written Creem approval and quota/concurrency acceptance tests.

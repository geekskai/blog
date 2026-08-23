---
status: superseded
superseded-by: 0022-isolate-and-verify-paypal-billing-environments
---

# Isolate test and production billing environments

Creem Test Mode uses the fixed Preview branch `codex/creem-test-preview` through the Vercel branch alias `blog-git-codex-creem-test-preview-geekskais-projects.vercel.app`, the dedicated Neon child branch `creem-test`, and a dedicated Clerk Billing Test User. The Preview must use that Neon branch exclusively. We chose database-level isolation instead of adding an environment discriminator to every billing table because test Customers, Subscribers, webhook events, and Account Entitlements must never collide with or grant access in production.

The protected Preview accepts Creem webhooks through a temporary Vercel Automation Bypass credential. Vercel is its sole custodian; the credential is carried only in the Creem Test webhook URL query parameter and is never stored in application code, the repository, local environment files, or application runtime environment variables. It must be revoked after billing acceptance testing.

Creem Live uses newly created product IDs, API credentials, webhook and webhook secret, and the production Neon branch. Test identifiers and test billing data are never reused or migrated into Live. Creating the dedicated Clerk Billing Test User and revoking the bypass credential are acceptance steps, not evidence that acceptance has already completed.

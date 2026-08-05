# Separate billing and entitlement authority

Creem is the authority for payments, subscription lifecycle, refunds, tax, and invoices. Postgres is the authority for application-facing entitlements and usage, linked to Clerk identities and synchronized from verified, idempotently processed Creem webhooks. Geekskai will not store payment credentials or treat checkout redirects as proof of access; this separation keeps runtime authorization fast and allows the payment provider to change without rebuilding the product entitlement model.

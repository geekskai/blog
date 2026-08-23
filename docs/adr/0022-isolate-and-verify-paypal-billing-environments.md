---
status: accepted
---

# Isolate and verify PayPal billing environments

Geekskai will maintain separate PayPal Sandbox and Live REST applications, credentials, webhook identifiers, products, plans, Customers, Subscribers, events, and Account Entitlements. A controlled one-time setup operation provisions one product and four plans per Billing Environment with a Payment Failure Threshold of two; application startup and checkout never create plans. Checkout binds to a Registered User through an Opaque Billing Correlation ID rather than a raw Clerk identifier, and v1 accepts lifecycle events only after Webhook Postback Verification. Live checkout remains disabled until the Payment Launch Gate passes.

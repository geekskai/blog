---
status: accepted
---

# Normalize the PayPal lifecycle before entitlement decisions

PayPal events and subscription states will first map to Geekskai's Payment Retry Access, Paid-Through Access, and Terminal Payment Event concepts before changing Account Entitlements. An Active subscription retains access during payment recovery, suspension and other terminal events revoke immediately, cancellation retains access through the paid period, and v1 defers direct Package Tier or Billing Interval changes rather than attempting proration.

---
status: accepted
---

# Minimize payment data and gate PayPal release

Geekskai will retain only the PayPal identifiers, event metadata and hashes, processing state, and accounting or entitlement records needed for reconciliation; it will not store card data or full webhook payloads. An unused Opaque Billing Correlation ID becomes invalid after 30 minutes and its record is removed after 30 days. Necessary accounting records use a provisional seven-year operational retention period that must be confirmed for the Merchant's applicable tax and legal obligations before launch. PayPal supplies standard automated billing notifications in v1 while Geekskai exposes verified account state and handles support correspondence. Production checkout remains behind Billing Release Control, with the server flag authoritative and the interface flag unable to activate billing independently.

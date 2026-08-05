# Geekskai Growth

This context defines the user-growth language for converting anonymous tool usage into durable account relationships.

## Language

**Visitor**:
A person using a public tool without signing in.
_Avoid_: Guest account, anonymous user

**Registered User**:
A person with an authenticated Geekskai account.
_Avoid_: Member, subscriber, customer

**Account Entitlement**:
A time-bounded capability value assigned to a Registered User, identified by a stable key such as `downloads.daily_limit` or `workspace.project_limit`, with its source and validity period. Free defaults remain application rules; only additions or overrides require stored entitlements.
_Avoid_: `is_paid`, payment status as authorization, hard-coded plan column

**Quota-Gate Activation**:
A unique Visitor who sees a Quota Gate, completes registration, and then completes at least one Successful Download within 24 hours. Registration without the subsequent Successful Download is not an activation.
_Avoid_: Registration count, sign-up click, account created

**Growth Journey**:
A first-party, pseudonymous sequence of quota-funnel events identified before registration by a server-issued opaque `journey_id` and associated with a Clerk user ID after registration. It records event names, tool identifiers, and timestamps, but never media URLs, tool input, or IP addresses.
_Avoid_: Browser fingerprint, advertising identity, media history

**Growth Event Retention**:
The 90-day period during which raw Growth Journey events and their identity linkage remain available. Afterward, only de-identified daily aggregates remain; billing, entitlement, subscription, and payment-webhook records follow separate retention rules.
_Avoid_: Permanent behavioral history, payment-record retention

**Daily Download Allowance**:
The number of downloads available to a person each day. A Visitor receives 3 downloads and a Registered User receives 10 downloads.
_Avoid_: Credits, subscription quota, one-time signup bonus

**Quota Day**:
The UTC calendar day from 00:00 through 23:59:59 in which Daily Download Allowance and Share Unlock eligibility are counted.
_Avoid_: Local day, rolling 24-hour window

**Successful Download**:
A download for which Geekskai successfully produces or returns a valid downloadable file or URL. Only a Successful Download consumes allowance; validation failures, unsupported input, upstream errors, and network failures do not.
_Avoid_: Download click, download attempt, metadata lookup

**Download Reservation**:
A short-lived, server-authoritative hold on one Registered User download slot, identified by an idempotent operation ID. It becomes consumed after a Successful Download, is released on a known failure, and expires if abandoned; concurrent reservations and consumed downloads both count toward availability.
_Avoid_: Client-side decrement, permanent failed attempt, duplicate retry charge

**Share Unlock**:
A once-per-Quota-Day reward of 5 additional downloads for opening a prepared Geekskai share in X. It raises a Visitor's daily maximum to 8 downloads and a Registered User's daily maximum to 15 downloads, but does not claim that the post was published or verified.
_Avoid_: Verified share, published share, unlimited sharing, repeat share farming

**Share Attribution**:
A 30-day, first-touch association created when a recipient opens a Geekskai URL containing an opaque random `share_id`. It connects a share landing to later registration and Quota-Gate Activation without exposing the sharer's Clerk ID or personal data; it provides measurement only and grants no inviter reward in the first release.
_Avoid_: Clerk ID in URL, last-click overwrite, automatic referral reward

**Quota Gate**:
The choice shown when a person's Daily Download Allowance reaches zero. Account creation is the primary action and Share Unlock is the secondary, account-free alternative.
_Avoid_: Paywall, forced registration, share wall

**Quota Tool Rollout**:
The first release scope covering every downloader that already uses the shared download-quota controller, with an independent server-side enable switch per tool. Ordinary tools without download quotas remain outside the rollout.
_Avoid_: Site-wide tool gate, single irreversible launch

**Registration Return**:
The continuation of the interrupted tool journey in the same browser tab after account creation, with the Registered User's increased allowance and saved Interrupted Tool State immediately available, but without automatically starting a download.
_Avoid_: Workspace redirect, automatic download, generic welcome page

**Interrupted Tool State**:
The minimum tool input and pending-action context saved in same-tab session storage before registration and restored by Registration Return. Media URLs and tool input are not placed in redirect parameters, analytics, or the database.
_Avoid_: Database draft, URL query payload, cross-device draft

**Visitor Usage Carryover**:
The transfer of a Visitor's current Quota Day usage into a newly created account, clamped to 0 through 3 downloads. Registration changes the daily allowance from 3 to 10 without resetting usage, so it always adds 7 downloads that day.
_Avoid_: Quota reset, 10 bonus downloads, trusted client usage

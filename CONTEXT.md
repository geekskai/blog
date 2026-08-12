# Geekskai Growth

This context defines the user-growth language for converting anonymous tool usage into durable account relationships.

## Language

**Visitor**:
A person using a public tool without signing in.
_Avoid_: Guest account, anonymous user

**Registered User**:
A person with an authenticated Geekskai account.
_Avoid_: Member, subscriber, customer

**Customer**:
A Registered User who has created a Creem billing relationship. Customer describes billing identity only and does not itself grant application access.
_Avoid_: Every Registered User, payment card holder, entitlement

**Subscriber**:
A Customer with a recurring Geekskai Basic or Pro agreement in Creem, including active, past-due, scheduled-cancel, paused, or expired lifecycle states. Runtime access is still determined from the Effective Package and Account Entitlements.
_Avoid_: `is_paid`, VIP, using subscription status directly as authorization

**Package Tier**:
The single effective Audio Toolkit product level for an account: Free, Basic, or Pro. A Package Tier selects an Entitlement Set but is not itself proof of payment. Public third-party downloader tools are outside Package Tier.
_Avoid_: Billing interval, VIP, stacked plans

**Billing Interval**:
The monthly or annual recurrence selected for a paid Package Tier. Billing Interval changes price and renewal timing, not capabilities within the same Package Tier.
_Avoid_: Billing Plan, feature tier, hard-coded product ID in the client

**Entitlement Set**:
The stable Audio Toolkit capability values associated with a Package Tier: local batch size and ZIP export. Public downloader allowances, concurrency, and Share Unlock are separate growth rules and never change with Package Tier.
_Avoid_: UI feature list as authorization, payment status as authorization

**Account Plan Status**:
The account's computed billing view containing its Effective Package, Billing Interval, provider lifecycle state, renewal date, and Entitlement Set. It is returned by the server and never accepted from the client.
_Avoid_: `is_paid`, client-selected Product ID

**Effective Package**:
The one Audio Toolkit Package Tier currently applied to a Registered User. A verified Creem Basic or Pro subscription takes precedence over Free.
_Avoid_: Additive plan stacking, merging multiple subscriptions

**Billing Provider**:
Creem, the merchant of record and authority for checkout, payment collection, recurring billing, tax, receipts, refunds, disputes, and subscription lifecycle.
_Avoid_: Application authorization database, payment credentials stored by Geekskai

**Billing Environment**:
A mutually isolated billing context whose Customers, Subscribers, provider identifiers, events, and Account Entitlements belong exclusively to either testing or production. Test billing relationships never grant production access.
_Avoid_: Mixing test and production billing records, deployment environment

**Billing Test User**:
A Registered User reserved for validating checkout and subscription lifecycles inside the test Billing Environment. A Billing Test User is not a production Customer or Subscriber.
_Avoid_: Personal account, production customer, real subscriber

**Paid Entitlement**:
An Audio Toolkit Account Entitlement synchronized from a verified Creem webhook. Stable keys are `account.package_tier`, `workspace.batch_file_limit`, and `workspace.zip_export`. Download-tool entitlements are not sold or synchronized from billing.
_Avoid_: Pro boolean on the user, checkout redirect as proof of access

**Paid Activation**:
A Subscriber who completes a batch of at least two local audio files within 24 hours of the first successful subscription payment. Audio, filenames, and processing settings are not recorded.
_Avoid_: Checkout return, subscription created, pricing-page click

**Account Entitlement**:
A time-bounded Audio Toolkit capability value assigned to a Registered User, identified by a stable key such as `workspace.batch_file_limit`, with its source and validity period. Free defaults remain application rules; only paid Audio Toolkit additions require stored entitlements.
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
The shared number of Successful Downloads available across supported public download tools during one Quota Day. A Visitor receives 3 and every Registered User receives 10, regardless of Audio Toolkit Package Tier. Billing never increases this allowance.
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
A once-per-Quota-Day reward of 5 additional downloads for a Visitor or Registered User who opens a prepared Geekskai share in X. It raises a Visitor's daily maximum to 8 and a Registered User's daily maximum to 15, but does not claim that the post was published or verified. Audio Toolkit Package Tier does not affect eligibility.
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

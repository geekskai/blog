# Geekskai Growth

This context defines the user-growth language for converting anonymous tool usage into durable account relationships.

## Language

**Visitor**:
A person using a public tool without signing in.
_Avoid_: Guest account, anonymous user

**Registered User**:
A person with an authenticated Geekskai account.
_Avoid_: Member, subscriber, customer

**Site Chrome**:
The shared header, footer, and optional mobile dock around page content.
_Avoid_: Commercial path, navbar theme, site chrome as page content

**Acquisition Chrome**:
The Site Chrome for public tools, the homepage, blog, pricing, and legal pages. Its job is task completion and discovery, not account promotion.
_Avoid_: Commercial header, marketing shell, signup-first nav

**Workspace Chrome**:
The Site Chrome for Audio Toolkit and account billing routes. It keeps a path back to public tools.
_Avoid_: Commercial path, logged-in theme, app shell for every signed-in page

**Account Menu**:
The Registered User control that opens Audio Toolkit, billing, and sign-out. It is not a primary header button on Acquisition Chrome.
_Avoid_: Create free account header CTA, always-visible Audio Toolkit button on public tools

**Acquisition-First Mode**:
The current Geekskai product phase in which public tools remain free and effort is prioritized around measurable organic acquisition rather than payment conversion or a predetermined product vertical.
_Avoid_: Payment launch, speculative tool expansion, paid downloader growth

**Commercialization Pause**:
The release state in which PayPal Live is selected but public checkout remains disabled and no new paid Audio Credits are sold until the production launch gate passes.
_Avoid_: Failed launch, free trial, hidden checkout

**Payment Launch Gate**:
The evidence required to end the Commercialization Pause: verified PayPal Business Live Orders and Subscriptions eligibility, migration `0009`, accurate tax and refund disclosures, zero legacy subscribers, and controlled production purchases that verify capture, payment, webhook, Credit, cancellation, and refund behavior. Passing code checks alone does not open paid access.
_Avoid_: Account created, deployment as launch, client approval as payment

**Hard Processor Cutover**:
The one-time migration that removes the dormant Creem runtime and configuration before PayPal becomes the only Payment Processor. Provider-neutral billing tables remain, and the cutover must stop if preflight evidence reveals an existing Creem Subscriber or entitlement.
_Avoid_: Dual-provider operation, rewriting Creem records as PayPal, deleting billing tables

**Dormant Pricing Surface**:
The indexable Audio Credits Pricing surface while checkout remains closed by Billing Release Control. It may explain Free, Pay As You Go, and Regular terms, but the server and client gates must both pass before a live PayPal action appears.
_Avoid_: Credentials imply launch, public flag as authorization, hidden live checkout

**Downloader Growth Freeze**:
The acquisition policy under which existing third-party downloader pages may be maintained for current users and organic traffic, while no new download platforms or paid downloader capabilities are added. Downloader pages are excluded from the first AdSense growth cluster even when they lead current traffic; new product and content investment goes to lower-risk tools that can create policy-eligible useful sessions.
_Avoid_: Downloader shutdown, downloader expansion, paid download quota

**Demand-Led Tool Portfolio**:
The primary product-selection policy during Acquisition-First Mode. A new tool earns development priority from observed search demand, attainable competition, policy-safe advertising potential, cluster expansion, build and maintenance cost, and evidence that the result satisfies the query; no audience or tool category receives priority by default.
_Avoid_: Fixed vertical roadmap, tool-count target, keyword volume alone

**Ad-Supported Tool Portfolio**:
The intended Geekskai business model: free public tools acquire organic visitors, and only policy-eligible pages may later earn revenue from clearly separated Google-served advertising. Tool priority is based on monetizable useful sessions rather than raw page count; downloader pages and result actions are never assumed to be ad-eligible.
_Avoid_: Ads on every page, ads beside download controls, approval implies every page is monetizable

**Ad-Free Growth Stage**:
The current operating stage in which Geekskai builds policy-eligible organic traffic, outcome measurement, and a coherent tool cluster without displaying ads. It ends only when one eligible cluster records at least 5,000 non-brand organic search clicks in a continuous 28-day period, contains at least three connected useful tool pages, has 28 days of stable Successful Tool Outcome measurement, has no unresolved advertising-policy issue, and passes a mobile core-experience review. Account or site approval alone does not end this stage.
_Avoid_: Immediate Auto Ads, approval-triggered launch, ads before measurement, indefinite threshold ambiguity

**Monetizable Tool Visit**:
A non-artificial visit to a policy-eligible tool page where the visitor can consume substantial original publisher content or complete a Successful Tool Outcome, with advertising visually distinct from navigation and tool controls. This is a portfolio planning metric, not proof that an ad impression or click is valid.
_Avoid_: Any page view, purchased traffic, accidental ad click, downloader-button proximity

**Acquisition North Star**:
The number of non-brand organic search clicks landing on policy-eligible tool pages. Successful Tool Outcome rate and invalid-traffic quality are mandatory guardrails; AdSense revenue is the business result, while total page views and published tool count are diagnostic metrics rather than the north star.
_Avoid_: Total traffic without quality, ad clicks, tool count, revenue without traffic-quality review

**Thirty-Day Acquisition Allocation**:
The default near-term resource split: 80% of acquisition effort improves existing tool pages with demonstrated Search Console opportunity, especially high-impression query-page pairs ranking 5-20; 20% may build at most one new tool that closes a measured query gap.
_Avoid_: Equal investment across all tools, speculative tool batches, new-tool-first roadmap

**Priority Acquisition Market**:
English-language organic demand from markets with stronger policy-safe advertising value receives research and optimization priority. Existing multilingual pages remain available and may earn investment when their own Search Console evidence justifies it; the policy is a prioritization rule, not a United-States-only product boundary.
_Avoid_: Global clicks at any value, equal localization investment, English-only access, assumed RPM without observed data

**Single-Cluster Growth Sprint**:
The first acquisition sprint selects one coherent tool cluster from real Search Console evidence and concentrates optimization, original supporting content, related-tool navigation, and bidirectional internal links within it. Isolated high-impression pages remain candidates, but do not receive unrelated expansion merely because they rank individually.
_Avoid_: Site-wide simultaneous optimization, unrelated top-page list, multiple speculative clusters

**First Acquisition Cluster**:
The current Single-Cluster Growth Sprint focused on Discord time utilities. It connects the existing Discord Time Converter, Discord Timestamp Generator, and supporting timestamp guide around one outcome: creating or decoding a Discord time reference that renders correctly for every viewer. The sprint first separates or consolidates overlapping search intent, instruments Successful Tool Outcomes, and holds the repaired pages stable for 28 days; it does not add another overlapping tool. Tip Screen remains a separate page-level CTR experiment and does not define this cluster.
_Avoid_: New Discord generator before measurement, overlapping timezone and timestamp pages, Tip Screen cluster, guaranteed traffic claim

**Open Tool Access**:
The access rule for ordinary acquisition tools: a Visitor can complete the core tool outcome and view the usable result without registration. Authentication may later add optional persistence, synchronization, history, or batch convenience, but cannot gate the core result. Existing downloader allowances remain a separate rule and do not propagate to ordinary tools.
_Avoid_: Result-before-signup gate, forced account creation, downloader quota applied site-wide

**Low-Priority Account Entry**:
Authentication remains available as a secondary navigation action for existing account and downloader-quota journeys, but ordinary acquisition tools do not promote registration before or immediately after the core result. The existing downloader Quota Gate may still offer registration when its allowance is exhausted.
_Avoid_: Homepage signup hero, ordinary-tool registration popup, removing downloader account recovery, site-wide quota gate

**Local-First Tool Processing**:
The default execution boundary for ordinary acquisition tools. Inputs and results are processed in the Visitor's browser whenever the promised outcome can be delivered reliably there. Server processing requires a demonstrated technical need and demand justification; acquisition analytics records lifecycle events and tool identity, never the user's tool input or result payload.
_Avoid_: Server processing for analytics convenience, input-content tracking, unbounded third-party dependency

**Controlled Programmatic SEO**:
The long-tail expansion rule that permits an initial pilot of no more than 10 indexable pages only when each query variant produces a materially different calculation, answer, example, or authoritative reference value. The pilot remains unchanged for at least 28 days and earns expansion only when at least 80% of pages are normally indexed, no duplicate-content or canonical defect is unresolved, real non-brand impressions appear, and the pages lead to Successful Tool Outcomes. Keyword substitution alone is not sufficient.
_Avoid_: Keyword-swapped templates, mass indexing before validation, duplicate result pages

**Question-Led Distribution**:
The distribution rule under which organic search remains primary and Agent Reach identifies real questions, terminology, and relevant discussions across supported platforms. Geekskai contributes a useful answer and tool link only when directly relevant; identical cross-platform promotion and automated posting are excluded, and every external post or reply requires separate execution authorization.
_Avoid_: Mass posting, link-only promotion, automated account activity, traffic from irrelevant discussions

**Cluster-Supporting Content**:
Editorial content exists to help a validated tool cluster satisfy related search tasks through tutorials, formulas, worked examples, comparisons, and evidence-backed answers. Unrelated, duplicated, or weak legacy posts enter a review queue for improvement, consolidation, redirect, or `noindex`; they are not mass-deleted solely because the strategy changed.
_Avoid_: General-interest publishing calendar, unrelated trend chasing, article-count target, destructive bulk cleanup

**Answer-First Evidence Content**:
The SEO and GEO publishing standard: state the direct answer or usable result first, then provide the method, worked example, limitations, authoritative sources, and last-updated context needed to verify it. AI may assist research and drafting, and Humanizer may refine final prose, but neither may invent facts, tests, examples, or citations.
_Avoid_: AI answer farms, unsourced claims, invented citations, keyword-first filler, humanization as fact checking

**Verifiable Publisher Identity**:
Tool and supporting-content pages identify Geekskai as the responsible editor and expose the real test method, data source, calculation rule, known limitations, and last meaningful update where applicable. The site does not manufacture expert personas, credentials, reviews, or author histories.
_Avoid_: Virtual expert, invented qualification, fake reviewer, update date without a material change

**Indexing Release Gate**:
A new or materially changed acquisition tool remains `noindex` until deterministic example outputs, invalid and boundary inputs, mobile browser behavior, canonical and search metadata, and Successful Tool Outcome instrumentation all pass internal verification. A page opening successfully or exposing a clickable primary action is not sufficient release evidence.
_Avoid_: Index-first repair, desktop-only check, click-only analytics, unverified calculator output

**Ninety-Day Page Review**:
An indexed acquisition page receives a 90-day observation window. If it produces no meaningful non-brand impressions, Successful Tool Outcomes, or defensible cluster contribution, it is improved, consolidated into a stronger page, set to `noindex`, or redirected as appropriate. It is neither kept indexed solely to increase page count nor deleted only because 28-day clicks are absent.
_Avoid_: Permanent index bloat, 28-day deletion, URL removal without consolidation review

**Safe Result Sharing**:
An optional, unrewarded growth loop shown after a Successful Download. It creates a clean tool-path link with an opaque Share Attribution identifier and offers editable X, WhatsApp, Telegram, Reddit, and Copy Link actions without exposing raw input, media URLs, query parameters, hashes, or sensitive result data. Reddit never auto-selects a subreddit or publishes automatically.
_Avoid_: Post-download reward, share wall, raw input in URL, sensitive public result, auto-post, claimed verified share

**Outcome-Adjacent Recommendation**:
The post-success navigation rule for ordinary acquisition tools. After a Successful Tool Outcome, the page may recommend one to three tools from the same cluster that represent a plausible next step in the Visitor's current task. Generic site-wide popularity does not determine this placement.
_Avoid_: Unrelated popular tools, pre-result distraction, more than three primary recommendations

**Evidence-Led Umbrella Brand**:
Geekskai remains a broad free-tool brand whose portfolio can follow demonstrated demand across categories. The homepage presents only a small set of clusters supported by current acquisition and outcome evidence, while the complete directory remains available for discovery. A temporary winning cluster does not trigger a site-wide rebrand.
_Avoid_: Random-tool homepage, fixed vertical identity, every tool featured equally, generic audience slogan

**Homepage Cluster Hierarchy**:
The acquisition homepage gives its primary hero and action to the current first-ranked evidence-backed cluster, presents no more than three validated clusters below it, and retains a secondary path to the complete tool directory. A cluster loses homepage prominence when current acquisition or outcome evidence no longer supports it.
_Avoid_: All-tools grid above the fold, permanent featured cluster, directory as primary hero

**Evidence-Only Social Proof**:
Every public usage, user, reliability, satisfaction, or performance claim must be backed by a reproducible first-party measurement with a defined scope and period. Placeholder values such as `25K+`, undocumented estimates, and vague replacements such as `thousands of users` are removed rather than softened.
_Avoid_: TODO statistics, estimated social proof, unscoped totals, unverifiable superlatives

**Creator Workflow Cluster**:
A candidate cluster of connected browser-local audio utilities for DJs and creators. It receives new investment only when it passes the same demand evidence used for every other Traffic Candidate; third-party downloading is not part of the cluster itself.
_Avoid_: Downloader suite, generic file-converter directory, unrelated creator generators

**DJ Workflow User**:
A DJ or music-library organizer who repeatedly prepares audio files for sets, devices, and collections. This user defines the Creator Workflow Cluster but is not the default audience for the wider Demand-Led Tool Portfolio.
_Avoid_: Every creator, casual downloader, generic file-conversion user

**DJ Preparation Outcome**:
A completed browser-local batch that converts tracks the DJ Workflow User owns into consistently normalized, performance-ready WAV or high-quality MP3 files using a reusable preparation preset. This is the first core outcome of the Creator Workflow Cluster.
_Avoid_: Single metadata lookup, third-party download, full music-library management

**Prepared Track Identity**:
The source track's base filename and available descriptive metadata, including title, artist, album, and embedded artwork, preserved by default in a Prepared Track. A short output suffix may prevent accidental overwrite, but normalization must not silently erase library identity.
_Avoid_: Metadata stripping, unrelated filename rewrite, full tag editor

**Audio Credit**:
The Audio Toolkit usage unit covering one minute of combined input audio. The server rounds the batch total up once, reserves Credits before browser-local processing, and settles only the combined duration of successful files.
_Avoid_: One Credit per file, rounding each file, client-only balance

**Audio Credit Source Order**:
The deduction order Free, Regular subscription, then Pay As You Go, with the earliest-expiring grant used first within each source. Free grants refresh at 00:00 UTC, Regular grants expire at the paid-period end without rollover, and PAYG grants expire 365 days after capture.
_Avoid_: User-selected source, subscription after PAYG, permanent Credits

**Creator Batch Access**:
The Audio Toolkit per-batch access rule: a signed-in account using only Free Credits processes 1 local file without ZIP export; any unexpired paid Credit balance permits up to 50 local files and ZIP export. File size remains 200 MB each and 500 MB per batch.
_Avoid_: Visitor processing, Basic/Pro limits, public downloader allowance

**Local DJ Workspace**:
The device-bound browser workspace that stores DJ project names, preparation presets, and recent activity without cloud synchronization. Audio, filenames, track lists, and workspace metadata are not uploaded; clearing browser data or changing devices loses the workspace.
_Avoid_: Cloud project, cross-device sync, audio library backup

**Qualified Returning User**:
A unique Visitor or Registered User who completes a Successful Tool Outcome on at least two distinct UTC days within a rolling 30-day window. Qualified Returning Users remain a product-quality signal, but no longer determine which tool category receives acquisition investment.
_Avoid_: Returning page view, registered user, raw organic click

**Successful Tool Outcome**:
A completed tool interaction that returns the usable result promised by that tool. A Successful Download is one kind of Successful Tool Outcome; page views, form submissions, validation failures, and upstream errors are not.
_Avoid_: Tool-page visit, button click, attempt

**Customer**:
A Registered User who has created a verified billing relationship through an approved Payment Processor. Customer describes billing identity only and does not itself grant application access.
_Avoid_: Every Registered User, payment card holder, entitlement

**Subscriber**:
A Customer with a recurring Geekskai Regular agreement processed by PayPal. Runtime processing authority comes from unexpired Audio Credit grants, not subscription status alone.
_Avoid_: `is_paid`, Basic/Pro, using subscription status directly as authorization

**Package Tier**:
The compatibility label for Audio Toolkit display: Free when no paid balance remains and Regular while any paid Credit grant is usable. PAYG and subscription Credits may coexist and are not separate capability tiers.
_Avoid_: Basic, Pro, treating PAYG as a subscription tier

**Billing Interval**:
The monthly recurrence used only by the Regular subscription. Pay As You Go is a one-time order and has no Billing Interval.
_Avoid_: Billing Plan, feature tier, hard-coded product ID in the client

**Entitlement Set**:
The capability values computed from the current Credit balance: local batch size and ZIP export. Public downloader allowances, concurrency, and Share Unlock remain separate rules.
_Avoid_: UI feature list as authorization, payment status as authorization

**Account Plan Status**:
The account's computed billing view containing its compatibility Package Tier, optional Billing Interval, payment lifecycle state, renewal date, Credit balance, and Entitlement Set. It is returned by the server and never accepted from the client.
_Avoid_: `is_paid`, client-selected Product ID

**Effective Package**:
The compatibility Package Tier derived from whether any paid Audio Credit grant remains usable. Credit deduction still occurs by source and expiry rather than by Package Tier.
_Avoid_: Subscription status as authority, merging Credit grants

**Merchant**:
Geekskai as the direct seller of paid access, responsible for its offer, tax treatment, customer disclosures, receipts or invoices, refunds, disputes, and payment support.
_Avoid_: Payment Processor, Merchant of Record

**Payment Processor**:
PayPal, which supplies Live one-time checkout, recurring billing, payment collection, and lifecycle signals without becoming the Merchant. Billing Release Control determines public availability.
_Avoid_: Merchant of Record, application authorization database, payment credentials stored by Geekskai

**Payment Approval**:
The Customer's approval of a PayPal Order or Subscription during checkout. Approval begins server verification but never grants Audio Credits by itself.
_Avoid_: Paid Activation, completed capture, completed sale, checkout return as authorization

**Opaque Billing Correlation ID**:
A random, single-purpose identifier created by Geekskai to bind one checkout attempt to the correct Registered User without sending the raw Clerk user ID to PayPal. It expires when unused and cannot be treated as authentication or an Account Entitlement.
_Avoid_: Clerk user ID in `custom_id`, email address as account binding, client-supplied identity

**Webhook Postback Verification**:
The v1 authenticity check in which Geekskai sends the received PayPal transmission metadata and event to PayPal's verification API and processes the event only after a verified response. HTTPS delivery, a matching event ID, or a successful JSON parse is not sufficient.
_Avoid_: Trusting webhook headers without verification, checkout return as webhook proof, client-side verification

**Billing Environment**:
A mutually isolated billing context whose Customers, Subscribers, processor identifiers, events, and Audio Credit grants belong exclusively to either testing or production. Test billing relationships never grant production access.
_Avoid_: Mixing test and production billing records, deployment environment

**Billing Test User**:
A Registered User reserved for validating checkout and subscription lifecycles inside the test Billing Environment. A Billing Test User is not a production Customer or Subscriber.
_Avoid_: Personal account, production customer, real subscriber

**PayPal Plan Catalog**:
One PayPal Audio Credits product and one fixed-price Regular monthly Plan for 2,800 Credits at $29 USD. Pay As You Go uses a server-created $14 USD Order and needs no recurring Plan. Runtime startup never creates or mutates PayPal catalog objects.
_Avoid_: Creating plans during checkout, Basic/Pro Plan IDs, PayPal plan for Free or PAYG

**Payment Failure Threshold**:
The PayPal plan policy that permits one failed recurring payment recovery attempt and suspends the subscription after two consecutive payment failures. Geekskai retains Payment Retry Access while the subscription remains Active and revokes it only after the verified suspension or another Terminal Payment Event.
_Avoid_: Immediate first-failure downgrade, unlimited retry access, local failure counter overriding PayPal state

**Payment Record Retention**:
The minimal local record needed to reconcile subscriptions, payments, refunds, disputes, and entitlement changes without storing card data or full PayPal webhook payloads. An unused Opaque Billing Correlation ID becomes invalid after 30 minutes and its record is removed after 30 days; the initial operational default retains necessary accounting records for seven years, subject to tax and legal confirmation before the Payment Launch Gate passes.
_Avoid_: Raw webhook archive, card storage, deleting records needed for an open dispute, claiming the provisional period is legal advice

**Processor Notification Boundary**:
The v1 rule that PayPal sends its standard payment, renewal, and subscription messages while Geekskai shows the verified billing state in the account and handles support or refund correspondence. Geekskai does not operate a separate automated billing-email system in v1.
_Avoid_: Duplicate automated receipts, silent account state, custom billing-email scope in the processor migration

**Billing Release Control**:
The server-only `BILLING_RELEASE_STAGE` state machine that moves billing through `off`, `credits`, `internal`, and `public`. `credits` enables the Audio Credit ledger but no checkout; `internal` enables checkout only for Clerk user IDs in `BILLING_INTERNAL_TEST_USER_IDS`; `public` enables checkout for everyone. `BILLING_SCHEMA_V2_ENABLED` remains until billing migrations are verified. Webhook processing and reconciliation are independent of the release stage so existing payments can always be recovered.
_Avoid_: Client-visible flag as authorization, credentials imply launch, deployment automatically enables checkout

**Paid Entitlement**:
A time-bounded paid Audio Credit grant created from a verified completed PayPal capture or recurring payment. Download-tool entitlements are not sold or synchronized from billing.
_Avoid_: Pro boolean on the user, checkout redirect as proof of access

**Paid Activation**:
A Customer who completes a batch of at least two local audio files within 24 hours of the first successful paid Credit grant. Audio, filenames, and processing settings are not recorded.
_Avoid_: Checkout return, subscription created, pricing-page click

**First-Payment Refund Window**:
The period ending 14 calendar days after each successful PAYG or Regular payment in which the Customer may request a full refund, provided none of the Credits granted by that payment have been consumed.
_Avoid_: Refund after consumption, automatic refund, prorated refund promise

**Paid-Through Access**:
The period after a Subscriber stops future renewal but before the already-paid Billing Interval ends. Unused Regular Credits remain valid only through their existing expiry unless a full refund, reversal, or dispute revokes that grant earlier.
_Avoid_: Immediate downgrade on cancellation, continued renewal, permanent grace period

**Payment Retry Access**:
The temporary retention of the Effective Package after a failed recurring payment while PayPal still reports the subscription as Active and continues recovery. It ends when PayPal suspends the subscription or another Terminal Payment Event occurs.
_Avoid_: Permanent grace period, first-failure downgrade, unpaid active plan

**Terminal Payment Event**:
A verified full refund, reversal, or dispute that revokes the corresponding paid Credit grant. Expiry ends only that grant; cancellation stops renewal but does not shorten the current grant. A partial refund requires manual review.
_Avoid_: Checkout cancellation, first payment failure, partial refund as automatic revocation

**Plan Change Freeze**:
The v1 rule that a Subscriber cannot revise the Regular Plan. The Subscriber may cancel renewal and may independently buy PAYG Credits without altering the subscription.
_Avoid_: Automatic proration, upgrade tiers, PayPal revise flow

**Fixed Gross Price**:
The final USD amount authorized by the Customer: $14 for 480 PAYG Credits or $29 for 2,800 Regular monthly Credits, with no additional tax added during checkout. Geekskai determines and absorbs any applicable indirect tax from that amount.
_Avoid_: Tax-exclusive display, PayPal-calculated global tax, undisclosed checkout surcharge

**Account Entitlement**:
A legacy capability record retained for migration compatibility. New Audio Toolkit authorization uses atomic Audio Credit grants, reservations, allocations, and settlements.
_Avoid_: New paid writes to account entitlements, payment status as authorization

**Quota-Gate Activation**:
A unique Visitor who sees a Quota Gate, completes registration, and then completes at least one Successful Download within 24 hours. Registration without the subsequent Successful Download is not an activation.
_Avoid_: Registration count, sign-up click, account created

**Growth Journey**:
A first-party, pseudonymous sequence of quota-funnel events identified before registration by a server-issued opaque `journey_id` and associated with a Clerk user ID after registration. It records event names, tool identifiers, restricted Share Channel, surface, copy mode and variant dimensions, and timestamps, but never share-copy text, media URLs, tool input, or IP addresses.
_Avoid_: Browser fingerprint, advertising identity, media history

**New Account Completion**:
A Registration Return in which the server confirms that the authenticated Clerk user's creation time belongs to the same recent `signup_started` Growth Journey. Returning with an existing account is recorded separately as `signin_completed` and never counted as a new account.
_Avoid_: Client-reported signup, sign-in as signup, registration-page visit

**Referred Registration**:
A New Account Completion whose Growth Journey has a valid, unexpired 30-day first-touch Share Attribution. It is an attribution result only and grants no reward to the inviter or new account in the first release.
_Avoid_: Share landing as registration, last-click overwrite, referral reward

**Share Channel**:
One of `x`, `whatsapp`, `telegram`, `reddit`, or `copy`, recorded only when the person selects that real channel action. Each selection receives an independent server-issued `share_id`; the value is a bounded analytics dimension, not proof that content was published.
_Avoid_: Generic social event, platform account identity, verified publication

**Growth Feature Kill Switch**:
A server-only, independently authorized control. `GROWTH_SHARE_CHANNELS_ENABLED=true` enables Safe Result Sharing and post-download attribution. It defaults to false and does not control the existing registration action or quota-gate X Share Unlock. Registration uses one fixed message rather than an A/B experiment.
_Avoid_: Public client flags, implicit activation from server quota mode, registration-copy bucketing

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
A once-per-Quota-Day reward of 5 additional downloads available only from the Quota Gate when a Visitor or Registered User successfully opens a prepared Geekskai X composer. It raises a Visitor's daily maximum to 8 and a Registered User's daily maximum to 15, but does not claim that the post was published or verified. Safe Result Sharing channels never grant allowance, and Audio Toolkit Package Tier does not affect eligibility.
_Avoid_: Post-download reward, non-X reward, popup-blocked reward, verified share, unlimited sharing

**Share Attribution**:
A 30-day, first-touch association created when a recipient opens a Geekskai URL containing an opaque random `share_id`. It connects a share landing to later registration and Quota-Gate Activation without exposing the sharer's Clerk ID or personal data; it provides measurement only and grants no inviter reward in the first release.
_Avoid_: Clerk ID in URL, last-click overwrite, automatic referral reward

**Quota Gate**:
The choice shown when a person's Daily Download Allowance reaches zero. Account creation is the primary action and Share Unlock is the secondary, account-free alternative.
_Avoid_: Paywall, forced registration, share wall

**Quota Tool Rollout**:
The first release scope covering every downloader that uses the shared download-quota controller, including YouTube Shorts after removal of its legacy local-only reward logic, with an independent server-side enable switch per tool. Ordinary tools without download quotas remain outside the rollout.
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

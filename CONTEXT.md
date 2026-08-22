# Geekskai Growth

This context defines the user-growth language for converting anonymous tool usage into durable account relationships.

## Language

**Visitor**:
A person using a public tool without signing in.
_Avoid_: Guest account, anonymous user

**Registered User**:
A person with an authenticated Geekskai account.
_Avoid_: Member, subscriber, customer

**Acquisition-First Mode**:
The current Geekskai product phase in which public tools remain free and effort is prioritized around measurable organic acquisition rather than payment conversion or a predetermined product vertical.
_Avoid_: Payment launch, speculative tool expansion, paid downloader growth

**Commercialization Pause**:
The state in which no live payment provider is selected, checkout remains disabled, and no paid entitlement is granted. Existing billing work is dormant preparation rather than a production offer.
_Avoid_: Failed launch, free trial, hidden checkout

**Dormant Pricing Surface**:
The retained but non-promoted Pricing implementation during the Commercialization Pause. Pricing is removed from primary navigation and the sitemap, carries `noindex`, and exposes no active checkout or acquisition call to action. Its code and package model remain available for a future explicit commercialization restart.
_Avoid_: Public package promotion, indexable Pricing page, active checkout, deleting recoverable billing preparation

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
An optional growth loop for tools whose completed result can be shared safely. A tool may create a clean share link or embed code using an opaque identifier that exposes neither raw input nor sensitive result data. Sharing is never required, rewarded, or treated as proof of publication.
_Avoid_: Share wall, share-for-credits, raw input in URL, sensitive public result, claimed verified share

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

**Creator Batch Access**:
The free per-batch access rule for DJ Preparation: a Visitor may process up to 3 local files, while a Registered User may process up to 10 and export the completed batch as a ZIP. Browser-local processing has no daily limit and does not consume Daily Download Allowance.
_Avoid_: Paid batch tier, daily audio-processing credits, public downloader allowance

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
A Registered User who has created a verified billing relationship with an approved provider. Customer describes billing identity only and does not itself grant application access.
_Avoid_: Every Registered User, payment card holder, entitlement

**Subscriber**:
A Customer with a recurring Geekskai Basic or Pro agreement from an approved provider. Runtime access is still determined from the Effective Package and Account Entitlements.
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
The one Audio Toolkit Package Tier currently applied to a Registered User. A verified Basic or Pro subscription takes precedence over Free.
_Avoid_: Additive plan stacking, merging multiple subscriptions

**Billing Provider**:
The externally approved authority for checkout, payment collection, recurring billing, tax, receipts, refunds, disputes, and subscription lifecycle. No live Billing Provider is selected during the Commercialization Pause.
_Avoid_: Application authorization database, payment credentials stored by Geekskai

**Billing Environment**:
A mutually isolated billing context whose Customers, Subscribers, provider identifiers, events, and Account Entitlements belong exclusively to either testing or production. Test billing relationships never grant production access.
_Avoid_: Mixing test and production billing records, deployment environment

**Billing Test User**:
A Registered User reserved for validating checkout and subscription lifecycles inside the test Billing Environment. A Billing Test User is not a production Customer or Subscriber.
_Avoid_: Personal account, production customer, real subscriber

**Paid Entitlement**:
A future Audio Toolkit Account Entitlement synchronized from a verified Billing Provider event. Download-tool entitlements are not sold or synchronized from billing.
_Avoid_: Pro boolean on the user, checkout redirect as proof of access

**Paid Activation**:
A Subscriber who completes a batch of at least two local audio files within 24 hours of the first successful subscription payment. Audio, filenames, and processing settings are not recorded.
_Avoid_: Checkout return, subscription created, pricing-page click

**Account Entitlement**:
A time-bounded Audio Toolkit capability value assigned to a Registered User, identified by a stable key such as `workspace.batch_file_limit`, with its source and validity period. Free defaults remain application rules; only future paid Audio Toolkit additions require stored entitlements.
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

---
name: clerk-billing
description: Clerk Billing for subscription management - render Clerk's PricingTable
  and in-app checkout drawer, configure subscription plans, seat-limit plans for
  B2B, feature entitlements with has(), and billing webhooks. Use for SaaS
  monetization, plan gating, checkout flows, trials, invoicing, and subscription
  lifecycle management.
allowed-tools: WebFetch
license: MIT
compatibility: Requires NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, and CLERK_WEBHOOK_SIGNING_SECRET. Billing must be enabled in Clerk Dashboard → Billing. Development instances can use the shared Clerk development gateway; production instances require a Stripe account for payment processing.
metadata:
  author: clerk
  version: 1.0.0
---

# Billing

> **STOP, prerequisite.** Billing must be enabled before any `<PricingTable />`, `<CheckoutButton />`, `has({ plan })`, or `has({ feature })` usage works. Two paths: (1) [Dashboard → Billing → Settings](https://dashboard.clerk.com/last-active?path=billing/settings), or (2) `clerk enable billing` (see "Agent-first: Programmatic billing config" below). Enabling auto-creates default `free_user` / `free_org` plans. Dev instances can use the shared Clerk development gateway (no Stripe account needed); production requires a Stripe account for payment processing only.
>
> **Note**: Billing APIs are still experimental. Pin your `@clerk/nextjs` and `clerk-js` package versions. See `clerk` skill for the supported version table.

## Quick Start

1. **Enable Billing**, via [Dashboard → Billing → Settings](https://dashboard.clerk.com/last-active?path=billing/settings) or `clerk enable billing` (see Agent-first section). Skipping this throws `cannot_render_billing_disabled` in dev and renders empty in prod.
2. **Create plans in the matching tab**, [Dashboard → Billing → Plans](https://dashboard.clerk.com/last-active?path=billing/plans). Two tabs, slugs scoped per tab, not movable after creation:
   - **User Plans** → `<PricingTable />` (default `for="user"`)
   - **Organization Plans** → `<PricingTable for="organization" />`

   Wrong-tab is the #1 cause of an empty `<PricingTable />`. Plans live in Clerk; not synced to Stripe.
3. **Add features inside a plan**, open the plan in Dashboard → Billing → Plans, use its Features section. Features are scoped per plan, not global. The same slug can attach to multiple plans; `has({ feature: 'export' })` matches if the active plan contains that slug.
4. **Render `<PricingTable />`** (pass `for="organization"` for B2B).
5. **Gate access** with `has({ plan })` or `has({ feature })` from `auth()`.
6. **Handle billing webhooks** for subscription lifecycle.

## Dashboard shortcuts

| Action | URL |
|---|---|
| Enable Billing | `https://dashboard.clerk.com/last-active?path=billing/settings` |
| Create / edit plans | `https://dashboard.clerk.com/last-active?path=billing/plans` |
| Membership mode (B2C + B2B coexistence) | `https://dashboard.clerk.com/last-active?path=organizations-settings` |
| Edit features | Plans → click a plan → Features section (no direct URL) |

## Agent-first: Programmatic billing config

The full billing config (enable toggles, plans, features, plan-feature attachments) is editable via PLAPI without touching the Dashboard. Useful for agents seeding plans, replicating config across instances, or version-controlling billing structure.

Pre-req: project linked to the Clerk app (`clerk auth login` + `clerk link`, see `clerk-setup`).

### Enable Billing via CLI

```bash
clerk enable billing                # both targets (default, auto-creates free_user + free_org plans)
clerk enable billing --for org      # org only
clerk enable billing --for user     # user only
```

### Pull current billing config

```bash
clerk config pull --keys billing > billing.json
```

This writes the current billing config (toggles + plans + features) for the linked instance to `billing.json`.

### Edit and apply

Edit `billing.json` to add/remove plans or features, then preview the diff and apply:

```bash
clerk config patch --file billing.json --dry-run
clerk config patch --file billing.json
```

Pass `--instance prod` to target the production instance instead of dev.

### Raw PATCH (full control)

For one-shot plan/feature updates without a config file:

```bash
clerk api --platform PATCH /v1/platform/applications/<app_id>/instances/<ins_id>/config \
  -d '{"billing":{"plans":[{"slug":"pro","name":"Pro","amount":2000,"currency":"usd","payer_type":"user","is_recurring":true}],"features":[{"slug":"export","name":"Export"}]}}'
```

### Notes

- This handles **billing config** (toggles + plans + features catalog). **Subscription lifecycle** (users picking a plan, checkout, renewal, cancellation) still flows through `<PricingTable />` + billing webhooks, see `clerk-webhooks` skill for the lifecycle events.
- Top-level `features` map manipulation and plan-feature attachments (sync) are fully supported via the PLAPI billing config handler.

## What Do You Need?

| Task | Reference |
|------|-----------|
| `<PricingTable />` props, `<CheckoutButton />`, `<Show>` billing patterns | references/billing-components.md |
| B2C patterns (individual user subscriptions, `Membership optional` prerequisite) | references/b2c-patterns.md |
| B2B patterns (org subscriptions, seat-limit plans, admin-gated billing UI) | references/b2b-patterns.md |
| Webhook event catalog, payload shapes, handler templates | references/billing-webhooks.md |

## References

| Reference | Description |
|-----------|-------------|
| `references/billing-components.md` | `<PricingTable />` and subscription UI |
| `references/b2c-patterns.md` | B2C subscription billing patterns |
| `references/b2b-patterns.md` | B2B billing with organization subscriptions and seat-limit plans |
| `references/billing-webhooks.md` | Subscription lifecycle event handling |

## Documentation

- [Billing overview](https://clerk.com/docs/guides/billing/overview)
- [B2B SaaS billing](https://clerk.com/docs/guides/billing/for-b2b)
- [B2C SaaS billing](https://clerk.com/docs/guides/billing/for-b2c)
- [Billing webhooks](https://clerk.com/docs/guides/development/webhooks/billing)

## Features vs Plans: When to Use Which

**Use `has({ feature: 'slug' })` when gating a specific capability**, export, analytics, API access, audit logs.

**Use `has({ plan: 'slug' })` when gating a tier**, showing the pro dashboard, checking org subscription level, redirecting free users.

| Scenario | Correct check |
|----------|---------------|
| Gate the "Export CSV" button | `has({ feature: 'export' })` |
| Gate the "Analytics" section | `has({ feature: 'analytics' })` |
| Gate all of /dashboard/pro | `has({ plan: 'pro' })` |
| Check if org has team subscription | `has({ plan: 'org:team' })` |
| Gate SSO configuration | `has({ feature: 'sso' })` |

When a user says "gate the export feature" or "gate analytics", always use `has({ feature })`. Only use `has({ plan })` when the gate is the plan tier itself, not a specific capability within it.

## Key Patterns

### 1. Render the Pricing Table

Show available plans to users with a single component:

```tsx
import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
	return (
		<main>
			<h1>Choose a plan</h1>
			<PricingTable />
		</main>
	)
}
```

`<PricingTable />` automatically renders all plans configured in the Clerk Dashboard. Selecting a plan opens Clerk's in-app checkout drawer. No props needed for basic usage. For B2B, pass `for="organization"` to render org-level plans instead of user plans.

### 2. Check Feature Entitlements (Server-Side)

Gate by individual features, this is the preferred approach for specific capabilities:

```typescript
import { auth } from '@clerk/nextjs/server'

export default async function AnalyticsPage() {
	const { has } = await auth()

	const canViewAnalytics = has({ feature: 'analytics' })
	const canExport = has({ feature: 'export' })

	return (
		<div>
			{canViewAnalytics && <AnalyticsChart />}
			{canExport && <ExportButton />}
		</div>
	)
}
```

Features are configured in Clerk Dashboard → Billing → Features and assigned to plans. Use `has({ feature })` instead of `has({ plan })` when gating granular capabilities, check the feature, not the plan.

### 3. Check Feature Entitlements (Client-Side)

Use `useAuth()` for client-side feature gating. Combine with server-side checks for full coverage:

```tsx
'use client'
import { useAuth } from '@clerk/nextjs'

export function FeatureGatedUI() {
	const { has, isLoaded } = useAuth()
	if (!isLoaded) return null

	const canExport = has?.({ feature: 'export' })
	const canAnalytics = has?.({ feature: 'analytics' })

	return (
		<div>
			{canAnalytics && <AnalyticsSection />}
			{canExport ? <ExportButton /> : <UpgradeToExport />}
		</div>
	)
}
```

Server Components use `auth()`, Client Components use `useAuth()`. Both support `has({ feature })` and `has({ plan })`.

### 4. Check Subscription Plan Server-Side

Gate access by subscription plan (use this for tier-level gates, not individual features):

```typescript
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function ProDashboard() {
	const { has } = await auth()

	if (!has({ plan: 'pro' })) {
		redirect('/pricing')
	}

	return <ProFeatures />
}
```

### 5. Client-Side Plan Checks

Use `useAuth()` hook for client components:

```tsx
'use client'
import { useAuth } from '@clerk/nextjs'

export function UpgradePrompt() {
	const { has } = useAuth()

	if (has?.({ plan: 'pro' })) {
		return null
	}

	return (
		<div>
			<p>Upgrade to Pro to access this feature</p>
			<a href="/pricing">View plans</a>
		</div>
	)
}
```

### 6. B2B Seat-Based Billing with Organizations

Org plans can carry a **seat limit** (membership cap) that Clerk enforces at invite time. Use the `org:` slug prefix on org-side plan checks (e.g. `has({ plan: 'org:team' })`) to keep gating unambiguous. Render the B2B pricing page with `<PricingTable for="organization" />`, and use `<OrganizationProfile />` for the org account billing UI.

See `references/b2b-patterns.md` for tiered plan naming, seat-limit invariants, admin-only billing, and webhook handlers.

### 7. Display Subscription Status

Check specific plans with `has({ plan })`, or use `useSubscription()` for full subscription details in client components. Do not read plan information from `sessionClaims` directly, that is not the supported path.

Server component, check for specific plans:

```typescript
import { auth } from '@clerk/nextjs/server'

export default async function AccountPage() {
	const { has } = await auth()

	const currentPlan = has({ plan: 'pro' })
		? 'pro'
		: has({ plan: 'starter' })
			? 'starter'
			: 'free'

	return (
		<div>
			<h2>Current Plan</h2>
			<p>You are on the {currentPlan} plan</p>
			{currentPlan === 'free' && <a href="/pricing">Upgrade</a>}
		</div>
	)
}
```

Client component, full subscription details via `useSubscription()`:

```tsx
'use client'
import { useSubscription } from '@clerk/nextjs/experimental'

export function SubscriptionDetails() {
	const { data: subscription, isLoading } = useSubscription()
	if (isLoading) return null
	if (!subscription) return <a href="/pricing">Choose a plan</a>

	return (
		<div>
			<p>Status: {subscription.status}</p>
			{subscription.nextPayment && (
				<p>Next payment: {subscription.nextPayment.date.toLocaleDateString()}</p>
			)}
		</div>
	)
}
```

> `useSubscription()` is for display only. For authorization checks (gating content or routes), always use `has({ plan })` or `has({ feature })`.

### 8. Protect API Routes by Plan

Gate API routes using `auth()`:

```typescript
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
	const { has } = await auth()

	if (!has({ plan: 'pro' })) {
		return NextResponse.json({ error: 'Pro plan required' }, { status: 403 })
	}

	return NextResponse.json({ data: 'premium data' })
}
```

### 9. Handle Billing Webhooks

> **Clerk event names differ from Stripe event names.** Clerk billing webhooks use dot-notation and camelCase, not Stripe's underscore format.
>
> There is no `subscription.canceled` event. Cancellation fires at the item level as `subscriptionItem.canceled`.
>
> | Intent | Stripe event name | Clerk event name |
> |--------|------------------|-----------------|
> | Subscription created | `customer.subscription.created` | `subscription.created` |
> | Subscription updated | `customer.subscription.updated` | `subscription.updated` |
> | Subscription active | (none) | `subscription.active` |
> | Subscription past due | (none) | `subscription.pastDue` |
> | Subscription item canceled | `customer.subscription.deleted` | `subscriptionItem.canceled` |
> | Subscription item past due | `invoice.payment_failed` | `subscriptionItem.pastDue` |
> | Subscription item updated | (none) | `subscriptionItem.updated` |
> | Subscription item active | (none) | `subscriptionItem.active` |
> | Subscription item upcoming renewal | (none) | `subscriptionItem.upcoming` |
> | Subscription item ended | (none) | `subscriptionItem.ended` |
> | Subscription item abandoned | (none) | `subscriptionItem.abandoned` |
> | Subscription item expired | (none) | `subscriptionItem.expired` |
> | Subscription item incomplete | (none) | `subscriptionItem.incomplete` |
> | Free trial ending soon | (none) | `subscriptionItem.freeTrialEnding` |
> | Payment attempt created | (none) | `paymentAttempt.created` |
> | Payment attempt updated | (none) | `paymentAttempt.updated` |
>
> Always use Clerk's event names, never Stripe's, in `evt.type` checks.

> **Payload shape.** Clerk billing webhook payloads are nested. The subscribing entity lives under `evt.data.payer` (fields: `user_id?`, `organization_id?`). The plan info is on each item under `evt.data.items[i].plan.slug`. The subscription id is simply `evt.data.id`. Subscription items do not carry a `subscription_id` field back-reference, so in `subscriptionItem.*` handlers you identify the record by the item id (`evt.data.id`) or look up by payer plus plan.

Minimal handler to anchor the pattern (import from `@clerk/nextjs/webhooks`, verify, branch on Clerk event name):

```typescript
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
	let evt
	try {
		evt = await verifyWebhook(req)
	} catch {
		return new Response('Verification failed', { status: 400 })
	}

	if (evt.type === 'subscription.created') {
		const { id, payer, items, status } = evt.data
		const entityId = payer.organization_id ?? payer.user_id
		const plan = items[0]?.plan?.slug
		await db.subscriptions.upsert({
			where: { subscriptionId: id },
			create: { subscriptionId: id, entityId, plan, status },
			update: { entityId, plan, status },
		})
	}

	// Add more branches per the event catalog above (subscription.updated,
	// subscriptionItem.canceled, subscriptionItem.pastDue, etc.)

	return new Response('OK', { status: 200 })
}
```

For the full template covering all 15 events, the TS type declarations from `@clerk/backend`, the `proxy.ts` public-route setup, and the subscription status value table, see `references/billing-webhooks.md`.

### 10. Upgrade / Downgrade Flow

Let users manage their subscription from inside the app:

```tsx
import { PricingTable } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

export default async function BillingPage() {
	const { has } = await auth()
	const isPro = has({ plan: 'pro' })

	return (
		<div>
			<h1>Billing</h1>
			{isPro ? (
				<div>
					<p>You are on the Pro plan</p>
					<PricingTable />
				</div>
			) : (
				<div>
					<p>Upgrade to access premium features</p>
					<PricingTable />
				</div>
			)}
		</div>
	)
}
```

`<PricingTable />` renders differently for subscribed users, it shows the current plan and allows upgrades or cancellations, all through Clerk's in-app checkout drawer.

## Plan and Feature Naming

Plan slugs and feature slugs are defined in Clerk Dashboard → Billing. Common conventions:

| Tier | Plan Slug | Example Features |
|------|-----------|-----------------|
| Free | (no plan check needed) | basic features |
| Starter | `starter` | `analytics`, `api_access` |
| Pro | `pro` | `analytics`, `export`, `team` |
| Enterprise | `enterprise` | all features + `sso`, `audit_logs` |

Use lowercase slugs matching what you define in the dashboard.

## B2B vs B2C Billing

| Scenario | Who subscribes | Plan check |
|----------|---------------|------------|
| B2C SaaS | Individual user | `has({ plan: 'pro' })` on user session |
| B2B SaaS | Organization | `has({ plan: 'org:team' })` on org session |
| Seat-limited B2B | Organization | Plan has a seat cap; pricing is per-plan, not per-member, tier your plans for bigger orgs |

For B2B, ensure the user has an active org session. The `has()` check evaluates the active entity (user or org).

## Checkout Flows

Clerk renders its own checkout drawer automatically through `<PricingTable />` and `<CheckoutButton />`. Plans and pricing live in Clerk. To trigger checkout from a server action, redirect to a page that renders `<PricingTable />`:

```typescript
'use server'
import { redirect } from 'next/navigation'

export async function upgradeAction() {
	redirect('/pricing')
}
```

## Error Signatures (diagnose fast)

When you see any of these errors or symptoms, the fix is almost always a Dashboard toggle, not a code change. Do not start editing components.

| Error / symptom | Root cause | Fix |
|---|---|---|
| `Clerk: 🔒 The <PricingTable/> component cannot be rendered when billing is disabled.` (code: `cannot_render_billing_disabled`, dev only) | Billing is not enabled for this instance | Enable Billing at [dashboard.clerk.com → Billing → Settings](https://dashboard.clerk.com/last-active?path=billing/settings), or run `clerk enable billing`. |
| `<PricingTable />` renders empty | No plans, OR plan in the wrong tab (User vs Organization), OR Billing not enabled | Create plan in matching tab; pass `for="organization"` for B2B; check Billing Settings |
| Users can't subscribe to a personal plan on a B2C + B2B app | Membership required mode (default since 2025-08-22) disables personal accounts, signed-in users are forced into `choose-organization` and never land on a personal-subscription state | If you need personal + org subscriptions coexisting: Dashboard → Organizations settings → *Membership optional* |
| Can't find a Features page | Features are per-plan, not global | Dashboard → Billing → Plans → click plan → Features |
| `has({ plan: 'pro' })` always returns `false` after a successful checkout | Session token hasn't been refreshed to include the new plan | `await clerk.session?.reload()` or navigate to force a new session |
| `has({ plan: 'pro' })` returns `false` before any subscribe attempt | Plan slug mismatch (case-sensitive), OR Billing not enabled, OR payment gateway not connected in production | Verify slug in Dashboard → Billing → Plans; confirm Billing → Settings shows enabled + connected gateway |
| `has({ permission: 'org:x:y' })` returns `false` for a user who has the role | The Feature tied to that permission is not included in the organization's active Plan | Add the Feature to the Plan in Dashboard → Billing → Plans → Features |
| Webhook 401 / signature verification failed | `CLERK_WEBHOOK_SIGNING_SECRET` mismatch or route protected by middleware | Copy the Signing Secret from Dashboard → Webhooks; add the webhook route to `createRouteMatcher(['/api/webhooks(.*)'])` |

## Billing Gates Permissions

When Billing is enabled, `has({ permission: 'org:posts:edit' })` returns `false` if the Feature associated with that permission is not included in the organization's active Plan, even if the user has the permission assigned via their role. This is by design: billing gates permissions at the feature level. Always ensure the required Feature is attached to the Plan in Dashboard → Billing → Plans → Features.

## See Also

- `clerk-setup` - Initial Clerk install
- `clerk-orgs` - B2B organizations (required for B2B billing and seat-limit plans)
- `clerk-webhooks` - Webhook signature verification and routing

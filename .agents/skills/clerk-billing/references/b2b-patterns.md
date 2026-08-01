# B2B Billing Patterns

## Overview

B2B billing in Clerk attaches subscriptions to **organizations**, not individual users. Each org gets its own subscription. Plans can carry a **seat limit** (membership cap) which Clerk enforces on member invites.

> **Create the plan as an Organization Plan, not a User Plan.** Use [Dashboard → Billing → Plans](https://dashboard.clerk.com/last-active?path=billing/plans) (Organization Plans tab) or `clerk config patch` with `billing.plans`. Slugs are scoped per type. A `team` plan registered under User Plans will not appear in `<PricingTable for="organization" />`, and vice versa. Plan type cannot be changed after creation, recreate if misplaced.

## Core Pattern: Org-Level Plan Check

```typescript
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function TeamDashboard() {
	const { orgId, has } = await auth()

	if (!orgId) {
		redirect('/sign-in')
	}

	if (!has({ plan: 'org:team' })) {
		redirect('/billing')
	}

	return <TeamFeatures />
}
```

**Always check `orgId` first.** If the user has no active org, `has({ plan })` evaluates against the user's personal subscription (which may not exist).

## Seat-Limit Plans

Clerk Billing's B2B model is **seat-limit plans**: each organization plan has a fixed price and an optional membership cap; Clerk enforces the cap at invite/join time. To charge larger orgs more, create tiered plans (e.g. `starter` capped at 5, `team` at 10, `enterprise` unlimited) with increasing fixed prices.

Key invariants:
- **Fixed price per plan**, not auto-scaling per member. Adding members does not increment the org's billing amount on the active plan.
- **One `active` SubscriptionItem per payer per Plan.** Do not derive seat count from `items.length`.
- **Seat limit is a Plan property.** Set it when creating the plan (Dashboard → Billing → Plans → Organization Plans tab, or `clerk config patch`); it cannot be changed later.
- When an org exceeds or changes to a plan with a lower limit, existing members stay but new invites are blocked until the org is under cap. See [Plans with seat limits](https://clerk.com/docs/guides/billing/seat-limit-plans) for the exact admin behavior.

No custom seat-counting code is needed. Read the active plan with `has({ plan: 'org:team' })` and let Clerk enforce membership limits.

## Org Billing Page

Use `<OrganizationProfile />` for the org account billing UI. It renders the active org plan, members, invitations, and the upgrade / cancellation flow scoped to the active organization, with admin-only access to billing actions enforced by Clerk:

```tsx
import { OrganizationProfile } from '@clerk/nextjs'

export default function OrgAccountPage() {
	return <OrganizationProfile />
}
```

Organization Plans configured in Dashboard → Billing → Plans automatically appear inside `<OrganizationProfile />` (in the **Plans** section). Only org admins see the billing controls. Build a custom page only when you need branded layouts or to embed `<PricingTable for="organization" />` outside the OrganizationProfile shell.

## Webhook: Org Subscription Events

```typescript
if (evt.type === 'subscription.created') {
	const { id, payer, items, status } = evt.data
	if (payer.organization_id) {
		const plan = items[0]?.plan?.slug
		await db.orgSubscriptions.upsert({
			where: { orgId: payer.organization_id },
			create: {
				orgId: payer.organization_id,
				plan,
				subscriptionId: id,
				status,
			},
			update: { plan, subscriptionId: id, status },
		})
	}
}

if (evt.type === 'subscription.updated') {
	const { id, payer, items, status } = evt.data
	if (payer.organization_id) {
		const plan = items[0]?.plan?.slug
		await db.orgSubscriptions.update({
			where: { orgId: payer.organization_id },
			data: { plan, status },
		})
	}
}
```

Use `payer.organization_id` (nested under `payer`, not a top-level `org_id`) when the subscription belongs to an organization. Do NOT use `items.length` as a seat count, seat limits are set at the plan level and there is only one active SubscriptionItem per payer per Plan.

## Plan Naming for B2B

Tier plans by seat cap so bigger orgs pay more:

| Plan | Slug | Seat cap |
|------|------|-------|
| Startup | `org:starter` | 5 |
| Team | `org:team` | 10 |
| Business | `org:business` | 25 |
| Enterprise | `org:enterprise` | unlimited (requires B2B Authentication add-on) |

Define these via Dashboard → Billing → Plans → **Organization Plans** tab with **Seat-based** toggled on, or via `clerk config patch` with `billing.plans`. Use the `org:` prefix in slugs to disambiguate org plans from user plans in code (`has({ plan: 'org:team' })` vs `has({ plan: 'team' })`). Seat caps above 20 and "unlimited" require the B2B Authentication add-on.

## Common Mistake: Checking Plan Without Active Org

```typescript
// WRONG, user has no active org, has() checks user subscription
const { has } = await auth()
if (!has({ plan: 'org:team' })) redirect('/billing')

// CORRECT, check orgId first
const { orgId, has } = await auth()
if (!orgId) redirect('/sign-in')
if (!has({ plan: 'org:team' })) redirect('/billing')
```

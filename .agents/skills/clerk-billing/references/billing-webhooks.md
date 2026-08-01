# Billing Webhooks

## Setup

Billing webhooks use the same `verifyWebhook(req)` pattern as all Clerk webhooks. Register the endpoint in Clerk Dashboard → Webhooks.

Subscribe to the billing events you care about. Full catalog:

Subscription events (4):
- `subscription.created`
- `subscription.updated`
- `subscription.active`
- `subscription.pastDue`

SubscriptionItem events (10):
- `subscriptionItem.updated`
- `subscriptionItem.active`
- `subscriptionItem.canceled`
- `subscriptionItem.upcoming`
- `subscriptionItem.ended`
- `subscriptionItem.expired`
- `subscriptionItem.abandoned`
- `subscriptionItem.incomplete`
- `subscriptionItem.pastDue`
- `subscriptionItem.freeTrialEnding`

Payment attempt events (2):
- `paymentAttempt.created`
- `paymentAttempt.updated`

> There is no `subscription.canceled` event. Cancellation fires at the item level as `subscriptionItem.canceled`.

## Payload Shape (important)

Clerk billing webhook payloads are nested. Common mistakes come from destructuring fields that live deeper than the top level. The canonical shape:

- `evt.data.id`: the subscription or subscription item id (use this as the subscription id reference)
- `evt.data.payer`: the subscribing entity, with `user_id?` and `organization_id?` (not `org_id`)
- `evt.data.status`: server-side status string (snake_case, e.g. `past_due`, even though event names are camelCase)
- `evt.data.items[]`: on subscription events only, the array of subscription items
- `evt.data.items[i].plan.slug`: the plan slug for a given item (plan is a nested object)
- On subscriptionItem events, the event data IS the item. There is no `subscription_id` back-reference, so match by `payer` + `plan.slug` or persist item ids independently.

## Complete Billing Webhook Handler

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

	if (evt.type === 'subscription.created' || evt.type === 'subscription.active') {
		const { id, payer, items, status } = evt.data
		const entityId = payer.organization_id ?? payer.user_id
		const plan = items[0]?.plan?.slug
		await db.subscriptions.upsert({
			where: { subscriptionId: id },
			create: { subscriptionId: id, entityId, plan, status },
			update: { entityId, plan, status },
		})
	}

	if (evt.type === 'subscription.updated') {
		const { id, payer, items, status } = evt.data
		const entityId = payer.organization_id ?? payer.user_id
		const plan = items[0]?.plan?.slug
		await db.subscriptions.update({
			where: { subscriptionId: id },
			data: { entityId, plan, status },
		})
	}

	if (evt.type === 'subscription.pastDue') {
		const { id, status } = evt.data
		await db.subscriptions.update({
			where: { subscriptionId: id },
			data: { status },
		})
	}

	if (evt.type === 'subscriptionItem.canceled') {
		// Subscription item events carry only the item, not its parent subscription id.
		// Identify the record by payer + plan slug.
		const { payer, plan, canceled_at } = evt.data
		const entityId = payer?.organization_id ?? payer?.user_id
		await db.subscriptionItems.update({
			where: { entityId, plan: plan?.slug },
			data: { status: 'canceled', canceledAt: canceled_at },
		})
		// Notify user/org admin of cancellation
	}

	if (evt.type === 'subscriptionItem.pastDue') {
		const { payer, plan, past_due_at } = evt.data
		const entityId = payer?.organization_id ?? payer?.user_id
		await db.subscriptionItems.update({
			where: { entityId, plan: plan?.slug },
			data: { status: 'past_due', pastDueAt: past_due_at },
		})
		// Notify user/org admin of payment failure
	}

	return new Response('OK', { status: 200 })
}
```

## Make Route Public

In `proxy.ts` (Next.js <=15: `middleware.ts`):

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/api/webhooks(.*)'])

export default clerkMiddleware(async (auth, req) => {
	if (!isPublicRoute(req)) await auth.protect()
})
```

## Event Payload Reference

Types come from `BillingSubscriptionWebhookEventJSON` and `BillingSubscriptionItemWebhookEventJSON` in `@clerk/backend`. Key fields:

### subscription.created / subscription.updated / subscription.active / subscription.pastDue

```typescript
{
	type: 'subscription.created',
	data: {
		object: 'commerce_subscription',
		id: string,                    // subscription id
		status: 'active' | 'past_due' | 'canceled' | 'ended' | 'abandoned' | 'incomplete' | 'expired' | 'upcoming',
		active_at?: number,
		canceled_at?: number,
		ended_at?: number,
		past_due_at?: number,
		created_at: number,
		updated_at: number,
		latest_payment_id: string,
		payer_id: string,
		payer: {
			object: 'commerce_payer',
			id: string,
			user_id?: string,           // set for B2C subscriptions
			organization_id?: string,   // set for B2B subscriptions
			email: string,
			first_name?: string,
			last_name?: string,
			organization_name?: string,
			// ...
		},
		payment_source_id: string,
		items: Array<{                  // subscription items, one active item per payer per Plan
			id: string,
			status: string,
			plan?: { id, name, slug, amount, period, ... },
			period_start: number,
			period_end: number | null,
			canceled_at?: number,
			past_due_at?: number,
			// ...
		}>,
	}
}
```

### subscriptionItem.canceled / subscriptionItem.pastDue / subscriptionItem.*

The event data IS the item itself, not the parent subscription:

```typescript
{
	type: 'subscriptionItem.canceled',
	data: {
		object: 'commerce_subscription_item',
		id: string,                    // subscription item id
		status: string,
		period_start: number,
		period_end: number | null,
		canceled_at?: number,
		past_due_at?: number,
		plan?: { id, slug, name, amount, period, ... },
		plan_id?: string | null,
		payer?: { user_id?, organization_id?, email, ... },
		amount: { amount, amount_formatted, currency, currency_symbol },
		// ...
	}
}
```

### paymentAttempt.created / paymentAttempt.updated

```typescript
{
	type: 'paymentAttempt.created',
	data: {
		object: 'commerce_payment_attempt',
		id: string,
		status: 'pending' | 'paid' | 'failed',
		charge_type: 'checkout' | 'recurring',
		failed_reason?: { code: string, decline_code: string },
		paid_at?: number,
		failed_at?: number,
		payer: { user_id?, organization_id?, ... },
		subscription_items: Array<{ /* same shape as subscriptionItem events */ }>,
		// ...
	}
}
```

## Key Rules

- The subscribing entity lives at `evt.data.payer`, with `user_id?` (B2C) or `organization_id?` (B2B)
- The subscription id is `evt.data.id` on subscription events, not a separate `subscription_id` field
- Plan slug is nested: `evt.data.items[i].plan?.slug` on subscription events, `evt.data.plan?.slug` on item events
- Status values use snake_case (`past_due`, `active`, `canceled`), even though event names use camelCase (`subscription.pastDue`)
- Always return `200` quickly. Handle async work in a queue or background job.
- Use `upsert` in `subscription.created` handlers to tolerate webhook replays
- `CLERK_WEBHOOK_SIGNING_SECRET` must match the Signing Secret from the Clerk Dashboard endpoint

## Subscription Status Values

| Status | Meaning |
|--------|---------|
| `active` | Subscription is active and paid |
| `past_due` | Payment failed, grace period |
| `canceled` | Subscription ended |
| `ended` | Subscription reached the end of its term |
| `abandoned` | Checkout started but user never completed payment |
| `incomplete` | Checkout in progress |
| `expired` | Subscription expired without renewal |
| `upcoming` | Scheduled subscription not yet active |

# Billing Components

## PricingTable

The primary billing UI component. Renders subscription plans and opens Clerk's in-app checkout drawer when a user selects a plan.

```tsx
import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
	return <PricingTable />
}
```

**What it does:**
- Fetches plan data from Clerk Dashboard configuration
- Renders plan cards with features, pricing, and CTA buttons
- Opens Clerk's in-app **checkout drawer** on plan selection
- Shows current plan for subscribed users with upgrade/downgrade options

**Key behaviors:**
- Respects the active entity by default: user subscription for personal accounts, org subscription in org context. Override with `for`.
- For an account-management UI that includes plan switching, cancellations, payment methods, and invoices, render `<UserProfile />` (B2C) or `<OrganizationProfile />` (B2B) instead. Use `<PricingTable />` standalone only when you need a dedicated pricing page.

**Props (all optional):**

| Prop | Type | Description |
|------|------|-------------|
| `appearance` | `Appearance` | Style overrides for the component. |
| `checkoutProps` | `{ appearance: Appearance }` | Style overrides for the checkout drawer. |
| `collapseFeatures` | `boolean` | Start with features collapsed. Requires `layout: 'default'`. Defaults to `false`. |
| `ctaPosition` | `'top' \| 'bottom'` | Placement of the CTA button. Requires `layout: 'default'`. Defaults to `'bottom'`. |
| `fallback` | `JSX` | UI to show while the pricing table is loading. |
| `for` | `'user' \| 'organization'` | Which subscriber the table targets. Defaults to `'user'`. **Use `'organization'` for B2B.** |
| `newSubscriptionRedirectUrl` | `string` | URL to navigate to after checkout completes. |

For most cases, use `<PricingTable />` with no props (or just `for="organization"` for B2B).

## CheckoutButton

For custom checkout UX outside `<PricingTable />`, use `<CheckoutButton />` from `@clerk/nextjs/experimental`. It opens the same checkout drawer for a specific `planId`. Must be wrapped in `<Show when="signed-in">`.

```tsx
'use client'
import { Show } from '@clerk/nextjs'
import { CheckoutButton } from '@clerk/nextjs/experimental'

export function UpgradeCTA() {
	return (
		<Show when="signed-in">
			<CheckoutButton
				planId="cplan_xxx"
				planPeriod="annual"
				for="user"
				newSubscriptionRedirectUrl="/dashboard"
				onSubscriptionComplete={() => console.log('subscribed')}
			/>
		</Show>
	)
}
```

Key props: `planId` (required), `planPeriod: 'month' | 'annual'`, `for: 'user' | 'organization'`, `onSubscriptionComplete`, `newSubscriptionRedirectUrl`, `checkoutProps: { appearance }`. Throws if `for="organization"` is set with no active Organization.

## has(), Plan and Feature Checks

`has()` is returned by `auth()` (server) and `useAuth()` (client). It checks subscription plans and feature entitlements.

### Server usage

```typescript
import { auth } from '@clerk/nextjs/server'

const { has } = await auth()

has({ plan: 'pro' })        // true if user/org is on 'pro' plan
has({ feature: 'export' })  // true if user/org has 'export' feature entitlement
```

### Client usage

```tsx
'use client'
import { useAuth } from '@clerk/nextjs'

const { has } = useAuth()
has?.({ plan: 'pro' })       // optional chaining, may be undefined before hydration
has?.({ feature: 'export' })
```

### Combining with role checks

```typescript
const { has, orgRole } = await auth()

const canManageBilling = has({ plan: 'pro' }) && orgRole === 'org:admin'
```

### What `has()` checks

`has()` checks the **active session claims**. Plans and features are embedded in the Clerk session token after a subscription is active. The check does NOT make a network request.

If a user subscribes and then `has()` returns false, the session token needs to refresh. This happens automatically on the next page load or after calling `clerk.session.reload()` on the client.

## Show Component (Billing-aware)

```tsx
import { Show } from '@clerk/nextjs'

<Show when={{ plan: 'pro' }}>
	<ProFeatures />
</Show>

<Show when={{ feature: 'analytics' }}>
	<AnalyticsDashboard />
</Show>
```

`<Show>` accepts `plan` and `feature` props in addition to `role` and `permission`. Renders children only if the condition is met.

## Import Reference

```typescript
// Stable
import { PricingTable, Show, useAuth } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

// Experimental (Billing)
import { CheckoutButton, useSubscription } from '@clerk/nextjs/experimental'
```

Stable billing primitives (`PricingTable`, `has()` via `auth()` / `useAuth()`, `<Show>`) live in `@clerk/nextjs`. Experimental hooks and components (`useSubscription`, `CheckoutButton`, `SubscriptionDetailsButton`, `PlanDetailsButton`) live in `@clerk/nextjs/experimental`. No separate billing package needed.

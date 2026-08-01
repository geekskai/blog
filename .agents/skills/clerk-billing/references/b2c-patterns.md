# B2C Billing Patterns

## Overview

B2C billing in Clerk attaches subscriptions to **individual users**. Each user gets their own Clerk subscription. Use `has({ plan })` on the user session.

> **Prerequisite: personal accounts must be allowed.** If Organizations are enabled, open [Dashboard → Organizations settings](https://dashboard.clerk.com/last-active?path=organizations-settings) and set **Membership options → "Membership optional"**. In "Membership required" mode personal accounts are disabled, `<PricingTable />` silently excludes any user without an active org (no error, no console warning). Check this first when a user reports "subscribe does nothing."

Plans for B2C must be created as **User Plans** (Dashboard → Billing → Plans → User Plans tab, or `clerk config patch` with `billing.plans`). A `pro` plan registered as an Organization Plan is a separate entity and won't appear in `<PricingTable />`. Plan type isn't changeable, recreate if misplaced.

## Core Pattern: User Plan Check

```typescript
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function ProDashboard() {
	const { userId, has } = await auth()

	if (!userId) {
		redirect('/sign-in')
	}

	if (!has({ plan: 'pro' })) {
		redirect('/pricing')
	}

	return <ProContent />
}
```

## Tiered Feature Gating

Prefer `has({ feature })` over `has({ plan })` for capability gating: features can be reattached between plans without a code deploy.

```typescript
import { auth } from '@clerk/nextjs/server'

export default async function AppPage() {
	const { has } = await auth()

	const canAnalytics = has({ feature: 'analytics' })
	const canExport = has({ feature: 'export' })
	const canApi = has({ feature: 'api_access' })

	return (
		<div>
			<BasicFeature />
			{canAnalytics && <AnalyticsDashboard />}
			{canExport && <ExportButton />}
			{canApi && <APIAccess />}
		</div>
	)
}
```

## Redirect Pattern After Checkout

After checkout completes in Clerk's drawer, Clerk refreshes the session with updated plan data. Pass `newSubscriptionRedirectUrl` to `<PricingTable />` to navigate after the user confirms. For custom post-checkout logic:

```typescript
// app/billing/success/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function BillingSuccessPage() {
	const { has } = await auth()

	if (!has({ plan: 'pro' })) {
		return <p>Waiting for subscription to activate...</p>
	}

	redirect('/dashboard')
}
```

## Account Billing Page

Use `<UserProfile />` for the user account billing UI. It renders the current plan, subscription status, payment methods, invoices, and the upgrade / cancellation flow with no custom code:

```tsx
import { UserProfile } from '@clerk/nextjs'

export default function AccountPage() {
	return <UserProfile />
}
```

User Plans configured in Dashboard → Billing → Plans automatically appear inside `<UserProfile />` (in the **Plans** section). Cancellation and plan switching are handled in the same drawer. Only build a custom billing page when you need branded layouts or to embed `<PricingTable />` outside the UserProfile shell.

For richer subscription details in client components (status, renewal date, trial end), use the `useSubscription()` hook instead of reading JWT claims:

```tsx
'use client'
import { useSubscription } from '@clerk/nextjs/experimental'

export function BillingSummary() {
	const { data, isLoading } = useSubscription()
	if (isLoading || !data) return null
	return (
		<p>
			Status: {data.status}
			{data.nextPayment && ` (renews ${data.nextPayment.date.toLocaleDateString()})`}
		</p>
	)
}
```

## Client-Side Feature Gating

For interactive components that need plan checks:

```tsx
'use client'
import { useAuth } from '@clerk/nextjs'

export function ExportButton() {
	const { has } = useAuth()

	if (!has?.({ plan: 'pro' })) {
		return (
			<button disabled title="Pro plan required">
				Export (Pro)
			</button>
		)
	}

	return <button onClick={handleExport}>Export</button>
}
```

Note: `has` may be `undefined` on initial render. Use optional chaining `has?.()`.


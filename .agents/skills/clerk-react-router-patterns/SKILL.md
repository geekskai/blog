---
name: clerk-react-router-patterns
description: 'React Router v7/v8 patterns with Clerk — rootAuthLoader, getAuth in loaders,
  clerkMiddleware, protected routes, SSR user data, org switching. Triggers on: react-router
  auth, rootAuthLoader, getAuth loader, react-router protected route, loader authentication,
  SSR auth react-router, useNavigate may be used only in the context of a Router.'
license: MIT
allowed-tools: WebFetch
metadata:
  author: clerk
  version: 1.1.0
---

# React Router Patterns

SDK: `@clerk/react-router` v3.5+. Supports React Router v7.9+ and v8.

## What Do You Need?

| Task | Reference |
|------|-----------|
| Auth in loaders and actions | references/loaders-actions.md |
| Protected routes and redirects | references/protected-routes.md |
| SSR user data and session | references/ssr-auth.md |

## React Router v7 vs v8

Check the installed `react-router` major version before scaffolding — the config differs:

| | v7.9+ | v8+ |
|--|--|--|
| Middleware API | Opt-in: set `future: { v8_middleware: true }` in `react-router.config.ts` | Always on — do NOT set the flag (v8 removed it) |
| `ssr.noExternal` workaround (below) | Not needed | **Required** |

## Minimal Setup

### 1. vite.config.ts (v8 only — REQUIRED)

React Router v8 ships development/production conditional exports. In `react-router dev`,
Vite externalizes `@clerk/react-router` for SSR, so Node resolves the production build of
react-router while the app code gets the development build — two module instances, two
Router contexts. Every request then fails during SSR with:

```
Error: useNavigate() may be used only in the context of a <Router> component.
```

**`npm ls react-router` shows a single copy — that does NOT rule this out.** The
duplication is per export condition, not per installed copy. Do not chase duplicate
installs; add the workaround (upstream issue:
https://github.com/remix-run/react-router/issues/15232):

```ts
import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [reactRouter()],
  ssr: {
    noExternal: ['@clerk/react-router'],
  },
})
```

### 2. root.tsx

```tsx
import { Outlet } from 'react-router'
import { rootAuthLoader, clerkMiddleware } from '@clerk/react-router/server'
import { ClerkProvider } from '@clerk/react-router'
import type { Route } from './+types/root'

export const middleware: Route.MiddlewareFunction[] = [clerkMiddleware()]

export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args)
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ClerkProvider loaderData={loaderData}>
      <Outlet />
    </ClerkProvider>
  )
}
```

There is no `ClerkApp` HOC in `@clerk/react-router` (that was the `@clerk/remix` API).
Render `<ClerkProvider loaderData={loaderData}>` inside the default export and pass it
the root route's `loaderData`.

### 3. react-router.config.ts (v7 only)

```ts
import type { Config } from '@react-router/dev/config'

export default {
  future: {
    v8_middleware: true,
  },
} satisfies Config
```

On v8, omit the `future` block entirely — the flag no longer exists.

> **Required**: `rootAuthLoader` must be called in `root.tsx`'s loader. Without it, `getAuth` throws in nested loaders.

## Mental Model

React Router v7/v8 uses a middleware + loader pipeline. Clerk plugs into both layers:

- **Middleware** (`clerkMiddleware()`) — runs on every request, attaches auth to context
- **`rootAuthLoader`** — required in `root.tsx` to pass Clerk state to the client
- **`getAuth(args)`** — called inside any loader/action to get the current user

```
Request → clerkMiddleware() → rootAuthLoader → page loader → component
                 ↓                   ↓               ↓
           attaches auth      injects state     getAuth(args)
           to context         to response       reads context
```

## Auth in Loaders

```tsx
import { getAuth } from '@clerk/react-router/server'
import type { Route } from './+types/dashboard'

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args)
  if (!userId) throw redirect('/sign-in')

  const data = await fetchUserData(userId)
  return { data }
}
```

## Auth in Actions

```tsx
import { getAuth } from '@clerk/react-router/server'

export async function action(args: Route.ActionArgs) {
  const { userId, orgId } = await getAuth(args)
  if (!userId) throw new Response('Unauthorized', { status: 401 })

  const formData = await args.request.formData()
  await saveData(userId, orgId, formData)
  return redirect('/dashboard')
}
```

## Client Components

```tsx
import { useAuth, useUser } from '@clerk/react-router'

export function Profile() {
  const { userId, isSignedIn } = useAuth()
  const { user } = useUser()
  if (!isSignedIn) return null
  return <p>{user?.firstName}</p>
}
```

## Org Switching

```tsx
import { OrganizationSwitcher } from '@clerk/react-router'

export function Nav() {
  return <OrganizationSwitcher afterSelectOrganizationUrl="/dashboard" />
}
```

```tsx
export async function loader(args: Route.LoaderArgs) {
  const { userId, orgId } = await getAuth(args)
  if (!userId) throw redirect('/sign-in')
  if (!orgId) throw redirect('/select-org')

  return { data: await fetchOrgData(orgId) }
}
```

## Common Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `useNavigate() may be used only in the context of a <Router>` thrown from ClerkProvider during SSR in dev (v8) | Vite dev SSR externalizes `@clerk/react-router`, which then loads react-router's production build while the app uses the development build — two Router contexts. A single copy in `npm ls` does not rule this out. | Add `ssr: { noExternal: ['@clerk/react-router'] }` to `vite.config.ts`. Do NOT downgrade to v7 |
| Build error: `ClerkApp` is not exported | `ClerkApp` does not exist in `@clerk/react-router` | Use `<ClerkProvider loaderData={loaderData}>` in root.tsx's default export |
| `clerkMiddleware() not detected` | Missing middleware (or on v7, missing `v8_middleware` future flag) | Export `middleware = [clerkMiddleware()]` from root route; on v7 also set `future: { v8_middleware: true }` |
| Unknown future flag error/warning (v8) | `v8_middleware` flag left in `react-router.config.ts` after upgrading | Remove the `future.v8_middleware` entry — middleware is always on in v8 |
| `getAuth` returns empty userId | `rootAuthLoader` not called | Call `rootAuthLoader(args)` in `root.tsx` loader |
| Infinite redirect loop | Redirect target is also protected | Exclude `/sign-in` from protection check |
| `redirect` not working in action | Using `Response` instead of `throw redirect()` | Use `throw redirect('/path')` from `react-router` |

## Import Map

| What | Import From |
|------|-------------|
| `getAuth` | `@clerk/react-router/server` |
| `rootAuthLoader` | `@clerk/react-router/server` |
| `clerkMiddleware` | `@clerk/react-router/server` |
| `ClerkProvider` | `@clerk/react-router` |
| `useAuth`, `useUser` | `@clerk/react-router` |
| `OrganizationSwitcher` | `@clerk/react-router` |

## See Also

- `clerk-setup` - Initial Clerk install
- `clerk-custom-ui` - Custom flows & appearance
- `clerk-orgs` - B2B organizations

## Docs

[React Router SDK](https://clerk.com/docs/react-router/getting-started/quickstart)

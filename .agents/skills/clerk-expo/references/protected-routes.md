# Protected routes (Expo Router)

Gate screens on auth state with layout-level guards. Applies to both prebuilt and custom flows.

> Canonical doc: https://clerk.com/docs/expo/guides/users/reading (protect content and read user data)

## Recommended structure

```
src/app/
├── _layout.tsx           # Root layout with ClerkProvider (see setup.md)
├── (auth)/               # Public: sign-in / sign-up
│   ├── _layout.tsx       # Redirects signed-in users away
│   ├── sign-in.tsx
│   └── sign-up.tsx
└── (home)/               # Protected: app content
    ├── _layout.tsx       # Redirects signed-out users to sign-in
    └── index.tsx
```

Apps using `AuthView` in a modal (prebuilt path) often don't need an `(auth)` group at all — the modal lives beside the protected content (see prebuilt-components.md).

## Layout guards

```tsx
// src/app/(home)/_layout.tsx — protect the group
import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />

  return <Stack />
}
```

```tsx
// src/app/(auth)/_layout.tsx — keep signed-in users out of auth screens
export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null
  if (isSignedIn) return <Redirect href="/" />

  return <Stack />
}
```

Rules:
- **Always check `isLoaded` before `isSignedIn`** — Clerk needs a moment to restore the session from the token cache; skipping this flashes the sign-in screen at every cold start.
- Return `null` (or a splash/spinner) while loading.
- Use `<Redirect>` from expo-router, not `router.push` inside effects — avoids render-phase navigation warnings.
- Single screens can use the same `isLoaded`/`isSignedIn` + `<Redirect>` pattern inline.

## Conditional rendering without navigation

For showing/hiding content in place, use the `<Show>` control component:

```tsx
import { Show } from '@clerk/expo'

<Show when="signed-in">
  <Text>Hello {user?.firstName}</Text>
</Show>
<Show when="signed-out">
  <Link href="/(auth)/sign-in"><Text>Sign in</Text></Link>
</Show>
```

`ClerkLoaded` / `ClerkLoading` are also exported for load-state gating.

## Pitfall

Guards are client-side UX, not security. Anything sensitive must be enforced server-side — verify the Clerk session token on your backend (see recipes.md → "Calling your backend").

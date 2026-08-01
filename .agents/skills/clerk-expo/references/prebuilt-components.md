# Prebuilt native components (@clerk/expo/native)

The default "add auth" path. `AuthView`, `UserButton`, and `UserProfileView` render Clerk's native UI — SwiftUI on iOS, Jetpack Compose on Android — and handle every enabled auth strategy (password, OTP, social, MFA) with no flow code.

> Canonical docs (fetch to re-verify if the installed SDK is newer than 3.6.x):
> https://clerk.com/docs/reference/expo/native-components/overview — plus `auth-view`, `user-button`, `user-profile-view`, `theming` pages alongside it

**Status and requirements — tell the developer up front:**
- Beta. Works well, but flag it before a production rollout decision.
- Requires a development build (`npx expo run:ios` / `run:android`). Not Expo Go, not web.
- Requires the `@clerk/expo` config plugin and a prebuild (see setup.md).

## Components

Import from `@clerk/expo/native`:

| Component | Renders | Props |
|-----------|---------|-------|
| `AuthView` | Sign-in/sign-up UI, inline (fills parent) | `mode?: 'signInOrUp' \| 'signIn' \| 'signUp'` (default `signInOrUp`), `isDismissible?: boolean` (default true), `onDismiss?: () => void` |
| `UserButton` | Avatar button that opens the native user profile | — |
| `UserProfileView` | Profile/account management, inline | `isDismissible?`, `onDismiss?`, `style?` |

These are the only public props. Do not invent event handlers (`onAuthEvent`, `onSignIn`, etc.) — react to auth state with `useAuth()` / `useUser()` instead. Verify props against `node_modules/@clerk/expo/dist/native/*.d.ts` for the installed version.

## Canonical screen

The components render inline; the app owns presentation. The docs pattern presents `AuthView` in a React Native `Modal`:

```tsx
// src/app/index.tsx
import { useAuth } from '@clerk/expo'
import { AuthView, UserButton } from '@clerk/expo/native'
import { useState } from 'react'
import { View, ActivityIndicator, Button, Modal } from 'react-native'

export default function MainScreen() {
  const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false })
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  if (!isLoaded) return <ActivityIndicator size="large" />

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isSignedIn ? <UserButton /> : <Button title="Sign in" onPress={() => setIsAuthOpen(true)} />}
      <Modal
        animationType="slide"
        visible={isAuthOpen}
        presentationStyle="pageSheet"
        onRequestClose={() => setIsAuthOpen(false)}
      >
        <AuthView onDismiss={() => setIsAuthOpen(false)} />
      </Modal>
    </View>
  )
}
```

Rules baked into this pattern:

1. **`useAuth({ treatPendingAsSignedOut: false })`** — required with native components so pending session tasks aren't treated as signed out mid-flow.
2. **Keep the `Modal` mounted at the same level as signed-in and signed-out content.** Rendering it only inside signed-out content unmounts it too early when auth state flips before session tasks finish.
3. **Session sync is automatic.** When `AuthView` completes, the JS SDK's `useAuth()`/`useUser()` update on their own. Never call `setActive()` and never add manual session plumbing.
4. **Keep `mode` at its default** (`signInOrUp`) unless the developer asks for separate flows.
5. **Don't add `useSignInWithGoogle()` / `useSignInWithApple()` buttons next to `AuthView`** — it renders every enabled social provider itself. Provider availability comes from the instance config; fix gaps in the Clerk Dashboard, not in code.

## Theming

The config plugin accepts a JSON theme applied to both platforms at prebuild:

```json
// app.json
{
  "expo": {
    "plugins": [["@clerk/expo", { "theme": "./clerk-theme.json" }]]
  }
}
```

```json
// clerk-theme.json — every key optional; unknown keys warn
{
  "colors": { "primary": "#6C47FF", "background": "#FFFFFF" },
  "darkColors": { "primary": "#8B6FFF", "background": "#0B0B0F" },
  "design": { "borderRadius": 12, "fontFamily": "Inter" }
}
```

Colors are 6- or 8-digit hex (validated at prebuild — invalid values fail the build with a descriptive error). Available color keys: `primary`, `background`, `input`, `danger`, `success`, `warning`, `foreground`, `mutedForeground`, `primaryForeground`, `inputForeground`, `neutral`, `border`, `ring`, `muted`, `shadow`. Rerun `npx expo prebuild --clean` (or `expo run:*`) after theme changes.

For customization beyond the theme schema, the answer is custom flows, not fighting the native UI.

## Verification checklist

- Dev build runs on device/simulator (not Expo Go); developer told about beta status.
- Provider + token cache per setup.md; config plugin registered; prebuild done.
- `treatPendingAsSignedOut: false` passed to the `useAuth()` call gating the auth UI.
- Auth modal mounted outside the signed-in/signed-out branch.
- No `setActive()`, no `onAuthEvent`, no native Google/Apple hooks alongside `AuthView`.
- One real sign-in completed; `useUser()` reflects the user; session survives app restart.

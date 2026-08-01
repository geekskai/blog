# Setup: install, provider, token cache, builds

Shared prerequisites for every path (prebuilt or custom). Complete this file top to bottom before implementing a flow.

> Canonical doc (fetch to re-verify if the installed SDK is newer than 3.6.x): https://clerk.com/docs/getting-started/quickstart (Expo SDK tab)

## Supported versions

Written against `@clerk/expo` v3.6.x (July 2026). Peer requirements: Expo SDK 53–56, React Native ≥ 0.75, React 18 or 19. If the project's Expo SDK or RN version is below the floor, upgrading the app comes before adding Clerk.

## 1. Install

```bash
npx expo install @clerk/expo expo-secure-store
# add expo-dev-client if the app will use native components or native sign-in hooks
npx expo install expo-dev-client
```

`npx expo install` (not `npm install`) ensures Expo-SDK-compatible versions. Additional peer deps are per-strategy — install only what the selected flow needs:

| Feature | Install |
|---------|---------|
| Browser SSO/OAuth (`useSSO`) | `npx expo install expo-auth-session expo-web-browser` |
| Native Google sign-in | `npx expo install expo-crypto` |
| Native Apple sign-in | `npx expo install expo-apple-authentication` |
| Biometrics (`useLocalCredentials`) | `npx expo install expo-local-authentication` |
| Passkeys | `npx expo install @clerk/expo-passkeys` |

Alternative bootstrap: `npx clerk@latest init --framework expo` installs `@clerk/expo` and writes the publishable key to the env file (it does not scaffold screens).

## 2. Publishable key

`.env` at the project root:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Rules:
- The prefix must be `EXPO_PUBLIC_` — Metro only inlines env vars with this prefix into the client bundle.
- Read the variable in app code and pass it explicitly to `ClerkProvider`. Env reads inside `node_modules` are not inlined in production builds.
- If no key is available, ask the developer (Clerk Dashboard → API keys) and wait.

## 3. Dashboard prerequisites

- **Native API enabled**: Clerk Dashboard → **Native applications** (`https://dashboard.clerk.com/~/native-applications`). Required for native apps to talk to Clerk.
- The auth strategies the app will use (email, phone/SMS, social providers) are enabled under **User & authentication**.

## 4. Config plugin

Verify `app.json` / `app.config.js` includes both plugins (`npx expo install` usually adds them):

```json
{
  "expo": {
    "plugins": ["expo-secure-store", "@clerk/expo"]
  }
}
```

The `@clerk/expo` plugin registers the native modules (iOS min deployment target 17.0), wires Google sign-in when configured, and optionally accepts a `theme` option for native components (see prebuilt-components.md). Plugin changes require a fresh prebuild: `npx expo prebuild --clean` or rerunning `expo run:*`.

Apps using browser SSO also need a deep-link scheme in `app.json`: `"scheme": "yourapp"`.

## 5. ClerkProvider + token cache

Root layout (Expo Router):

```tsx
// src/app/_layout.tsx
import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { Slot } from 'expo-router'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  )
}
```

- `tokenCache` persists the session in the device keychain via `expo-secure-store` (`AFTER_FIRST_UNLOCK`), so sessions survive app restarts. Without it, tokens live in memory only.
- On web, `tokenCache` is `undefined` and Clerk falls back to its web storage — no platform branching needed.
- Only implement a custom `TokenCache` if the developer has a stated requirement (e.g. different keychain accessibility). Never AsyncStorage — it is unencrypted.
- `ClerkProvider` calls `WebBrowser.maybeCompleteAuthSession()` internally; never add it manually.
- Do not add provider props that match defaults.

## 6. Expo Go vs development build vs web

| Capability | Expo Go | Dev build | Web |
|------------|---------|-----------|-----|
| Custom flows (`useSignIn`, `useSignUp`, hooks) | Yes | Yes | Yes |
| Browser SSO (`useSSO`) | Yes | Yes | Yes |
| Native components (`@clerk/expo/native`) | No | Yes | No |
| Native Google/Apple hooks | No | Yes | No |
| Biometrics, passkeys | No | Yes | No |
| Web UI components (`@clerk/expo/web`) | — | — | Yes |

Dev build commands: `npx expo run:ios` / `npx expo run:android` (or EAS Build). State this requirement before implementing anything in the "No under Expo Go" rows.

For Expo web targets, `@clerk/expo/web` exports the standard Clerk web components (`SignIn`, `SignUp`, `UserButton`, `UserProfile`, `OrganizationSwitcher`, `PricingTable`, …); they throw if rendered on native, so gate on `Platform.OS === 'web'`.

## 7. Verify setup before building flows

- App boots with the provider mounted and no key errors.
- `useAuth()` returns `isLoaded: true` shortly after launch.
- After the first real sign-in later: kill and relaunch the app — the session must persist.

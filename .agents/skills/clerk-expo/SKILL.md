---
name: clerk-expo
description: Add Clerk authentication to Expo and React Native apps using @clerk/expo.
  Use for Expo setup, prebuilt native components (AuthView, UserButton), custom sign-in/sign-up
  flows (email, password, SMS/phone OTP, MFA), OAuth/SSO, native Google/Apple sign-in,
  Expo Router protected routes, biometrics, and push notifications. Do not use for
  native Swift/iOS, native Android/Kotlin, or web-only framework projects.
license: MIT
allowed-tools: WebFetch
metadata:
  author: clerk
  version: 2.0.0
compatibility: Requires @clerk/expo v3.4+ (written against v3.6.x, July 2026). Expo SDK 53-56, React Native 0.75+.
---

# Clerk Expo (React Native)

Implement Clerk in Expo / React Native projects. This skill inlines verified patterns for the stable surface (provider, token cache, flows) and requires source inspection of the installed `@clerk/expo` package for anything volatile (component props, hook signatures).

## Activation Rules

Activate when either is true:
- The user asks for auth in an Expo or React Native app, or mentions `@clerk/expo`, `ClerkProvider`, Expo Router auth, or Clerk hooks in a native app.
- The project is Expo/React Native (`app.json` / `app.config.js`, `expo` in `package.json`, `metro.config.js`, `@clerk/expo` dependency).

Route away when:
- Native iOS/Swift project (`.xcodeproj`, `Package.swift`) → `clerk-swift`
- Native Android/Kotlin project (`build.gradle` without React Native) → `clerk-android`
- Web-only framework (Next.js, Remix, plain React, etc.) → the matching framework skill

## Intent Map

Match what the user asked for, then load the reference(s) listed. Load only what the task needs.

| User intent (examples) | Path | Reference |
|------------------------|------|-----------|
| "Add auth to my app" / "add sign-in with Clerk" | Prebuilt native components (default) | references/setup.md + references/prebuilt-components.md |
| "Add auth" but Expo Go / web / custom UI required | Custom flows | references/setup.md + references/custom-flows.md |
| "Add phone / SMS auth", "email OTP", "passwordless" | Custom flow, `phoneCode` / `emailCode` | references/custom-flows.md |
| "Sign in with Google/Apple/GitHub", "social login", "SSO" | Browser SSO or native buttons | references/sso-and-native-auth.md |
| "MFA / 2FA / TOTP", "forgot password", "email link" | Custom flow additions | references/custom-flows.md |
| "Protect routes/screens", "redirect if signed out" | Expo Router guards | references/protected-routes.md |
| "Show user profile", "org switching", "push notifications", "sign out", "call my backend" | App recipes | references/recipes.md |
| "Biometric login", "Face ID", "passkeys" | Device features | references/recipes.md |

## Default Path Decision

When the user says "add auth" without specifying UI:

1. **Default to prebuilt native components** (`AuthView` + `UserButton` from `@clerk/expo/native`). Fastest to working auth; UI is maintained by Clerk. Tell the developer they are in beta and require a development build.
2. **Fall back to custom flows** when any of these hold — say why when you switch:
   - The project must run in Expo Go (no dev build).
   - The app targets web (native components don't render on web).
   - The developer wants their own UI or a specific brand experience beyond theming.
3. If the developer has an existing auth UI, extend what's there — don't rip out custom flows to insert `AuthView` (or vice versa) without being asked.

Do not blend prebuilt components and custom flows for the same auth step (e.g. `AuthView` plus a custom password form). Blending is allowed only when the developer explicitly asks.

## Quick Workflow

1. Confirm project type (Expo/RN) and pick the path per the Intent Map / Default Path rules.
2. Follow references/setup.md: install, env key, provider, token cache, config plugin, build type.
3. Verify dashboard prerequisites (Gate 2 and Gate 3 below).
4. Implement from the selected reference only.
5. Verify by building, not just by writing:
   - Run the project's typecheck (`npx tsc --noEmit` or equivalent).
   - Build and launch: `npx expo run:ios` / `run:android` for native features, `npx expo start` for Expo Go flows. If the build fails, fix and rebuild iteratively — build errors against the installed SDK are the ground truth when this skill and the SDK disagree. After ~5 failed fix attempts, stop and ask the developer how to proceed instead of thrashing.
   - Walk the developer through one real sign-in, then confirm the session survives an app restart (token cache working).

## Execution Gates (Do Not Skip)

1. **Publishable key** — Read from `process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (`.env` file). Never `NEXT_PUBLIC_`, never hardcoded. If no key exists, ask the developer for one (or run `npx clerk@latest init --framework expo`, which installs the SDK and writes the env file) and wait before editing files.
2. **Native API dashboard toggle** — Clerk's Native API must be enabled for the instance: Clerk Dashboard → **Native applications** (`https://dashboard.clerk.com/~/native-applications`). Tell the developer to verify this during setup; it is required for any native integration.
3. **Factor availability** — Before implementing a specific strategy (SMS, email code, social provider), confirm it's enabled for the instance. Derive the Frontend API URL from the publishable key (base64-decode the middle segment) and fetch `<frontendApiUrl>/v1/environment?_is_native=true`, or ask the developer to check the dashboard (**User & authentication**). SMS in particular is instance-configuration-dependent — code written for a disabled factor fails at runtime, not build time.
4. **Current custom-flows API only** — `useSignIn()` / `useSignUp()` from `@clerk/expo` (v3.4+) return `{ signIn, errors, fetchStatus }` and use method-based flows: `signIn.password()`, `signIn.phoneCode.sendCode()`, `signIn.finalize()`. Never generate the legacy pattern: destructuring `isLoaded`/`setActive` from `useSignIn()`/`useSignUp()` (the current hooks don't return them), or `signIn.create()` chained with `prepareFirstFactor()`/`attemptFirstFactor()` + `setActive({ session })`. That pattern lives at `@clerk/expo/legacy` and is only for maintaining existing legacy code, never for new work. Scope notes: `isLoaded` from `useAuth()`/`useUser()` is current API and required in guards; `signIn.create()` itself still exists for advanced cases — prefer the factor-specific methods.
5. **`useSSO()`, never `useOAuth()`** — `useOAuth` is deprecated. Note the asymmetry: `startSSOFlow()` still returns `{ createdSessionId, setActive }` and requires `setActive({ session: createdSessionId })` — SSO does not use `finalize()`.
6. **Token cache** — `tokenCache` from `@clerk/expo/token-cache` on `ClerkProvider`. Never use `expo-secure-store` directly for session tokens, never AsyncStorage.
7. **`resourceCache`, never `secureStore`** — if offline resource caching comes up, `@clerk/expo/secure-store` is deprecated; use `resourceCache` from `@clerk/expo/resource-cache`.
8. **Build-type gating** — Native components (`@clerk/expo/native`) and native hooks (`useSignInWithGoogle`, `useSignInWithApple`, `useLocalCredentials`) require a development build (`npx expo run:ios` / `run:android`), not Expo Go, and don't exist on web. For web targets use `@clerk/expo/web` components or custom flows. State the build requirement before implementing a native-only feature.
9. **Combined sign-in-or-up default** — one combined flow unless the developer asks for separate sign-in and sign-up screens.
10. **Bot protection** — custom sign-up screens must render `<View nativeID="clerk-captcha" />`; Clerk's bot protection is on by default and needs this mount point.
11. **Source verification for volatile surfaces** — before using native component props or native hook options, confirm against the installed package: `node_modules/@clerk/expo/dist/native/*.d.ts` and `package.json` `exports`. The installed version wins over this skill if they disagree.
12. **Freshness gate** — this skill was verified against `@clerk/expo` 3.6.x. Check the installed version (`node_modules/@clerk/expo/package.json`). If it is a newer minor or major, treat this skill's code snippets as suspect: re-verify against the docs URL cited next to each snippet (every reference section carries one) or the installed `.d.ts` before using them. If it is older than 3.4, the method-based custom-flows API may not exist — offer an upgrade instead of writing legacy code.

## Version Notes (v3.5–v3.6, June 2026)

- Minimum React Native raised to **0.75** in v3.5.0 (iOS SDK now links via SPM podspec). Peer range: `expo >=53 <57`.
- Native components matured: iOS moved to Expo Modules; native↔JS session sync is automatic and bidirectional — never call `setActive()` after native-component auth.
- The config plugin accepts a `theme` JSON file for native component styling (see references/prebuilt-components.md).
- Native Google sign-in will move to a separate `@clerk/expo-google-signin` package in the next major (the `@clerk/expo/google` import keeps working in v3; a dev warning announces the migration). Don't preinstall the new package on v3.

## Common Pitfalls

| Level | Issue | Prevention |
|-------|-------|------------|
| CRITICAL | Generating legacy custom-flow code (`signIn.create` + `prepareFirstFactor` + `setActive`) | Use the current method-based API (Gate 4) |
| CRITICAL | Using `useOAuth()` | Use `useSSO()` (Gate 5) |
| CRITICAL | Implementing SMS/social auth without checking the factor is enabled | Check environment/dashboard first (Gate 3) |
| CRITICAL | Native components targeted at Expo Go or web | Require a dev build; offer custom flows otherwise (Gate 8) |
| CRITICAL | Sign-up screen missing `<View nativeID="clerk-captcha" />` | Always include it (Gate 10) |
| HIGH | `NEXT_PUBLIC_` env prefix, or env var read inside `node_modules` | `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, passed explicitly to `ClerkProvider` |
| HIGH | Session lost on restart | `tokenCache` from `@clerk/expo/token-cache` on the provider |
| HIGH | Calling `setActive()` after `AuthView` / `UserButton` auth | Native components sync sessions automatically |
| HIGH | Pairing `AuthView` with `useSignInWithGoogle`/`useSignInWithApple` | `AuthView` renders enabled social providers itself |
| HIGH | Calling `WebBrowser.maybeCompleteAuthSession()` manually | `ClerkProvider` handles it |
| HIGH | Splitting sign-in / sign-up without being asked | Combined flow by default (Gate 9) |
| MEDIUM | Missing `isLoaded` check before `isSignedIn` in guards | Always gate on `isLoaded` first |
| MEDIUM | Using `yalc`/`pnpm link` for local `@clerk/expo` development | Use Verdaccio or pkg.pr.new |

## See Also

- `clerk` — top-level router
- `clerk-swift` / `clerk-android` — native mobile SDKs
- `clerk-orgs`, `clerk-billing`, `clerk-webhooks` — feature skills (hooks work the same in Expo)
- Installed package source: `node_modules/@clerk/expo/`
- https://clerk.com/docs/getting-started/quickstart (Expo SDK tab)
- https://clerk.com/docs/reference/expo/overview
- https://github.com/clerk/clerk-expo-quickstart — three official example apps: JS-only (Expo Go), JS + native sign-in buttons, native components

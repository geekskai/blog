# Custom flows (@clerk/expo hooks)

Build your own auth UI with `useSignIn()` / `useSignUp()`. Works everywhere including Expo Go and web. Use when the developer wants their own UI, needs Expo Go, or asked for a specific strategy like SMS.

> Canonical docs — each has an Expo tab with a full working example; fetch the relevant one to re-verify if the installed SDK is newer than 3.6.x:
> - Email/password: https://clerk.com/docs/guides/development/custom-flows/authentication/email-password
> - Email/SMS OTP: https://clerk.com/docs/guides/development/custom-flows/authentication/email-sms-otp
> - Combined sign-in-or-up: https://clerk.com/docs/guides/development/custom-flows/authentication/sign-in-or-up
> - MFA: https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
> - Forgot password: https://clerk.com/docs/guides/development/custom-flows/authentication/forgot-password
> - Email links: https://clerk.com/docs/guides/development/custom-flows/authentication/email-links
> - Error handling: https://clerk.com/docs/guides/development/custom-flows/error-handling

## The current API (v3.4+) — not the legacy one

`useSignIn()` and `useSignUp()` return `{ signIn, errors, fetchStatus }` / `{ signUp, errors, fetchStatus }`:

- **Method-based flows**: `signIn.password({...})`, `signIn.phoneCode.sendCode({...})`, `signUp.verifications.verifyEmailCode({...})`. Every method resolves to `{ error: ClerkError | null }` — check `error`, don't rely on try/catch for API errors.
- **`errors`** — reactive error state; field-level errors at `errors.fields.<name>` (e.g. `errors.fields.identifier`, `errors.fields.code`).
- **`fetchStatus`** — `'idle' | 'fetching'`; use it to disable submit buttons.
- **`signIn.status`** — `'needs_identifier' | 'needs_first_factor' | 'needs_second_factor' | 'needs_client_trust' | 'needs_new_password' | 'complete'`.
- **`signUp.status`** — `'missing_requirements' | 'complete'`, with `signUp.unverifiedFields` / `signUp.missingFields` saying what's left.
- **`finalize({ navigate })`** — converts a `complete` sign-in/up into the active session. Replaces `setActive({ session })`.
- **`reset()`** — clears the attempt so the user can start over (local-only, no API call).

Never generate the legacy shape for new code: `isLoaded`/`setActive` destructured from `useSignIn()`/`useSignUp()` (the current hooks don't return them — `isLoaded` from `useAuth()`/`useUser()` is fine), or `signIn.create()` chained with `prepareFirstFactor()`/`attemptFirstFactor()` + `setActive({ session: createdSessionId })`. That API lives at `@clerk/expo/legacy` and is only for maintaining code that already uses it. (`signIn.create()` still exists on the new resource but is for advanced cases — prefer the factor-specific methods.)

If the installed `@clerk/expo` is older than 3.4 and hooks don't have this shape, tell the developer and offer to upgrade rather than writing legacy code.

## Before writing flow code

1. **Check enabled factors** (SKILL.md Gate 3). Derive the Frontend API URL from the publishable key and fetch `<frontendApiUrl>/v1/environment?_is_native=true`, or have the developer confirm in the dashboard. Only implement enabled strategies; if the user asked for a disabled one (common with SMS), tell them to enable it in Clerk Dashboard → **User & authentication** first.
2. **Combined flow by default** — one screen that signs in or signs up, unless separation is requested.
3. **Captcha mount point** — every screen that can create a sign-up must render `<View nativeID="clerk-captcha" />`.

## Shared finalize helper

All flows end the same way. Session tasks (e.g. forced MFA enrollment, org selection) must be handled before navigating:

```tsx
const navigateAfterAuth = ({ session, decorateUrl }) => {
  if (session?.currentTask) {
    // Route to your session-task UI instead of home.
    // https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
    return
  }
  const url = decorateUrl('/')
  if (url.startsWith('http')) window.location.href = url // Expo web
  else router.push(url as Href)
}

// on status === 'complete':
await signIn.finalize({ navigate: navigateAfterAuth }) // same shape for signUp.finalize
```

## Email + password (sign-in)

```tsx
import { useSignIn } from '@clerk/expo'

const { signIn, errors, fetchStatus } = useSignIn()

const handleSubmit = async () => {
  const { error } = await signIn.password({ emailAddress, password })
  if (error) return // surface errors.fields.identifier / errors.fields.password in the UI

  if (signIn.status === 'complete') {
    await signIn.finalize({ navigate: navigateAfterAuth })
  } else if (signIn.status === 'needs_second_factor') {
    // MFA step — see below
  } else if (signIn.status === 'needs_client_trust') {
    // New-device verification: send a code, then verify with signIn.mfa.verifyEmailCode
    const emailFactor = signIn.supportedSecondFactors?.find((f) => f.strategy === 'email_code')
    if (emailFactor) await signIn.mfa.sendEmailCode()
  }
}
```

Sign-up mirror: `signUp.password({ emailAddress, password })`, then `signUp.verifications.sendEmailCode()`, collect the code, `signUp.verifications.verifyEmailCode({ code })`, then `signUp.finalize(...)`. Show the verify step when `signUp.status === 'missing_requirements' && signUp.unverifiedFields.includes('email_address')`.

## Phone / SMS OTP

Requires **Phone number** + **SMS verification code** enabled in the dashboard (SMS is billable and instance-dependent — check first, Gate 3).

Sign-up:

```tsx
const { signUp, errors, fetchStatus } = useSignUp()

const handleSubmit = async () => {
  const { error } = await signUp.create({ phoneNumber }) // E.164, e.g. +15551234567
  if (!error) await signUp.verifications.sendPhoneCode()
}

const handleVerify = async () => {
  await signUp.verifications.verifyPhoneCode({ code })
  if (signUp.status === 'complete') await signUp.finalize({ navigate: navigateAfterAuth })
}

// Show the code input when:
// signUp.status === 'missing_requirements' && signUp.unverifiedFields.includes('phone_number') && signUp.missingFields.length === 0
// Resend: signUp.verifications.sendPhoneCode()
```

Sign-in:

```tsx
const { signIn, errors, fetchStatus } = useSignIn()

const handleSubmit = async () => {
  // Creates the sign-in attempt AND sends the SMS in one call — no signIn.create() needed
  const { error } = await signIn.phoneCode.sendCode({ phoneNumber })
  if (error) return // surface errors.fields
}

const handleVerify = async () => {
  await signIn.phoneCode.verifyCode({ code })
  if (signIn.status === 'complete') await signIn.finalize({ navigate: navigateAfterAuth })
}

// Resend: signIn.phoneCode.sendCode() with no args — the sign-in already exists
```

Email OTP is the same shape: `emailCode.sendCode({ emailAddress })` (also self-creating) / `emailCode.verifyCode({ code })` on sign-in, `sendEmailCode()` / `verifyEmailCode()` on sign-up verifications.

## Combined sign-in-or-up

Attempt sign-in; on `form_identifier_not_found`, switch to sign-up with the same credentials:

```tsx
const { error } = await signIn.password({ emailAddress, password })
if (error) {
  if (error.errors[0].code === 'form_identifier_not_found') {
    const { error: signUpError } = await signUp.password({ emailAddress, password })
    if (signUpError) return
    await signUp.verifications.sendEmailCode()
    if (signUp.unverifiedFields?.includes('email_address')) setShowCodeStep(true)
    return
  }
  return // real error — surface errors.fields
}
// continue sign-in path (complete / needs_second_factor / needs_client_trust)
```

For the OTP-only variant, do the same with `signIn.phoneCode` / `signUp.create({ phoneNumber })`.

## MFA / 2FA (second factor)

When `signIn.status === 'needs_second_factor'`, check `signIn.supportedSecondFactors` and use `signIn.mfa`:

| Factor | Send | Verify |
|--------|------|--------|
| SMS code | `signIn.mfa.sendPhoneCode()` | `signIn.mfa.verifyPhoneCode({ code })` |
| Email code | `signIn.mfa.sendEmailCode()` | `signIn.mfa.verifyEmailCode({ code })` |
| TOTP (authenticator app) | — | `signIn.mfa.verifyTOTP({ code })` |
| Backup code | — | `signIn.mfa.verifyBackupCode({ code })` |

After a successful verify, `signIn.status` becomes `complete` → `finalize()`. The same `mfa` methods serve `needs_client_trust` (new-device verification).

## Other flows

- **Forgot password**: `signIn.resetPasswordEmailCode.sendCode()` → `verifyCode({ code })` (status becomes `needs_new_password`) → `submitPassword({ password })`. Phone variant: `signIn.resetPasswordPhoneCode.*`.
- **Email link**: `signIn.emailLink.sendLink({ ... })` + `signIn.emailLink.waitForVerification()`.
- **Passkeys**: `signIn.passkey()`; requires `@clerk/expo-passkeys` and dev build.
- **Social/SSO**: see sso-and-native-auth.md — SSO does not use this method API.

## Verification checklist

- No legacy API in generated code (no `prepareFirstFactor`, no `setActive({ session })` outside SSO).
- Every implemented strategy confirmed enabled for the instance.
- Errors surfaced from `errors.fields.*`; buttons disabled while `fetchStatus === 'fetching'`.
- `finalize({ navigate })` handles `session.currentTask` before navigating.
- Sign-up screens include `<View nativeID="clerk-captcha" />`.
- Verify step gated on `status` / `unverifiedFields`, with a resend button and a `reset()` escape hatch.
- One real end-to-end auth exercised; session survives restart.

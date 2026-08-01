# Clerk CLI - Authentication & Targeting Reference

Everything you need to know about how the CLI authenticates, resolves keys, and targets the right application/instance.

## Two APIs, two auth paths

Clerk exposes two HTTP APIs. The CLI speaks both.

| API                      | Base URL                    | Auth                                                                   | Used for                                                                                           | CLI flag     |
| ------------------------ | --------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------ |
| **Backend API (BAPI)**   | `https://api.clerk.dev/v1/` | Instance **secret key** (`sk_...`)                                     | Tenant data: users, orgs, sessions, invitations, JWT templates, webhooks.                          | (default)    |
| **Platform API (PLAPI)** | `https://api.clerk.com/v1/` | **Platform API key** (`ak_...`) or OAuth token from `clerk auth login` | Account-level: listing your applications, fetching app/instance metadata, pulling config, billing. | `--platform` |

You override the base URLs via `CLERK_BACKEND_API_URL` and `CLERK_PLATFORM_API_URL` when testing against non-production Clerk environments.

### Backend API secret key resolution order

When you run `clerk api /users` (no `--platform`), the CLI picks the `sk_` key in this order:

1. `--secret-key <key>` flag (explicit override)
2. `CLERK_SECRET_KEY` environment variable
3. Auto-resolved from `--app <id>` (uses `CLERK_PLATFORM_API_KEY` or stored OAuth token to fetch the app's secret key)
4. Auto-resolved from the linked project profile (same mechanism as #3, but the app ID comes from the repo's link)

The CLI validates prefixes: passing `ak_...` where `sk_...` is expected (or vice versa) throws an error immediately with guidance on which key type to use.

### Platform API auth resolution order

When you run `clerk api --platform ...`, or any command that already uses PLAPI (`apps list`, `config pull`, `link`, etc.), the CLI picks the bearer token in this order:

1. `CLERK_PLATFORM_API_KEY` environment variable
2. Stored OAuth token from `clerk auth login`
3. If neither is present, the CLI errors: "Not authenticated. Run `clerk auth login` or set `CLERK_PLATFORM_API_KEY`."

Set `CLERK_PLATFORM_API_KEY` for CI and scripted agent usage. Use `clerk auth login` for local interactive development.

## Host vs sandbox behavior

These auth and targeting rules only produce trustworthy results when the CLI
can actually reach the user's host state.

In agent mode, the CLI now emits a best-effort warning once per invocation
when it detects that host-only Clerk state or system capabilities are
unavailable:

```text
Host-only Clerk state or system capabilities may be unavailable in agent mode. This may be a sandboxed run.
Re-run this command on the host shell before trusting auth, link, env, or API failures.
```

That warning usually means one of the following is blocked:

- Clerk home-directory config or fallback credential files
- OS keychain access
- outbound Clerk network access
- browser launch or localhost OAuth callback setup

When that warning appears, stop trusting the current invocation's auth or
targeting result. A sandboxed run can misreport:

- `Not logged in` / `auth_required`
- `Not authenticated. Run clerk auth login or set CLERK_PLATFORM_API_KEY`
- `No Clerk project linked`
- missing env or missing linked profile state

Rerun the same command on the host before acting on it.

> **`config` commands do not accept `--secret-key`.** They target the Platform API and authenticate via the PLAPI chain above (`CLERK_PLATFORM_API_KEY` or the stored OAuth token). If you need to script `config pull/schema/patch/put` in CI, export `CLERK_PLATFORM_API_KEY`; a Backend API `sk_...` key will not work.

## Project linking

`clerk link` stores a mapping from your repo to a Clerk application in the CLI config file (run `clerk doctor --verbose` to see the resolved path; override with `CLERK_CONFIG_DIR`). The key is the normalized git remote URL (e.g., `github.com/org/repo`), which means the link is shared across all clones and worktrees of the same repo automatically.

When you run a command without `--app`/`--instance`:

1. The CLI resolves the current repo's profile (normalized git remote → git common dir → current working directory).
2. If linked, it uses the stored app ID and instance IDs.
3. If not linked, it errors with guidance to run `clerk link`.

## `--app` and `--instance` targeting

Most commands accept `--app <id>` and `--instance <target>` to override the linked profile:

- `--app <id>` - Clerk application ID (starts with `app_`). Works from any directory; no link required.
- `--instance <target>` - One of:
  - `dev` (development instance, the default)
  - `prod` (production instance)
  - a full instance ID (starts with `ins_`)

Examples:

```sh
# Operate on a specific app without linking the repo
clerk api /users --app app_abc123

# Pull production env keys (dangerous - only when you know what you're doing)
clerk env pull --app app_abc123 --instance prod

# Target a specific instance directly
clerk config pull --instance ins_2aB3c...
```

## Auth commands

### `clerk auth login`

Aliases: `signup`, `signin`, `sign-in`. Top-level shortcut: `clerk login`.

OAuth 2.0 PKCE flow against the Clerk OAuth system instance (`https://clerk.clerk.com` by default, overridable via `CLERK_OAUTH_BASE_URL`):

1. Generates PKCE parameters.
2. Starts a local callback server on `127.0.0.1`.
3. Opens the browser to `/oauth/authorize`.
4. Exchanges the code at `/oauth/token` for an access token.
5. Fetches user info from `/oauth/userinfo`.
6. Stores the token in the OS credential store.

In agent mode, if already authenticated, it's a no-op. If not, it runs the full flow above anyway: it opens a
browser and binds a localhost callback, so it is **not** unattended and will stall in a sandbox that cannot
reach a browser. There is no agent-mode branch that prints guidance instead. For headless flows, set
`CLERK_PLATFORM_API_KEY` rather than calling `clerk auth login`.

In a sandbox, even the "already authenticated" check can be false if the
keychain or fallback credential file is blocked, so rerun on the host before
trusting a sandboxed auth failure.

### `clerk auth logout`

Aliases: `signout`, `sign-out`. Top-level shortcut: `clerk logout`.

Clears the stored token. No API calls.

### `clerk whoami`

Hits `GET /oauth/userinfo` with the stored token and prints the email. Exits with a message if not logged in.

## Environment variables the CLI honors

| Variable                 | Effect                                                          |
| ------------------------ | --------------------------------------------------------------- |
| `CLERK_MODE`             | Force `human` or `agent` mode (overrides TTY detection).        |
| `CLERK_SECRET_KEY`       | BAPI secret key (bypasses linked project / `--app` resolution). |
| `CLERK_PLATFORM_API_KEY` | PLAPI bearer key.                                               |
| `CLERK_BACKEND_API_URL`  | Override Backend API base URL.                                  |
| `CLERK_PLATFORM_API_URL` | Override Platform API base URL.                                 |
| `CLERK_OAUTH_BASE_URL`   | Override OAuth base URL (advanced / internal).                  |
| `CLERK_CONFIG_DIR`       | Override config, cache, and credential directory (advanced).    |

## Common auth failure modes

| Symptom                             | Likely cause                                                  | Fix                                                          |
| ----------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| `Not authenticated`                 | No token stored, no `CLERK_PLATFORM_API_KEY`                  | `clerk auth login` or export `CLERK_PLATFORM_API_KEY`        |
| `No Clerk project linked`           | Running a command that needs a linked profile with no `--app` | `clerk link` or pass `--app <id>`                            |
| `Invalid secret key prefix`         | Passed `ak_...` where `sk_...` expected (or vice versa)       | Check which API the command hits; pass the matching key type |
| `Unauthorized` from API             | Key belongs to a different instance                           | Verify `--instance` and ensure the key matches               |
| Sandbox warning + auth/link failure | Host-only Clerk state or system capabilities are blocked      | Rerun the same command on the host before trusting the error |

When in doubt: `clerk doctor --json` walks through all of this and tells you exactly what's wrong.

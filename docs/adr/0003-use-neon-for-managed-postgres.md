# Use Neon for managed Postgres

Geekskai will use Neon as its managed Postgres service because its serverless connection model and Vercel integration fit the existing Next.js deployment while retaining standard Postgres portability. Supabase was not selected because its bundled authentication, storage, and realtime capabilities overlap with Clerk and with the product boundary that keeps audio files off the server.

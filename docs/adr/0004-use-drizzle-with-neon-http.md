# Use Drizzle with the Neon HTTP driver

Geekskai will use Drizzle ORM with Neon's HTTP serverless driver for typed schemas, versioned SQL migrations, and short application transactions. This keeps the database layer lightweight for Next.js serverless requests while preserving access to parameterized SQL for atomic quota updates and webhook idempotency; an interactive connection mode can be introduced only if a future workflow genuinely requires it.

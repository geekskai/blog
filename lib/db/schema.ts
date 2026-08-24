import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}

export const dailyDownloadUsage = pgTable(
  "daily_download_usage",
  {
    clerkUserId: text("clerk_user_id").notNull(),
    quotaDay: date("quota_day").notNull(),
    successfulDownloads: integer("successful_downloads").default(0).notNull(),
    reservedDownloads: integer("reserved_downloads").default(0).notNull(),
    visitorUsageCarryover: integer("visitor_usage_carryover").default(0).notNull(),
    shareUnlocked: boolean("share_unlocked").default(false).notNull(),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.clerkUserId, table.quotaDay] })]
)

export const visitorShareUnlocks = pgTable(
  "visitor_share_unlocks",
  {
    anonymousId: uuid("anonymous_id").notNull(),
    quotaDay: date("quota_day").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.anonymousId, table.quotaDay] })]
)

export const visitorDownloadUsage = pgTable(
  "visitor_download_usage",
  {
    anonymousId: uuid("anonymous_id").notNull(),
    quotaDay: date("quota_day").notNull(),
    successfulDownloads: integer("successful_downloads").default(0).notNull(),
    reservedDownloads: integer("reserved_downloads").default(0).notNull(),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.anonymousId, table.quotaDay] })]
)

export const visitorDownloadOperations = pgTable(
  "visitor_download_operations",
  {
    id: uuid("id").primaryKey(),
    anonymousId: uuid("anonymous_id").notNull(),
    quotaDay: date("quota_day").notNull(),
    toolId: text("tool_id").notNull(),
    status: text("status", {
      enum: ["reserved", "processing", "consumed", "released"],
    }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    releasedAt: timestamp("released_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("visitor_download_operations_identity_day_status_idx").on(
      table.anonymousId,
      table.quotaDay,
      table.status
    ),
  ]
)

export const downloadOperations = pgTable(
  "download_operations",
  {
    id: uuid("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    quotaDay: date("quota_day").notNull(),
    toolId: text("tool_id").notNull(),
    status: text("status", {
      enum: ["reserved", "processing", "consumed", "released"],
    }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    releasedAt: timestamp("released_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("download_operations_user_day_status_idx").on(
      table.clerkUserId,
      table.quotaDay,
      table.status
    ),
  ]
)

export const shareAttributions = pgTable(
  "share_attributions",
  {
    shareId: uuid("share_id").primaryKey(),
    creatorClerkUserId: text("creator_clerk_user_id"),
    sourceToolId: text("source_tool_id").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("share_attributions_creator_idx").on(table.creatorClerkUserId)]
)

export const growthJourneys = pgTable(
  "growth_journeys",
  {
    id: uuid("id").primaryKey(),
    clerkUserId: text("clerk_user_id"),
    firstShareId: uuid("first_share_id").references(() => shareAttributions.shareId, {
      onDelete: "set null",
    }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index("growth_journeys_clerk_user_idx").on(table.clerkUserId)]
)

export const growthEvents = pgTable(
  "growth_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    journeyId: uuid("journey_id")
      .notNull()
      .references(() => growthJourneys.id, { onDelete: "cascade" }),
    clerkUserId: text("clerk_user_id"),
    eventName: text("event_name").notNull(),
    toolId: text("tool_id"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("growth_events_journey_time_idx").on(table.journeyId, table.occurredAt),
    index("growth_events_name_time_idx").on(table.eventName, table.occurredAt),
  ]
)

export const dailyGrowthMetrics = pgTable("daily_growth_metrics", {
  metricDay: date("metric_day").primaryKey(),
  quotaGateViewers: integer("quota_gate_viewers").default(0).notNull(),
  registrationCompletions: integer("registration_completions").default(0).notNull(),
  quotaGateActivations: integer("quota_gate_activations").default(0).notNull(),
  successfulDownloads: integer("successful_downloads").default(0).notNull(),
  shareIntents: integer("share_intents").default(0).notNull(),
  shareLandings: integer("share_landings").default(0).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const accountEntitlements = pgTable(
  "account_entitlements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    entitlementKey: text("entitlement_key").notNull(),
    value: jsonb("value").$type<string | number | boolean>().notNull(),
    source: text("source").notNull(),
    effectiveAt: timestamp("effective_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("account_entitlements_user_key_source_uidx").on(
      table.clerkUserId,
      table.entitlementKey,
      table.source
    ),
    index("account_entitlements_lookup_idx").on(
      table.clerkUserId,
      table.entitlementKey,
      table.effectiveAt
    ),
  ]
)

export const workspaceActivations = pgTable("workspace_activations", {
  clerkUserId: text("clerk_user_id").primaryKey(),
  firstSingleCompletedAt: timestamp("first_single_completed_at", { withTimezone: true }),
  firstBatchCompletedAt: timestamp("first_batch_completed_at", { withTimezone: true }),
  ...timestamps,
})

export const billingCustomers = pgTable(
  "billing_customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    provider: text("provider").notNull(),
    providerCustomerId: text("provider_customer_id").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("billing_customers_provider_customer_uidx").on(
      table.provider,
      table.providerCustomerId
    ),
    uniqueIndex("billing_customers_user_provider_uidx").on(table.clerkUserId, table.provider),
  ]
)

export const billingCheckoutCorrelations = pgTable(
  "billing_checkout_correlations",
  {
    id: uuid("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    provider: text("provider").notNull(),
    packageTier: text("package_tier", { enum: ["basic", "pro", "regular"] }).notNull(),
    billingInterval: text("billing_interval", { enum: ["monthly", "annual"] }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("billing_checkout_correlations_user_expiry_idx").on(table.clerkUserId, table.expiresAt),
  ]
)

export const billingSubscriptions = pgTable(
  "billing_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    provider: text("provider").notNull(),
    providerSubscriptionId: text("provider_subscription_id").notNull(),
    status: text("status").notNull(),
    productId: text("product_id"),
    packageTier: text("package_tier", { enum: ["basic", "pro", "regular"] }),
    billingInterval: text("billing_interval", { enum: ["monthly", "annual"] }),
    providerEventAt: timestamp("provider_event_at", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("billing_subscriptions_provider_subscription_uidx").on(
      table.provider,
      table.providerSubscriptionId
    ),
    index("billing_subscriptions_user_status_idx").on(table.clerkUserId, table.status),
  ]
)

export const billingWebhookEvents = pgTable(
  "billing_webhook_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    provider: text("provider").notNull(),
    providerEventId: text("provider_event_id").notNull(),
    eventType: text("event_type").notNull(),
    payloadHash: text("payload_hash").notNull(),
    processingError: text("processing_error"),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("billing_webhook_events_provider_event_uidx").on(
      table.provider,
      table.providerEventId
    ),
  ]
)

export const billingPayments = pgTable(
  "billing_payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    provider: text("provider").notNull(),
    providerPaymentId: text("provider_payment_id").notNull(),
    providerSubscriptionId: text("provider_subscription_id"),
    status: text("status").notNull(),
    providerEventAt: timestamp("provider_event_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("billing_payments_provider_payment_uidx").on(
      table.provider,
      table.providerPaymentId
    ),
    index("billing_payments_subscription_idx").on(table.provider, table.providerSubscriptionId),
  ]
)

export const billingOrders = pgTable(
  "billing_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    provider: text("provider").notNull(),
    productKey: text("product_key").notNull(),
    providerOrderId: text("provider_order_id"),
    providerCaptureId: text("provider_capture_id"),
    status: text("status").notNull(),
    amountMinor: integer("amount_minor").notNull(),
    currency: text("currency").notNull(),
    capturedAt: timestamp("captured_at", { withTimezone: true }),
    refundedAt: timestamp("refunded_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("billing_orders_provider_order_uidx").on(table.provider, table.providerOrderId),
    uniqueIndex("billing_orders_provider_capture_uidx").on(table.provider, table.providerCaptureId),
    index("billing_orders_user_status_idx").on(table.clerkUserId, table.status),
  ]
)

export const audioCreditGrants = pgTable(
  "audio_credit_grants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    source: text("source", {
      enum: ["daily_free", "paypal_order", "paypal_subscription"],
    }).notNull(),
    sourceRef: text("source_ref").notNull(),
    grantedCredits: integer("granted_credits").notNull(),
    reservedCredits: integer("reserved_credits").default(0).notNull(),
    consumedCredits: integer("consumed_credits").default(0).notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("audio_credit_grants_source_uidx").on(
      table.clerkUserId,
      table.source,
      table.sourceRef
    ),
    index("audio_credit_grants_balance_idx").on(table.clerkUserId, table.expiresAt, table.source),
  ]
)

export const audioCreditOperations = pgTable(
  "audio_credit_operations",
  {
    id: uuid("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    totalDurationSeconds: integer("total_duration_seconds").notNull(),
    fileCount: integer("file_count").notNull(),
    reservedCredits: integer("reserved_credits").notNull(),
    consumedCredits: integer("consumed_credits").default(0).notNull(),
    status: text("status", {
      enum: ["reserved", "processing", "consumed", "released"],
    }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    releasedAt: timestamp("released_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("audio_credit_operations_user_status_idx").on(
      table.clerkUserId,
      table.status,
      table.expiresAt
    ),
  ]
)

export const audioCreditAllocations = pgTable(
  "audio_credit_allocations",
  {
    operationId: uuid("operation_id")
      .notNull()
      .references(() => audioCreditOperations.id, { onDelete: "cascade" }),
    grantId: uuid("grant_id")
      .notNull()
      .references(() => audioCreditGrants.id, { onDelete: "restrict" }),
    reservedCredits: integer("reserved_credits").notNull(),
    consumedCredits: integer("consumed_credits").default(0).notNull(),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.operationId, table.grantId] })]
)

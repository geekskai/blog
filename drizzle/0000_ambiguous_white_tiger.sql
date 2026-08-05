CREATE TABLE "account_entitlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"entitlement_key" text NOT NULL,
	"value" jsonb NOT NULL,
	"source" text NOT NULL,
	"effective_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_customer_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_subscription_id" text NOT NULL,
	"status" text NOT NULL,
	"product_id" text,
	"current_period_end" timestamp with time zone,
	"canceled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"provider_event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"payload_hash" text NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_download_usage" (
	"clerk_user_id" text NOT NULL,
	"quota_day" date NOT NULL,
	"successful_downloads" integer DEFAULT 0 NOT NULL,
	"visitor_usage_carryover" integer DEFAULT 0 NOT NULL,
	"share_unlocked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_download_usage_clerk_user_id_quota_day_pk" PRIMARY KEY("clerk_user_id","quota_day")
);
--> statement-breakpoint
CREATE TABLE "download_operations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"quota_day" date NOT NULL,
	"tool_id" text NOT NULL,
	"status" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"released_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "growth_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_id" uuid NOT NULL,
	"clerk_user_id" text,
	"event_name" text NOT NULL,
	"tool_id" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "growth_journeys" (
	"id" uuid PRIMARY KEY NOT NULL,
	"clerk_user_id" text,
	"first_share_id" uuid,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "share_attributions" (
	"share_id" uuid PRIMARY KEY NOT NULL,
	"creator_clerk_user_id" text,
	"source_tool_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "growth_events" ADD CONSTRAINT "growth_events_journey_id_growth_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."growth_journeys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "growth_journeys" ADD CONSTRAINT "growth_journeys_first_share_id_share_attributions_share_id_fk" FOREIGN KEY ("first_share_id") REFERENCES "public"."share_attributions"("share_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_entitlements_lookup_idx" ON "account_entitlements" USING btree ("clerk_user_id","entitlement_key","effective_at");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_customers_provider_customer_uidx" ON "billing_customers" USING btree ("provider","provider_customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_customers_user_provider_uidx" ON "billing_customers" USING btree ("clerk_user_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_subscriptions_provider_subscription_uidx" ON "billing_subscriptions" USING btree ("provider","provider_subscription_id");--> statement-breakpoint
CREATE INDEX "billing_subscriptions_user_status_idx" ON "billing_subscriptions" USING btree ("clerk_user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_webhook_events_provider_event_uidx" ON "billing_webhook_events" USING btree ("provider","provider_event_id");--> statement-breakpoint
CREATE INDEX "download_operations_user_day_status_idx" ON "download_operations" USING btree ("clerk_user_id","quota_day","status");--> statement-breakpoint
CREATE INDEX "growth_events_journey_time_idx" ON "growth_events" USING btree ("journey_id","occurred_at");--> statement-breakpoint
CREATE INDEX "growth_events_name_time_idx" ON "growth_events" USING btree ("event_name","occurred_at");--> statement-breakpoint
CREATE INDEX "growth_journeys_clerk_user_idx" ON "growth_journeys" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "share_attributions_creator_idx" ON "share_attributions" USING btree ("creator_clerk_user_id");
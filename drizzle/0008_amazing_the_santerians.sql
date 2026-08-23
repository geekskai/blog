CREATE TABLE "billing_checkout_correlations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"provider" text NOT NULL,
	"package_tier" text NOT NULL,
	"billing_interval" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_payment_id" text NOT NULL,
	"provider_subscription_id" text,
	"status" text NOT NULL,
	"provider_event_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "billing_checkout_correlations_user_expiry_idx" ON "billing_checkout_correlations" USING btree ("clerk_user_id","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_payments_provider_payment_uidx" ON "billing_payments" USING btree ("provider","provider_payment_id");--> statement-breakpoint
CREATE INDEX "billing_payments_subscription_idx" ON "billing_payments" USING btree ("provider","provider_subscription_id");
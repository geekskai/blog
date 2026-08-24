CREATE TABLE "audio_credit_allocations" (
	"operation_id" uuid NOT NULL,
	"grant_id" uuid NOT NULL,
	"reserved_credits" integer NOT NULL,
	"consumed_credits" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "audio_credit_allocations_operation_id_grant_id_pk" PRIMARY KEY("operation_id","grant_id")
);
--> statement-breakpoint
CREATE TABLE "audio_credit_grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"source" text NOT NULL,
	"source_ref" text NOT NULL,
	"granted_credits" integer NOT NULL,
	"reserved_credits" integer DEFAULT 0 NOT NULL,
	"consumed_credits" integer DEFAULT 0 NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audio_credit_operations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"total_duration_seconds" integer NOT NULL,
	"file_count" integer NOT NULL,
	"reserved_credits" integer NOT NULL,
	"consumed_credits" integer DEFAULT 0 NOT NULL,
	"status" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"released_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"provider" text NOT NULL,
	"product_key" text NOT NULL,
	"provider_order_id" text,
	"provider_capture_id" text,
	"status" text NOT NULL,
	"amount_minor" integer NOT NULL,
	"currency" text NOT NULL,
	"captured_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audio_credit_allocations" ADD CONSTRAINT "audio_credit_allocations_operation_id_audio_credit_operations_id_fk" FOREIGN KEY ("operation_id") REFERENCES "public"."audio_credit_operations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audio_credit_allocations" ADD CONSTRAINT "audio_credit_allocations_grant_id_audio_credit_grants_id_fk" FOREIGN KEY ("grant_id") REFERENCES "public"."audio_credit_grants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "audio_credit_grants_source_uidx" ON "audio_credit_grants" USING btree ("clerk_user_id","source","source_ref");--> statement-breakpoint
CREATE INDEX "audio_credit_grants_balance_idx" ON "audio_credit_grants" USING btree ("clerk_user_id","expires_at","source");--> statement-breakpoint
CREATE INDEX "audio_credit_operations_user_status_idx" ON "audio_credit_operations" USING btree ("clerk_user_id","status","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_orders_provider_order_uidx" ON "billing_orders" USING btree ("provider","provider_order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_orders_provider_capture_uidx" ON "billing_orders" USING btree ("provider","provider_capture_id");--> statement-breakpoint
CREATE INDEX "billing_orders_user_status_idx" ON "billing_orders" USING btree ("clerk_user_id","status");
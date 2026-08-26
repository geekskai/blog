ALTER TABLE "billing_orders" ADD COLUMN "expires_at" timestamp with time zone DEFAULT now() + interval '24 hours' NOT NULL;--> statement-breakpoint
UPDATE "billing_orders" SET "expires_at" = "created_at" + interval '24 hours';--> statement-breakpoint
ALTER TABLE "billing_payments" ADD COLUMN "status_reason" text;--> statement-breakpoint
ALTER TABLE "billing_payments" ADD COLUMN "amount_minor" integer;--> statement-breakpoint
ALTER TABLE "billing_payments" ADD COLUMN "currency" text;--> statement-breakpoint
ALTER TABLE "billing_payments" ADD COLUMN "fee_minor" integer;--> statement-breakpoint
ALTER TABLE "billing_payments" ADD COLUMN "net_minor" integer;--> statement-breakpoint
ALTER TABLE "billing_payments" ADD COLUMN "refunded_minor" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "billing_payments" ADD COLUMN "reconciliation_status" text DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "billing_payments" ADD COLUMN "reconciled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "workspace_activations" ADD COLUMN "first_paid_opened_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "workspace_activations" ADD COLUMN "first_paid_completed_at" timestamp with time zone;

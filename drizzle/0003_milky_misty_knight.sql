CREATE TABLE "workspace_activations" (
	"clerk_user_id" text PRIMARY KEY NOT NULL,
	"first_single_completed_at" timestamp with time zone,
	"first_batch_completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "account_entitlements_user_key_source_uidx" ON "account_entitlements" USING btree ("clerk_user_id","entitlement_key","source");
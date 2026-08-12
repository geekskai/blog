CREATE TABLE "visitor_download_operations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"anonymous_id" uuid NOT NULL,
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
CREATE TABLE "visitor_download_usage" (
	"anonymous_id" uuid NOT NULL,
	"quota_day" date NOT NULL,
	"successful_downloads" integer DEFAULT 0 NOT NULL,
	"reserved_downloads" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "visitor_download_usage_anonymous_id_quota_day_pk" PRIMARY KEY("anonymous_id","quota_day")
);
--> statement-breakpoint
ALTER TABLE "billing_webhook_events" ADD COLUMN "processing_error" text;--> statement-breakpoint
CREATE INDEX "visitor_download_operations_identity_day_status_idx" ON "visitor_download_operations" USING btree ("anonymous_id","quota_day","status");
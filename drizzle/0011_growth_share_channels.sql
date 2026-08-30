CREATE TABLE "daily_growth_channel_metrics" (
	"metric_day" date NOT NULL,
	"tool_id" text NOT NULL,
	"channel" text NOT NULL,
	"surface" text NOT NULL,
	"copy_mode" text NOT NULL,
	"copy_variant" text NOT NULL,
	"share_card_views" integer DEFAULT 0 NOT NULL,
	"channel_opens" integer DEFAULT 0 NOT NULL,
	"share_landings" integer DEFAULT 0 NOT NULL,
	"referred_new_accounts" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_growth_channel_metrics_metric_day_tool_id_channel_surface_copy_mode_copy_variant_pk" PRIMARY KEY("metric_day","tool_id","channel","surface","copy_mode","copy_variant")
);
--> statement-breakpoint
ALTER TABLE "growth_events" ADD COLUMN "share_channel" text;--> statement-breakpoint
ALTER TABLE "growth_events" ADD COLUMN "share_surface" text;--> statement-breakpoint
ALTER TABLE "growth_events" ADD COLUMN "copy_mode" text;--> statement-breakpoint
ALTER TABLE "growth_events" ADD COLUMN "copy_variant" text;--> statement-breakpoint
ALTER TABLE "share_attributions" ADD COLUMN "share_channel" text DEFAULT 'x' NOT NULL;--> statement-breakpoint
ALTER TABLE "share_attributions" ADD COLUMN "share_surface" text DEFAULT 'quota_gate' NOT NULL;--> statement-breakpoint
ALTER TABLE "share_attributions" ADD COLUMN "copy_mode" text DEFAULT 'template' NOT NULL;--> statement-breakpoint
ALTER TABLE "share_attributions" ADD COLUMN "copy_variant" text DEFAULT 'legacy' NOT NULL;--> statement-breakpoint
ALTER TABLE "share_attributions" ALTER COLUMN "share_channel" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "share_attributions" ALTER COLUMN "share_surface" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "share_attributions" ALTER COLUMN "copy_mode" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "share_attributions" ALTER COLUMN "copy_variant" DROP DEFAULT;

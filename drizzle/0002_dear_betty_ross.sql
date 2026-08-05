CREATE TABLE "daily_growth_metrics" (
	"metric_day" date PRIMARY KEY NOT NULL,
	"quota_gate_viewers" integer DEFAULT 0 NOT NULL,
	"registration_completions" integer DEFAULT 0 NOT NULL,
	"quota_gate_activations" integer DEFAULT 0 NOT NULL,
	"successful_downloads" integer DEFAULT 0 NOT NULL,
	"share_intents" integer DEFAULT 0 NOT NULL,
	"share_landings" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

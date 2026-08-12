CREATE TABLE "visitor_share_unlocks" (
	"anonymous_id" uuid NOT NULL,
	"quota_day" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "visitor_share_unlocks_anonymous_id_quota_day_pk" PRIMARY KEY("anonymous_id","quota_day")
);

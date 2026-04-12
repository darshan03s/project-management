CREATE TABLE "project_invite" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"invite_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_invite_invite_id_unique" UNIQUE("invite_id")
);
--> statement-breakpoint
ALTER TABLE "project_invite" ADD CONSTRAINT "project_invite_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_invite_project_id_idx" ON "project_invite" USING btree ("project_id");
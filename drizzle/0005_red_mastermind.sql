ALTER TABLE "project" RENAME COLUMN "owner_id" TO "admin_id";--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_owner_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
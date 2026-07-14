ALTER TABLE "Message" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Message" ADD COLUMN "category" varchar DEFAULT 'internal_medicine' NOT NULL;--> statement-breakpoint
ALTER TABLE "Message" DROP COLUMN "attachments";
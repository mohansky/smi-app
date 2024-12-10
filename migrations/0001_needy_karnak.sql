CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" numeric NOT NULL,
	"date" timestamp NOT NULL,
	"amount" numeric NOT NULL,
	"description" varchar NOT NULL,
	"payment_method" varchar NOT NULL,
	"payment_status" varchar NOT NULL,
	"transaction_id" varchar,
	"notes" varchar,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "instrument" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "date_of_birth" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "grade" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "batch" varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

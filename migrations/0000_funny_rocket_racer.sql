CREATE TABLE IF NOT EXISTS "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"date" date NOT NULL,
	"status" varchar(20) NOT NULL,
	"notes" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"instrument" varchar(20) DEFAULT 'guitar' NOT NULL,
	"date_of_birth" date NOT NULL,
	"joining_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "students_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

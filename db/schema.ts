import {
  pgTable, 
  serial,
  varchar,
  date,
  timestamp,
  integer,
  numeric,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm"; 
import { relations } from "drizzle-orm";

export const INSTRUMENTS = {
  GUITAR: "guitar",
  DRUMS: "drums",
  KEYBOARD: "keyboard",
} as const;

export const GRADES = {
  GRADE1: "grade1",
  GRADE2: "grade2",
  GRADE3: "grade3",
} as const;

export type Grade = (typeof GRADES)[keyof typeof GRADES];

export const BATCHES = {
  MT: "mt",
  TF: "tf",
  WS: "ws",
} as const;

export type Batch = (typeof BATCHES)[keyof typeof BATCHES];

export const PAYMENT_METHODS = {
  CASH: "cash",
  UPI: "upi",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
} as const;

export type Instrument = (typeof INSTRUMENTS)[keyof typeof INSTRUMENTS];

// Student records
export const students = pgTable("students", { 
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "set null" }),
  phone: varchar("phone", { length: 20 }).notNull(),
  instrument: varchar("instrument", { length: 20 })
    .$type<Instrument>()
    .default(INSTRUMENTS.GUITAR),
  grade: varchar("grade", { length: 10 }).$type<Grade>().notNull(),
  batch: varchar("batch", { length: 5 }).$type<Batch>().notNull(),
  dateOfBirth: date("date_of_birth"),
  joiningDate: date("joining_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User records
export const users = pgTable("users", {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 50 }),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
  role: varchar('role', { enum: ['USER', 'ADMIN'] }).default('USER'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Attendance records
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .references(() => students.id, { onDelete: "cascade" })
    .notNull(),
  date: date("date").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  notes: varchar("notes", { length: 255 }),
});

// Payment records
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .references(() => students.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull(),
  amount: numeric("amount").notNull(),
  description: varchar("description").notNull(),
  paymentMethod: varchar("payment_method", {
    enum: ["CASH", "CARD"],
  }).notNull(),
  paymentStatus: varchar("payment_status", { enum: ["DUE", "PAID"] }).notNull(),
  transactionId: varchar("transaction_id"),
  notes: varchar("notes"),
  created_at: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type InsertPayment = typeof payments.$inferInsert;


// Expense records
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  amount: numeric("amount").notNull(),
  description: varchar("description").notNull(),
  category: varchar("category", {
    enum: ["UTILITIES", "RENT", "MISC"],
  }).default("MISC").notNull(),
  expenseStatus: varchar("expense_status", { 
    enum: ["DUE", "PAID"] 
  }).default("PAID").notNull(),
  paymentMethod: varchar("payment_method", {
    enum: ["CASH", "CARD"],
  }).default("CASH").notNull(),
  transactionId: varchar("transaction_id"),
  notes: varchar("notes"),
  created_at: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type InsertExpense = typeof expenses.$inferInsert;


// Relations
export const studentsRelations = relations(students, ({ many }) => ({
  attendance: many(attendance),
  payments: many(payments),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  student: one(students, {
    fields: [payments.studentId],
    references: [students.id],
  }),
}));

export const studentsUserRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  attendance: many(attendance),
  payments: many(payments),
}));

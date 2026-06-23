import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id")
    .autoincrement()
    .primaryKey(),

  // Nama lengkap user
  name: varchar("name", {
    length: 100,
  }).notNull(),

  // Email untuk login
  email: varchar("email", {
    length: 100,
  })
    .notNull()
    .unique(),

  // Password hasil hash bcrypt
  password: varchar("password", {
    length: 255,
  }).notNull(),

  // Role user
  role: mysqlEnum("role", [
    "ADMIN",
    "DOSEN",
    "MAHASISWA",
  ]).notNull(),

  // Soft delete
  isActive: boolean("is_active")
    .default(true)
    .notNull(),

  // Wajib ganti password pertama kali login
  mustChangePassword: boolean(
    "must_change_password"
  )
    .default(true)
    .notNull(),

  // Audit data
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});
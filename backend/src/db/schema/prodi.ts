import {
  mysqlTable,
  int,
  varchar,
  timestamp,
} from "drizzle-orm/mysql-core";

export const prodi = mysqlTable(
  "prodi",
  {
    id: int("id")
      .autoincrement()
      .primaryKey(),

    kode: varchar("kode", {
      length: 20,
    })
      .notNull()
      .unique(),

    nama: varchar("nama", {
      length: 100,
    })
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  }
);
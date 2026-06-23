import {
  mysqlTable,
  int,
  varchar
} from "drizzle-orm/mysql-core";

import { users } from "./user.js";
import { prodi } from "./prodi.js";

export const mahasiswa = mysqlTable(
  "mahasiswa",
  {
    id: int("id")
      .autoincrement()
      .primaryKey(),

    userId: int("user_id")
      .notNull()
      .references(() => users.id),

    nim: varchar("nim", {
      length: 20,
    })
      .notNull()
      .unique(),

    prodiId: int("prodi_id")
    .references(() => prodi.id)
    .notNull(),

    angkatan: int("angkatan")
      .notNull(),
  }
);
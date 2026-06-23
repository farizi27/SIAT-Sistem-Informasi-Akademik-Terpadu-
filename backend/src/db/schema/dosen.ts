import {
  mysqlTable,
  int,
  varchar
} from "drizzle-orm/mysql-core";

import { users } from "./user.js";

export const dosen = mysqlTable(
  "dosen",
  {
    id: int("id")
      .autoincrement()
      .primaryKey(),

    userId: int("user_id")
      .notNull()
      .references(() => users.id),

    nidn: varchar("nidn", {
      length: 20,
    })
      .notNull()
      .unique(),
  }
);
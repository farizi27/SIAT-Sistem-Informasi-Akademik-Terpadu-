import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const semester = mysqlTable(
  "semester",
  {
    id: int("id")
      .autoincrement()
      .primaryKey(),

    tahunAjaran: varchar(
      "tahun_ajaran",
      {
        length: 20,
      }
    ).notNull(),

    periode: mysqlEnum(
      "periode",
      [
        "GANJIL",
        "GENAP",
      ]
    ).notNull(),

    isActive: boolean(
      "is_active"
    )
      .notNull()
      .default(false),

    createdAt: timestamp(
      "created_at"
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at"
    )
      .defaultNow()
      .notNull(),
  }
);
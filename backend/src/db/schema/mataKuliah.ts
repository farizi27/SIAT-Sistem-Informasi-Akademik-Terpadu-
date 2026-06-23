import {
  mysqlTable,
  int,
  varchar,
  timestamp
} from "drizzle-orm/mysql-core";

import { prodi } from "./prodi.js";

export const mataKuliah =
mysqlTable(
  "mata_kuliah",
  {

    id: int("id")
      .autoincrement()
      .primaryKey(),

    kode: varchar(
      "kode",
      {
        length: 20
      }
    )
    .notNull()
    .unique(),

    nama: varchar(
      "nama",
      {
        length: 150
      }
    ).notNull(),

    sks: int("sks")
      .notNull(),

    semester: int(
      "semester"
    )
    .notNull(),

    prodiId: int(
      "prodi_id"
    )
    .notNull()
    .references(
      () => prodi.id
    ),

    createdAt:
      timestamp(
        "created_at"
      )
      .defaultNow()
      .notNull(),

    updatedAt:
      timestamp(
        "updated_at"
      )
      .defaultNow()
      .notNull(),
  }
);
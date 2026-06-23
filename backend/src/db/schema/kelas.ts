import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";

import { mataKuliah } from "./mataKuliah.js";
import { dosen } from "./dosen.js";
import { semester } from "./semester.js";

export const kelas = mysqlTable(
  "kelas",
  {
    id: int("id")
      .autoincrement()
      .primaryKey(),

    kodeKelas: varchar(
      "kode_kelas",
      {
        length: 20,
      }
    ).notNull(),

    mataKuliahId: int(
      "mata_kuliah_id"
    )
      .notNull()
      .references(
        () => mataKuliah.id
      ),

    dosenId: int(
      "dosen_id"
    )
      .notNull()
      .references(
        () => dosen.id
      ),

    semesterId: int(
      "semester_id"
    )
      .notNull()
      .references(
        () => semester.id
      ),

    kapasitas: int(
      "kapasitas"
    )
      .notNull(),

    status: mysqlEnum(
      "status",
      [
        "AKTIF",
        "NONAKTIF",
      ]
    )
      .notNull()
      .default("AKTIF"),

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
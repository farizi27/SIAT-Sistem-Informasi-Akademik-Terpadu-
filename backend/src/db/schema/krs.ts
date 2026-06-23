import {
  mysqlTable,
  int,
  timestamp,
  mysqlEnum
} from "drizzle-orm/mysql-core";
import { mahasiswa } from "./index.js";
import { kelas } from "./index.js";
export const krs = mysqlTable(
  "krs",
  {
    id: int("id")
      .autoincrement()
      .primaryKey(),

    mahasiswaId: int("mahasiswa_id")
      .notNull()
      .references(
        () => mahasiswa.id
      ),

    kelasId: int("kelas_id")
      .notNull()
      .references(
        () => kelas.id
      ),

    status: mysqlEnum(
      "status",
      [
        "DRAFT",
        "DISETUJUI",
        "DITOLAK"
      ]
    )
    .default("DRAFT")
    .notNull(),

    createdAt: timestamp(
      "created_at"
    )
    .defaultNow()
    .notNull(),
  }
);
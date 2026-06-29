import { eq, ne } from "drizzle-orm";

import { db } from "../../db/index.js";

import { semester } from "../../db/schema/index.js";

interface CreateSemesterInput {
  tahunAjaran: string;
  periode: "GANJIL" | "GENAP";
  isActive?: boolean;
}

interface UpdateSemesterInput {
  tahunAjaran?: string;
  periode?: "GANJIL" | "GENAP";
  isActive?: boolean;
}

/*
|--------------------------------------------------------------------------
| CREATE SEMESTER
|--------------------------------------------------------------------------
*/

export async function createSemesterService(data: CreateSemesterInput) {
  // Cek duplikasi tahunAjaran + periode
  const existingSemester = await db
    .select()
    .from(semester)
    .where(eq(semester.tahunAjaran, data.tahunAjaran));

  const duplicate = existingSemester.find(
    (item) => item.periode === data.periode
  );

  if (duplicate) {
    throw new Error("Semester dengan tahun ajaran dan periode tersebut sudah ada");
  }

  return await db.transaction(async (tx) => {
    // Jika semester baru ini aktif, nonaktifkan yang lain
    if (data.isActive) {
      await tx
        .update(semester)
        .set({ isActive: false });
    }

    await tx.insert(semester).values({
      tahunAjaran: data.tahunAjaran,
      periode: data.periode,
      isActive: data.isActive ?? false,
    });

    return { message: "Semester berhasil dibuat" };
  });
}

/*
|--------------------------------------------------------------------------
| GET ALL SEMESTER
|--------------------------------------------------------------------------
*/

export async function getAllSemesterService() {
  return await db
    .select()
    .from(semester)
    .orderBy(semester.tahunAjaran);
}

/*
|--------------------------------------------------------------------------
| GET SEMESTER BY ID
|--------------------------------------------------------------------------
*/

export async function getSemesterByIdService(id: number) {
  const result = await db
    .select()
    .from(semester)
    .where(eq(semester.id, id));

  const selectedSemester = result[0];
  if (!selectedSemester) throw new Error("Semester tidak ditemukan");
  return selectedSemester;
}

/*
|--------------------------------------------------------------------------
| GET SEMESTER AKTIF
|--------------------------------------------------------------------------
*/

export async function getActiveSemesterService() {
  const result = await db
    .select()
    .from(semester)
    .where(eq(semester.isActive, true));

  return result[0] ?? null;
}

/*
|--------------------------------------------------------------------------
| UPDATE SEMESTER
|--------------------------------------------------------------------------
*/

export async function updateSemesterService(
  id: number,
  data: UpdateSemesterInput
) {
  const existing = await db
    .select()
    .from(semester)
    .where(eq(semester.id, id));

  if (existing.length === 0) {
    throw new Error("Semester tidak ditemukan");
  }

  return await db.transaction(async (tx) => {
    // Jika semester ini diubah menjadi aktif, nonaktifkan yang lain dulu
    if (data.isActive === true) {
      await tx
        .update(semester)
        .set({ isActive: false })
        .where(ne(semester.id, id));
    }

    await tx
      .update(semester)
      .set({
        ...(data.tahunAjaran && { tahunAjaran: data.tahunAjaran }),
        ...(data.periode && { periode: data.periode }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      })
      .where(eq(semester.id, id));

    return { message: "Semester berhasil diperbarui" };
  });
}

/*
|--------------------------------------------------------------------------
| DELETE SEMESTER
|--------------------------------------------------------------------------
*/

export async function deleteSemesterService(id: number) {
  const existing = await db
    .select()
    .from(semester)
    .where(eq(semester.id, id));

  if (existing.length === 0) {
    throw new Error("Semester tidak ditemukan");
  }

  await db.delete(semester).where(eq(semester.id, id));

  return { message: "Semester berhasil dihapus" };
}
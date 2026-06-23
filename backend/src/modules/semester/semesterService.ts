import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  semester,
} from "../../db/schema/index.js";

// create semester service
export async function createSemesterService(
  data: {
    tahunAjaran: string;
    periode: "GANJIL" | "GENAP";
  }
) {

  const existingSemester =
    await db
      .select()
      .from(semester)
      .where(
        eq(
          semester.tahunAjaran,
          data.tahunAjaran
        )
      );

  const duplicate =
    existingSemester.find(
      (item) =>
        item.periode ===
        data.periode
    );

  if (duplicate) {
    throw new Error(
      "Semester sudah ada"
    );
  }

  await db
    .insert(semester)
    .values({
      tahunAjaran:
        data.tahunAjaran,
      periode:
        data.periode,
    });

  return {
    message:
      "Semester berhasil dibuat",
  };
}

// get all semester service
export async function getAllSemesterService() {
  return await db
    .select()
    .from(semester);
}

// get semester by id service
export async function getSemesterByIdService(
  id: number
) {

  const result =
    await db
      .select()
      .from(semester)
      .where(
        eq(
          semester.id,
          id
        )
      );

  const selectedSemester =
    result[0];

  if (!selectedSemester) {
    throw new Error(
      "Semester tidak ditemukan"
    );
  }

  return selectedSemester;
}

// update semester service
export async function updateSemesterService(
  id: number,
  data: {
    tahunAjaran?: string;
    periode?: "GANJIL" | "GENAP";
  }
) {

  const result =
    await db
      .select()
      .from(semester)
      .where(
        eq(
          semester.id,
          id
        )
      );

  const selectedSemester =
    result[0];

  if (!selectedSemester) {
    throw new Error(
      "Semester tidak ditemukan"
    );
  }

  await db
    .update(semester)
    .set({
      tahunAjaran:
        data.tahunAjaran,
      periode:
        data.periode,
    })
    .where(
      eq(
        semester.id,
        id
      )
    );

  return {
    message:
      "Semester berhasil diperbarui",
  };
}

// delete semester service
export async function deleteSemesterService(
  id: number
) {

  const result =
    await db
      .select()
      .from(semester)
      .where(
        eq(
          semester.id,
          id
        )
      );

  const selectedSemester =
    result[0];

  if (!selectedSemester) {
    throw new Error(
      "Semester tidak ditemukan"
    );
  }

  await db
    .delete(semester)
    .where(
      eq(
        semester.id,
        id
      )
    );

  return {
    message:
      "Semester berhasil dihapus",
  };
}
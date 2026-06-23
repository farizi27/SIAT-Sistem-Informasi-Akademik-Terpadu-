import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  kelas,
  dosen,
  semester,
  mataKuliah,
} from "../../db/schema/index.js";

interface CreateKelasInput {
  kodeKelas: string;
  mataKuliahId: number;
  dosenId: number;
  semesterId: number;
  kapasitas: number;
}

// create kelas service
export async function createKelasService(
  data: CreateKelasInput
) {

  const existingKelas =
    await db
      .select()
      .from(kelas)
      .where(
        eq(
          kelas.kodeKelas,
          data.kodeKelas
        )
      );

  if (
    existingKelas.length > 0
  ) {
    throw new Error(
      "Kode kelas sudah digunakan"
    );
  }

  const selectedMK =
    await db
      .select()
      .from(mataKuliah)
      .where(
        eq(
          mataKuliah.id,
          data.mataKuliahId
        )
      );

  if (
    selectedMK.length === 0
  ) {
    throw new Error(
      "Mata kuliah tidak ditemukan"
    );
  }

  const selectedDosen =
    await db
      .select()
      .from(dosen)
      .where(
        eq(
          dosen.id,
          data.dosenId
        )
      );

  if (
    selectedDosen.length === 0
  ) {
    throw new Error(
      "Dosen tidak ditemukan"
    );
  }

  const selectedSemester =
    await db
      .select()
      .from(semester)
      .where(
        eq(
          semester.id,
          data.semesterId
        )
      );

  if (
    selectedSemester.length === 0
  ) {
    throw new Error(
      "Semester tidak ditemukan"
    );
  }

  await db
    .insert(kelas)
    .values({
      kodeKelas:
        data.kodeKelas,
      mataKuliahId:
        data.mataKuliahId,
      dosenId:
        data.dosenId,
      semesterId:
        data.semesterId,
      kapasitas:
        data.kapasitas,
    });

  return {
    message:
      "Kelas berhasil dibuat",
  };
}

// get all kelas service
export async function getAllKelasService() {

  return await db
    .select()
    .from(kelas);
}

// get kelas by id service
export async function getKelasByIdService(
  id: number
) {

  const result =
    await db
      .select()
      .from(kelas)
      .where(
        eq(
          kelas.id,
          id
        )
      );

  const selectedKelas =
    result[0];

  if (!selectedKelas) {
    throw new Error(
      "Kelas tidak ditemukan"
    );
  }

  return selectedKelas;
}

// update kelas service
export async function updateKelasService(
  id: number,
  data: {
    kodeKelas?: string;
    kapasitas?: number;
    status?: "AKTIF" | "NONAKTIF";
  }
) {

  const selectedKelas =
    await db
      .select()
      .from(kelas)
      .where(
        eq(
          kelas.id,
          id
        )
      );

  if (
    selectedKelas.length === 0
  ) {
    throw new Error(
      "Kelas tidak ditemukan"
    );
  }

  await db
    .update(kelas)
    .set(data)
    .where(
      eq(
        kelas.id,
        id
      )
    );

  return {
    message:
      "Kelas berhasil diperbarui",
  };
}

// delete kelas service
export async function deleteKelasService(
  id: number
) {

  const selectedKelas =
    await db
      .select()
      .from(kelas)
      .where(
        eq(
          kelas.id,
          id
        )
      );

  if (
    selectedKelas.length === 0
  ) {
    throw new Error(
      "Kelas tidak ditemukan"
    );
  }

  await db
    .delete(kelas)
    .where(
      eq(
        kelas.id,
        id
      )
    );

  return {
    message:
      "Kelas berhasil dihapus",
  };
}
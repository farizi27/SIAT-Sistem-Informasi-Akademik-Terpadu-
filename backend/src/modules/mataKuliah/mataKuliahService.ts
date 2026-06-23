import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  mataKuliah,
  prodi
} from "../../db/schema/index.js";

// create mataKuliah service
export async function createMataKuliahService(
  data: {
    kode: string;
    nama: string;
    sks: number;
    semester: number;
    prodiId: number;
  }
) {

  const existingMK =
    await db
      .select()
      .from(mataKuliah)
      .where(
        eq(
          mataKuliah.kode,
          data.kode
        )
      );

  if (existingMK.length > 0) {
    throw new Error(
      "Kode mata kuliah sudah digunakan"
    );
  }

  const selectedProdi =
    await db
      .select()
      .from(prodi)
      .where(
        eq(
          prodi.id,
          data.prodiId
        )
      );

  if (
    selectedProdi.length === 0
  ) {
    throw new Error(
      "Prodi tidak ditemukan"
    );
  }

  await db
    .insert(mataKuliah)
    .values(data);

  return {
    message:
      "Mata kuliah berhasil dibuat"
  };
}

// get all mataKuliah service
export async function getAllMataKuliahService() {

  return await db
    .select()
    .from(mataKuliah);
}

// get mataKuliah by id service
export async function getMataKuliahByIdService(
  id: number
) {

  const result =
    await db
      .select()
      .from(mataKuliah)
      .where(
        eq(
          mataKuliah.id,
          id
        )
      );

  const selectedMK =
    result[0];

  if (!selectedMK) {
    throw new Error(
      "Mata kuliah tidak ditemukan"
    );
  }

  return selectedMK;
}

// update mataKuliah service
export async function updateMataKuliahService(
  id: number,
  data: {
    kode?: string;
    nama?: string;
    sks?: number;
    semester?: number;
    prodiId?: number;
  }
) {

  const result =
    await db
      .select()
      .from(mataKuliah)
      .where(
        eq(
          mataKuliah.id,
          id
        )
      );

  const selectedMK =
    result[0];

  if (!selectedMK) {
    throw new Error(
      "Mata kuliah tidak ditemukan"
    );
  }

  await db
    .update(mataKuliah)
    .set(data)
    .where(
      eq(
        mataKuliah.id,
        id
      )
    );

  return {
    message:
      "Mata kuliah berhasil diperbarui"
  };
}

// delete mataKuliah service
export async function deleteMataKuliahService(
  id: number
) {

  const result =
    await db
      .select()
      .from(mataKuliah)
      .where(
        eq(
          mataKuliah.id,
          id
        )
      );

  const selectedMK =
    result[0];

  if (!selectedMK) {
    throw new Error(
      "Mata kuliah tidak ditemukan"
    );
  }

  await db
    .delete(mataKuliah)
    .where(
      eq(
        mataKuliah.id,
        id
      )
    );

  return {
    message:
      "Mata kuliah berhasil dihapus"
  };
}
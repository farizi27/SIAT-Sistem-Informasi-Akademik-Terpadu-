import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  prodi,
} from "../../db/schema/index.js";

// create prodi service
export async function createProdiService(
  data: {
    kode: string;
    nama: string;
  }
) {

  const existingProdi =
    await db
      .select()
      .from(prodi)
      .where(
        eq(
          prodi.kode,
          data.kode
        )
      );

  if (
    existingProdi.length > 0
  ) {
    throw new Error(
      "Kode prodi sudah digunakan"
    );
  }

  await db
    .insert(prodi)
    .values({
      kode: data.kode,
      nama: data.nama,
    });

  return {
    message:
      "Prodi berhasil dibuat",
  };
}

// get all prodi service
export async function getAllProdiService() {

  return await db
    .select()
    .from(prodi);
}

// get prodi by id service
export async function getProdiByIdService(
  id: number
) {

  const result =
    await db
      .select()
      .from(prodi)
      .where(
        eq(
          prodi.id,
          id
        )
      );

  const selectedProdi =
    result[0];

  if (!selectedProdi) {
    throw new Error(
      "Prodi tidak ditemukan"
    );
  }

  return selectedProdi;
}

// update prodi service
export async function updateProdiService(
  id: number,
  data: {
    kode?: string;
    nama?: string;
  }
) {

  const result =
    await db
      .select()
      .from(prodi)
      .where(
        eq(
          prodi.id,
          id
        )
      );

  const selectedProdi =
    result[0];

  if (!selectedProdi) {
    throw new Error(
      "Prodi tidak ditemukan"
    );
  }

  await db
    .update(prodi)
    .set({
      kode: data.kode,
      nama: data.nama,
    })
    .where(
      eq(
        prodi.id,
        id
      )
    );

  return {
    message:
      "Prodi berhasil diperbarui",
  };
}

// delete prodi service
export async function deleteProdiService(
  id: number
) {

  const result =
    await db
      .select()
      .from(prodi)
      .where(
        eq(
          prodi.id,
          id
        )
      );

  const selectedProdi =
    result[0];

  if (!selectedProdi) {
    throw new Error(
      "Prodi tidak ditemukan"
    );
  }

  await db
    .delete(prodi)
    .where(
      eq(
        prodi.id,
        id
      )
    );

  return {
    message:
      "Prodi berhasil dihapus",
  };
}
import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  mataKuliah,
  prodi,
} from "../../db/schema/index.js";

interface CreateMataKuliahInput {
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  prodiId: number;
}

interface UpdateMataKuliahInput {
  kode?: string;
  nama?: string;
  sks?: number;
  semester?: number;
  prodiId?: number;
}

/*
|--------------------------------------------------------------------------
| CREATE MATA KULIAH
|--------------------------------------------------------------------------
*/

export async function createMataKuliahService(data: CreateMataKuliahInput) {
  // Cek kode unik
  const existingMK = await db
    .select()
    .from(mataKuliah)
    .where(eq(mataKuliah.kode, data.kode));

  if (existingMK.length > 0) {
    throw new Error("Kode mata kuliah sudah digunakan");
  }

  // Cek prodi ada
  const selectedProdi = await db
    .select()
    .from(prodi)
    .where(eq(prodi.id, data.prodiId));

  if (selectedProdi.length === 0) {
    throw new Error("Program studi tidak ditemukan");
  }

  await db.insert(mataKuliah).values(data);

  return { message: "Mata kuliah berhasil dibuat" };
}

/*
|--------------------------------------------------------------------------
| GET ALL MATA KULIAH (dengan join prodi)
|--------------------------------------------------------------------------
*/

export async function getAllMataKuliahService() {
  const result = await db
    .select({
      id: mataKuliah.id,
      kode: mataKuliah.kode,
      nama: mataKuliah.nama,
      sks: mataKuliah.sks,
      semester: mataKuliah.semester,
      prodiId: mataKuliah.prodiId,
      namaProdi: prodi.nama,
      kodeProdi: prodi.kode,
    })
    .from(mataKuliah)
    .leftJoin(prodi, eq(mataKuliah.prodiId, prodi.id));

  return result;
}

/*
|--------------------------------------------------------------------------
| GET MATA KULIAH BY ID
|--------------------------------------------------------------------------
*/

export async function getMataKuliahByIdService(id: number) {
  const result = await db
    .select({
      id: mataKuliah.id,
      kode: mataKuliah.kode,
      nama: mataKuliah.nama,
      sks: mataKuliah.sks,
      semester: mataKuliah.semester,
      prodiId: mataKuliah.prodiId,
      namaProdi: prodi.nama,
      kodeProdi: prodi.kode,
    })
    .from(mataKuliah)
    .leftJoin(prodi, eq(mataKuliah.prodiId, prodi.id))
    .where(eq(mataKuliah.id, id));

  const selectedMK = result[0];
  if (!selectedMK) throw new Error("Mata kuliah tidak ditemukan");
  return selectedMK;
}

/*
|--------------------------------------------------------------------------
| GET MATA KULIAH BY PRODI
|--------------------------------------------------------------------------
*/

export async function getMataKuliahByProdiService(prodiId: number) {
  const result = await db
    .select({
      id: mataKuliah.id,
      kode: mataKuliah.kode,
      nama: mataKuliah.nama,
      sks: mataKuliah.sks,
      semester: mataKuliah.semester,
      prodiId: mataKuliah.prodiId,
      namaProdi: prodi.nama,
    })
    .from(mataKuliah)
    .leftJoin(prodi, eq(mataKuliah.prodiId, prodi.id))
    .where(eq(mataKuliah.prodiId, prodiId));

  return result;
}

/*
|--------------------------------------------------------------------------
| UPDATE MATA KULIAH
|--------------------------------------------------------------------------
*/

export async function updateMataKuliahService(
  id: number,
  data: UpdateMataKuliahInput
) {
  const existing = await db
    .select()
    .from(mataKuliah)
    .where(eq(mataKuliah.id, id));

  if (existing.length === 0) {
    throw new Error("Mata kuliah tidak ditemukan");
  }

  // Jika ganti kode, pastikan tidak duplikat
  if (data.kode) {
    const dupKode = await db
      .select()
      .from(mataKuliah)
      .where(eq(mataKuliah.kode, data.kode));

    if (dupKode.length > 0 && dupKode[0]?.id !== id) {
      throw new Error("Kode mata kuliah sudah digunakan");
    }
  }

  // Jika ganti prodi, pastikan ada
  if (data.prodiId) {
    const selectedProdi = await db
      .select()
      .from(prodi)
      .where(eq(prodi.id, data.prodiId));

    if (selectedProdi.length === 0) {
      throw new Error("Program studi tidak ditemukan");
    }
  }

  await db
    .update(mataKuliah)
    .set({
      ...(data.kode && { kode: data.kode }),
      ...(data.nama && { nama: data.nama }),
      ...(data.sks && { sks: data.sks }),
      ...(data.semester && { semester: data.semester }),
      ...(data.prodiId && { prodiId: data.prodiId }),
    })
    .where(eq(mataKuliah.id, id));

  return { message: "Mata kuliah berhasil diperbarui" };
}

/*
|--------------------------------------------------------------------------
| DELETE MATA KULIAH
|--------------------------------------------------------------------------
*/

export async function deleteMataKuliahService(id: number) {
  const existing = await db
    .select()
    .from(mataKuliah)
    .where(eq(mataKuliah.id, id));

  if (existing.length === 0) {
    throw new Error("Mata kuliah tidak ditemukan");
  }

  await db.delete(mataKuliah).where(eq(mataKuliah.id, id));

  return { message: "Mata kuliah berhasil dihapus" };
}
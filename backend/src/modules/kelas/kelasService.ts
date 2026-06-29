import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  kelas,
  dosen,
  users,
  semester,
  mataKuliah,
  prodi,
} from "../../db/schema/index.js";

interface CreateKelasInput {
  kodeKelas: string;
  mataKuliahId: number;
  dosenId: number;
  semesterId: number;
  kapasitas: number;
}

interface UpdateKelasInput {
  kodeKelas?: string;
  kapasitas?: number;
  dosenId?: number;
  status?: "AKTIF" | "NONAKTIF";
}

/*
|--------------------------------------------------------------------------
| CREATE KELAS
|--------------------------------------------------------------------------
*/

export async function createKelasService(data: CreateKelasInput) {
  // Cek kode kelas unik
  const existingKelas = await db
    .select()
    .from(kelas)
    .where(eq(kelas.kodeKelas, data.kodeKelas));

  if (existingKelas.length > 0) {
    throw new Error("Kode kelas sudah digunakan");
  }

  // Cek mata kuliah ada
  const selectedMK = await db
    .select()
    .from(mataKuliah)
    .where(eq(mataKuliah.id, data.mataKuliahId));

  if (selectedMK.length === 0) {
    throw new Error("Mata kuliah tidak ditemukan");
  }

  // Cek dosen ada
  const selectedDosen = await db
    .select()
    .from(dosen)
    .where(eq(dosen.id, data.dosenId));

  if (selectedDosen.length === 0) {
    throw new Error("Dosen tidak ditemukan");
  }

  // Cek semester ada
  const selectedSemester = await db
    .select()
    .from(semester)
    .where(eq(semester.id, data.semesterId));

  if (selectedSemester.length === 0) {
    throw new Error("Semester tidak ditemukan");
  }

  await db.insert(kelas).values({
    kodeKelas: data.kodeKelas,
    mataKuliahId: data.mataKuliahId,
    dosenId: data.dosenId,
    semesterId: data.semesterId,
    kapasitas: data.kapasitas,
  });

  return { message: "Kelas berhasil dibuat" };
}

/*
|--------------------------------------------------------------------------
| GET ALL KELAS (dengan join mata kuliah, dosen, semester)
|--------------------------------------------------------------------------
*/

export async function getAllKelasService() {
  const result = await db
    .select({
      id: kelas.id,
      kodeKelas: kelas.kodeKelas,
      kapasitas: kelas.kapasitas,
      status: kelas.status,
      createdAt: kelas.createdAt,
      // Mata Kuliah
      mataKuliahId: kelas.mataKuliahId,
      namaMataKuliah: mataKuliah.nama,
      kodeMataKuliah: mataKuliah.kode,
      sks: mataKuliah.sks,
      // Dosen
      dosenId: kelas.dosenId,
      namaDosen: users.name,
      // Semester
      semesterId: kelas.semesterId,
      tahunAjaran: semester.tahunAjaran,
      periode: semester.periode,
    })
    .from(kelas)
    .leftJoin(mataKuliah, eq(kelas.mataKuliahId, mataKuliah.id))
    .leftJoin(dosen, eq(kelas.dosenId, dosen.id))
    .leftJoin(users, eq(dosen.userId, users.id))
    .leftJoin(semester, eq(kelas.semesterId, semester.id));

  return result;
}

/*
|--------------------------------------------------------------------------
| GET KELAS BY ID
|--------------------------------------------------------------------------
*/

export async function getKelasByIdService(id: number) {
  const result = await db
    .select({
      id: kelas.id,
      kodeKelas: kelas.kodeKelas,
      kapasitas: kelas.kapasitas,
      status: kelas.status,
      createdAt: kelas.createdAt,
      // Mata Kuliah
      mataKuliahId: kelas.mataKuliahId,
      namaMataKuliah: mataKuliah.nama,
      kodeMataKuliah: mataKuliah.kode,
      sks: mataKuliah.sks,
      // Dosen
      dosenId: kelas.dosenId,
      namaDosen: users.name,
      // Semester
      semesterId: kelas.semesterId,
      tahunAjaran: semester.tahunAjaran,
      periode: semester.periode,
    })
    .from(kelas)
    .leftJoin(mataKuliah, eq(kelas.mataKuliahId, mataKuliah.id))
    .leftJoin(dosen, eq(kelas.dosenId, dosen.id))
    .leftJoin(users, eq(dosen.userId, users.id))
    .leftJoin(semester, eq(kelas.semesterId, semester.id))
    .where(eq(kelas.id, id));

  const selectedKelas = result[0];
  if (!selectedKelas) throw new Error("Kelas tidak ditemukan");
  return selectedKelas;
}

/*
|--------------------------------------------------------------------------
| UPDATE KELAS
|--------------------------------------------------------------------------
*/

export async function updateKelasService(id: number, data: UpdateKelasInput) {
  const selectedKelas = await db
    .select()
    .from(kelas)
    .where(eq(kelas.id, id));

  if (selectedKelas.length === 0) {
    throw new Error("Kelas tidak ditemukan");
  }

  // Jika ganti dosen, pastikan dosen ada
  if (data.dosenId) {
    const selectedDosen = await db
      .select()
      .from(dosen)
      .where(eq(dosen.id, data.dosenId));

    if (selectedDosen.length === 0) {
      throw new Error("Dosen tidak ditemukan");
    }
  }

  await db
    .update(kelas)
    .set({
      ...(data.kodeKelas && { kodeKelas: data.kodeKelas }),
      ...(data.kapasitas && { kapasitas: data.kapasitas }),
      ...(data.dosenId && { dosenId: data.dosenId }),
      ...(data.status && { status: data.status }),
    })
    .where(eq(kelas.id, id));

  return { message: "Kelas berhasil diperbarui" };
}

/*
|--------------------------------------------------------------------------
| DELETE KELAS
|--------------------------------------------------------------------------
*/

export async function deleteKelasService(id: number) {
  const selectedKelas = await db
    .select()
    .from(kelas)
    .where(eq(kelas.id, id));

  if (selectedKelas.length === 0) {
    throw new Error("Kelas tidak ditemukan");
  }

  await db.delete(kelas).where(eq(kelas.id, id));

  return { message: "Kelas berhasil dihapus" };
}

/*
|--------------------------------------------------------------------------
| GET KELAS BY DOSEN (untuk dosen melihat kelasnya sendiri)
|--------------------------------------------------------------------------
*/

export async function getKelasByDosenService(dosenId: number) {
  const result = await db
    .select({
      id: kelas.id,
      kodeKelas: kelas.kodeKelas,
      kapasitas: kelas.kapasitas,
      status: kelas.status,
      mataKuliahId: kelas.mataKuliahId,
      namaMataKuliah: mataKuliah.nama,
      kodeMataKuliah: mataKuliah.kode,
      sks: mataKuliah.sks,
      dosenId: kelas.dosenId,
      namaDosen: users.name,
      semesterId: kelas.semesterId,
      tahunAjaran: semester.tahunAjaran,
      periode: semester.periode,
    })
    .from(kelas)
    .leftJoin(mataKuliah, eq(kelas.mataKuliahId, mataKuliah.id))
    .leftJoin(dosen, eq(kelas.dosenId, dosen.id))
    .leftJoin(users, eq(dosen.userId, users.id))
    .leftJoin(semester, eq(kelas.semesterId, semester.id))
    .where(eq(kelas.dosenId, dosenId));

  return result;
}

/*
|--------------------------------------------------------------------------
| GET KELAS BY PRODI (untuk matakuliah per prodi)
|--------------------------------------------------------------------------
*/

export async function getKelasByProdiService(prodiId: number) {
  const result = await db
    .select({
      id: kelas.id,
      kodeKelas: kelas.kodeKelas,
      kapasitas: kelas.kapasitas,
      status: kelas.status,
      mataKuliahId: kelas.mataKuliahId,
      namaMataKuliah: mataKuliah.nama,
      kodeMataKuliah: mataKuliah.kode,
      sks: mataKuliah.sks,
      dosenId: kelas.dosenId,
      namaDosen: users.name,
      semesterId: kelas.semesterId,
      tahunAjaran: semester.tahunAjaran,
      periode: semester.periode,
    })
    .from(kelas)
    .leftJoin(mataKuliah, eq(kelas.mataKuliahId, mataKuliah.id))
    .leftJoin(prodi, eq(mataKuliah.prodiId, prodi.id))
    .leftJoin(dosen, eq(kelas.dosenId, dosen.id))
    .leftJoin(users, eq(dosen.userId, users.id))
    .leftJoin(semester, eq(kelas.semesterId, semester.id))
    .where(eq(mataKuliah.prodiId, prodiId));

  return result;
}
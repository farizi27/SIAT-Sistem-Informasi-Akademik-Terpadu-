import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  krs,
  mahasiswa,
  kelas,
  users,
  mataKuliah,
  semester,
} from "../../db/schema/index.js";

interface CreateKRSInput {
  mahasiswaId: number;
  kelasId: number;
}

/*
|--------------------------------------------------------------------------
| GET ALL KRS
|--------------------------------------------------------------------------
*/

export async function getAllKRSService() {

  const result = await db
    .select({
      id: krs.id,
      mahasiswaId: krs.mahasiswaId,
      kelasId: krs.kelasId,
      status: krs.status,
      createdAt: krs.createdAt,
      namaMahasiswa: users.name,
      nim: mahasiswa.nim,
      namaKelas: kelas.kodeKelas,
      namaMataKuliah: mataKuliah.nama,
      sks: mataKuliah.sks,
      semester: semester.tahunAjaran,
    })
    .from(krs)
    .leftJoin(mahasiswa, eq(krs.mahasiswaId, mahasiswa.id))
    .leftJoin(users, eq(mahasiswa.userId, users.id))
    .leftJoin(kelas, eq(krs.kelasId, kelas.id))
    .leftJoin(mataKuliah, eq(kelas.mataKuliahId, mataKuliah.id))
    .leftJoin(semester, eq(kelas.semesterId, semester.id));

  return result;
}

/*
|--------------------------------------------------------------------------
| GET KRS BY ID
|--------------------------------------------------------------------------
*/

export async function getKRSByIdService(id: number) {

  const result = await db
    .select({
      id: krs.id,
      mahasiswaId: krs.mahasiswaId,
      kelasId: krs.kelasId,
      status: krs.status,
      createdAt: krs.createdAt,
      namaMahasiswa: users.name,
      nim: mahasiswa.nim,
      namaKelas: kelas.kodeKelas,
      namaMataKuliah: mataKuliah.nama,
      sks: mataKuliah.sks,
      semester: semester.tahunAjaran,
    })
    .from(krs)
    .leftJoin(mahasiswa, eq(krs.mahasiswaId, mahasiswa.id))
    .leftJoin(users, eq(mahasiswa.userId, users.id))
    .leftJoin(kelas, eq(krs.kelasId, kelas.id))
    .leftJoin(mataKuliah, eq(kelas.mataKuliahId, mataKuliah.id))
    .leftJoin(semester, eq(kelas.semesterId, semester.id))
    .where(eq(krs.id, id));

  const selectedKRS = result[0];

  if (!selectedKRS) {
    throw new Error("KRS tidak ditemukan");
  }

  return selectedKRS;
}

/*
|--------------------------------------------------------------------------
| CREATE KRS
|--------------------------------------------------------------------------
*/

export async function createKRSService(data: CreateKRSInput) {

  // Cek mahasiswa ada
  const selectedMahasiswa = await db
    .select()
    .from(mahasiswa)
    .where(eq(mahasiswa.id, data.mahasiswaId));

  if (selectedMahasiswa.length === 0) {
    throw new Error("Mahasiswa tidak ditemukan");
  }

  // Cek kelas ada
  const selectedKelas = await db
    .select()
    .from(kelas)
    .where(eq(kelas.id, data.kelasId));

  if (selectedKelas.length === 0) {
    throw new Error("Kelas tidak ditemukan");
  }

  // Cek duplikasi KRS (mahasiswa sudah mendaftar kelas yang sama)
  const existing = await db
    .select()
    .from(krs)
    .where(
      eq(krs.mahasiswaId, data.mahasiswaId)
    );

  const alreadyRegistered = existing.find(
    (k) => k.kelasId === data.kelasId
  );

  if (alreadyRegistered) {
    throw new Error(
      "Mahasiswa sudah mendaftar kelas ini"
    );
  }

  await db.insert(krs).values({
    mahasiswaId: data.mahasiswaId,
    kelasId: data.kelasId,
    status: "DRAFT",
  });

  return { message: "KRS berhasil dibuat" };
}

/*
|--------------------------------------------------------------------------
| UPDATE KRS
|--------------------------------------------------------------------------
*/

export async function updateKRSService(
  id: number,
  data: CreateKRSInput
) {

  const selectedKRS = await db
    .select()
    .from(krs)
    .where(eq(krs.id, id));

  if (selectedKRS.length === 0) {
    throw new Error("KRS tidak ditemukan");
  }

  await db
    .update(krs)
    .set({
      mahasiswaId: data.mahasiswaId,
      kelasId: data.kelasId,
    })
    .where(eq(krs.id, id));

  return { message: "KRS berhasil diperbarui" };
}

/*
|--------------------------------------------------------------------------
| DELETE KRS
|--------------------------------------------------------------------------
*/

export async function deleteKRSService(id: number) {

  const selectedKRS = await db
    .select()
    .from(krs)
    .where(eq(krs.id, id));

  if (selectedKRS.length === 0) {
    throw new Error("KRS tidak ditemukan");
  }

  await db.delete(krs).where(eq(krs.id, id));

  return { message: "KRS berhasil dihapus" };
}

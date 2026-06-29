import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  krs,
  mahasiswa,
  kelas,
  users,
  mataKuliah,
  semester,
  dosen,
  prodi,
} from "../../db/schema/index.js";

interface CreateKRSInput {
  mahasiswaId: number;
  kelasId: number;
}

interface UpdateKRSInput {
  mahasiswaId?: number;
  kelasId?: number;
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
      nilai: krs.nilai,
      createdAt: krs.createdAt,
      // Mahasiswa
      namaMahasiswa: users.name,
      nim: mahasiswa.nim,
      namaProdi: prodi.nama,
      // Kelas
      kodeKelas: kelas.kodeKelas,
      // Mata Kuliah
      namaMataKuliah: mataKuliah.nama,
      kodeMataKuliah: mataKuliah.kode,
      sks: mataKuliah.sks,
      // Semester
      tahunAjaran: semester.tahunAjaran,
      periode: semester.periode,
    })
    .from(krs)
    .leftJoin(mahasiswa, eq(krs.mahasiswaId, mahasiswa.id))
    .leftJoin(users, eq(mahasiswa.userId, users.id))
    .leftJoin(prodi, eq(mahasiswa.prodiId, prodi.id))
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
      nilai: krs.nilai,
      createdAt: krs.createdAt,
      namaMahasiswa: users.name,
      nim: mahasiswa.nim,
      namaProdi: prodi.nama,
      kodeKelas: kelas.kodeKelas,
      namaMataKuliah: mataKuliah.nama,
      kodeMataKuliah: mataKuliah.kode,
      sks: mataKuliah.sks,
      tahunAjaran: semester.tahunAjaran,
      periode: semester.periode,
    })
    .from(krs)
    .leftJoin(mahasiswa, eq(krs.mahasiswaId, mahasiswa.id))
    .leftJoin(users, eq(mahasiswa.userId, users.id))
    .leftJoin(prodi, eq(mahasiswa.prodiId, prodi.id))
    .leftJoin(kelas, eq(krs.kelasId, kelas.id))
    .leftJoin(mataKuliah, eq(kelas.mataKuliahId, mataKuliah.id))
    .leftJoin(semester, eq(kelas.semesterId, semester.id))
    .where(eq(krs.id, id));

  const selectedKRS = result[0];
  if (!selectedKRS) throw new Error("KRS tidak ditemukan");
  return selectedKRS;
}

/*
|--------------------------------------------------------------------------
| GET KRS BY MAHASISWA (untuk mahasiswa melihat KRS-nya sendiri)
|--------------------------------------------------------------------------
*/

export async function getKRSByMahasiswaService(mahasiswaId: number) {
  const result = await db
    .select({
      id: krs.id,
      mahasiswaId: krs.mahasiswaId,
      kelasId: krs.kelasId,
      status: krs.status,
      nilai: krs.nilai,
      createdAt: krs.createdAt,
      kodeKelas: kelas.kodeKelas,
      namaMataKuliah: mataKuliah.nama,
      kodeMataKuliah: mataKuliah.kode,
      sks: mataKuliah.sks,
      namaDosen: users.name,
      tahunAjaran: semester.tahunAjaran,
      periode: semester.periode,
    })
    .from(krs)
    .leftJoin(kelas, eq(krs.kelasId, kelas.id))
    .leftJoin(mataKuliah, eq(kelas.mataKuliahId, mataKuliah.id))
    .leftJoin(dosen, eq(kelas.dosenId, dosen.id))
    .leftJoin(users, eq(dosen.userId, users.id))
    .leftJoin(semester, eq(kelas.semesterId, semester.id))
    .where(eq(krs.mahasiswaId, mahasiswaId));

  return result;
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

  // Cek duplikasi KRS
  const existing = await db
    .select()
    .from(krs)
    .where(eq(krs.mahasiswaId, data.mahasiswaId));

  const alreadyRegistered = existing.find(
    (k) => k.kelasId === data.kelasId
  );

  if (alreadyRegistered) {
    throw new Error("Mahasiswa sudah mendaftar kelas ini");
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

export async function updateKRSService(id: number, data: UpdateKRSInput) {
  const selectedKRS = await db
    .select()
    .from(krs)
    .where(eq(krs.id, id));

  if (selectedKRS.length === 0) throw new Error("KRS tidak ditemukan");

  await db
    .update(krs)
    .set({
      ...(data.mahasiswaId && { mahasiswaId: data.mahasiswaId }),
      ...(data.kelasId && { kelasId: data.kelasId }),
    })
    .where(eq(krs.id, id));

  return { message: "KRS berhasil diperbarui" };
}

/*
|--------------------------------------------------------------------------
| UPDATE STATUS KRS (DRAFT -> DISETUJUI / DITOLAK)
|--------------------------------------------------------------------------
*/

export async function updateKRSStatusService(
  id: number,
  status: "DRAFT" | "DISETUJUI" | "DITOLAK"
) {
  const selectedKRS = await db
    .select()
    .from(krs)
    .where(eq(krs.id, id));

  if (selectedKRS.length === 0) throw new Error("KRS tidak ditemukan");

  await db
    .update(krs)
    .set({ status })
    .where(eq(krs.id, id));

  return { message: `Status KRS berhasil diubah menjadi ${status}` };
}

/*
|--------------------------------------------------------------------------
| UPDATE NILAI KRS (input nilai oleh dosen atau admin)
|--------------------------------------------------------------------------
*/

export async function updateNilaiKRSService(id: number, nilai: string) {
  const allowedNilai = ["A", "B+", "B", "C+", "C", "D+", "D", "E"];

  if (!allowedNilai.includes(nilai.toUpperCase())) {
    throw new Error(
      `Nilai tidak valid. Nilai yang diperbolehkan: ${allowedNilai.join(", ")}`
    );
  }

  const selectedKRS = await db
    .select()
    .from(krs)
    .where(eq(krs.id, id));

  if (selectedKRS.length === 0) throw new Error("KRS tidak ditemukan");

  await db
    .update(krs)
    .set({ nilai: nilai.toUpperCase() })
    .where(eq(krs.id, id));

  return { message: "Nilai berhasil diperbarui" };
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

  if (selectedKRS.length === 0) throw new Error("KRS tidak ditemukan");

  await db.delete(krs).where(eq(krs.id, id));

  return { message: "KRS berhasil dihapus" };
}

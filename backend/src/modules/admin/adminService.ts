import bcrypt from "bcrypt";
import { count, eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  users,
  mahasiswa,
  dosen,
  prodi,
  semester,
  mataKuliah,
  kelas,
  krs,
} from "../../db/schema/index.js";

/*
|--------------------------------------------------------------------------
| INTERFACES
|--------------------------------------------------------------------------
*/

interface CreateMahasiswaInput {
  name: string;
  email: string;
  password?: string;
  nim: string;
  prodi: number;
  angkatan: number;
}

interface UpdateMahasiswaInput {
  name?: string;
  email?: string;
  nim?: string;
  prodi?: number;
  angkatan?: number;
}

interface CreateDosenInput {
  name: string;
  email: string;
  nidn: string;
  password?: string;
}

interface UpdateDosenInput {
  name?: string;
  email?: string;
  nidn?: string;
}

/*
|--------------------------------------------------------------------------
| MAHASISWA - CREATE
|--------------------------------------------------------------------------
*/

export async function createMahasiswaService(data: CreateMahasiswaInput) {
  return await db.transaction(async (tx) => {
    // Cek email
    const existingUser = await tx
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    if (existingUser.length > 0) {
      throw new Error("Email sudah digunakan");
    }

    // Cek NIM
    const existingNim = await tx
      .select()
      .from(mahasiswa)
      .where(eq(mahasiswa.nim, data.nim));

    if (existingNim.length > 0) {
      throw new Error("NIM sudah digunakan");
    }

    // Cek prodi ada
    const selectedProdi = await tx
      .select()
      .from(prodi)
      .where(eq(prodi.id, data.prodi));

    if (selectedProdi.length === 0) {
      throw new Error("Program studi tidak ditemukan");
    }

    // Hash password (gunakan password yg dikirim, atau NIM sebagai default)
    const rawPassword = data.password?.trim() ? data.password : data.nim;
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Insert user
    await tx.insert(users).values({
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: "MAHASISWA",
      isActive: true,
      mustChangePassword: true,
    });

    // Ambil user baru
    const createdUser = await tx
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    const user = createdUser[0];
    if (!user) throw new Error("Gagal membuat user");

    // Insert mahasiswa
    await tx.insert(mahasiswa).values({
      userId: user.id,
      nim: data.nim,
      prodiId: data.prodi,
      angkatan: data.angkatan,
    });

    return {
      id: user.id,
      name: data.name,
      email: data.email,
      nim: data.nim,
      prodi: data.prodi,
      angkatan: data.angkatan,
    };
  });
}

/*
|--------------------------------------------------------------------------
| MAHASISWA - GET ALL
|--------------------------------------------------------------------------
*/

export async function getAllMahasiswaService() {
  const result = await db
    .select({
      id: mahasiswa.id,
      userId: mahasiswa.userId,
      name: users.name,
      email: users.email,
      nim: mahasiswa.nim,
      prodiId: mahasiswa.prodiId,
      prodi: prodi.nama,
      angkatan: mahasiswa.angkatan,
      isActive: users.isActive,
      mustChangePassword: users.mustChangePassword,
    })
    .from(mahasiswa)
    .innerJoin(users, eq(mahasiswa.userId, users.id))
    .leftJoin(prodi, eq(mahasiswa.prodiId, prodi.id));

  return result;
}

/*
|--------------------------------------------------------------------------
| MAHASISWA - GET BY ID
|--------------------------------------------------------------------------
*/

export async function getMahasiswaByIdService(id: number) {
  const result = await db
    .select({
      id: mahasiswa.id,
      userId: mahasiswa.userId,
      name: users.name,
      email: users.email,
      nim: mahasiswa.nim,
      prodiId: mahasiswa.prodiId,
      prodi: prodi.nama,
      angkatan: mahasiswa.angkatan,
      isActive: users.isActive,
      mustChangePassword: users.mustChangePassword,
    })
    .from(mahasiswa)
    .innerJoin(users, eq(mahasiswa.userId, users.id))
    .leftJoin(prodi, eq(mahasiswa.prodiId, prodi.id))
    .where(eq(mahasiswa.id, id));

  const data = result[0];
  if (!data) throw new Error("Mahasiswa tidak ditemukan");
  return data;
}

/*
|--------------------------------------------------------------------------
| MAHASISWA - UPDATE
|--------------------------------------------------------------------------
*/

export async function updateMahasiswaService(
  id: number,
  data: UpdateMahasiswaInput
) {
  return await db.transaction(async (tx) => {
    const mahasiswaRows = await tx
      .select()
      .from(mahasiswa)
      .where(eq(mahasiswa.id, id));

    const selectedMahasiswa = mahasiswaRows[0];
    if (!selectedMahasiswa) throw new Error("Mahasiswa tidak ditemukan");

    // Cek email duplikat
    if (data.email) {
      const existingUser = await tx
        .select()
        .from(users)
        .where(eq(users.email, data.email));

      if (
        existingUser.length > 0 &&
        existingUser[0]?.id !== selectedMahasiswa.userId
      ) {
        throw new Error("Email sudah digunakan");
      }
    }

    // Cek NIM duplikat
    if (data.nim) {
      const existingNim = await tx
        .select()
        .from(mahasiswa)
        .where(eq(mahasiswa.nim, data.nim));

      if (
        existingNim.length > 0 &&
        existingNim[0]?.id !== id
      ) {
        throw new Error("NIM sudah digunakan");
      }
    }

    // Update user
    await tx
      .update(users)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
      })
      .where(eq(users.id, selectedMahasiswa.userId));

    // Update mahasiswa
    await tx
      .update(mahasiswa)
      .set({
        ...(data.nim && { nim: data.nim }),
        ...(data.prodi && { prodiId: data.prodi }),
        ...(data.angkatan && { angkatan: data.angkatan }),
      })
      .where(eq(mahasiswa.id, id));

    return { message: "Mahasiswa berhasil diperbarui" };
  });
}

/*
|--------------------------------------------------------------------------
| MAHASISWA - DELETE (soft delete)
|--------------------------------------------------------------------------
*/

export async function deleteMahasiswaService(id: number) {
  return await db.transaction(async (tx) => {
    const mahasiswaRows = await tx
      .select()
      .from(mahasiswa)
      .where(eq(mahasiswa.id, id));

    const selectedMahasiswa = mahasiswaRows[0];
    if (!selectedMahasiswa) throw new Error("Mahasiswa tidak ditemukan");

    await tx
      .update(users)
      .set({ isActive: false })
      .where(eq(users.id, selectedMahasiswa.userId));

    return { message: "Mahasiswa berhasil dinonaktifkan" };
  });
}

/*
|--------------------------------------------------------------------------
| DOSEN - CREATE
|--------------------------------------------------------------------------
*/

export async function createDosenService(data: CreateDosenInput) {
  return await db.transaction(async (tx) => {
    // Cek email
    const existingUser = await tx
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    if (existingUser.length > 0) {
      throw new Error("Email sudah digunakan");
    }

    // Cek NIDN
    const existingDosen = await tx
      .select()
      .from(dosen)
      .where(eq(dosen.nidn, data.nidn));

    if (existingDosen.length > 0) {
      throw new Error("NIDN sudah digunakan");
    }

    // Hash password (gunakan password yg dikirim, atau NIDN sebagai default)
    const rawPassword = data.password?.trim() ? data.password : data.nidn;
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Insert user
    await tx.insert(users).values({
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: "DOSEN",
      isActive: true,
      mustChangePassword: true,
    });

    const createdUser = await tx
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    const user = createdUser[0];
    if (!user) throw new Error("Gagal membuat user dosen");

    // Insert dosen
    await tx.insert(dosen).values({
      userId: user.id,
      nidn: data.nidn,
    });

    return {
      id: user.id,
      name: data.name,
      email: data.email,
      nidn: data.nidn,
    };
  });
}

/*
|--------------------------------------------------------------------------
| DOSEN - GET ALL
|--------------------------------------------------------------------------
*/

export async function getAllDosenService() {
  const result = await db
    .select({
      id: dosen.id,
      userId: dosen.userId,
      name: users.name,
      email: users.email,
      nidn: dosen.nidn,
      isActive: users.isActive,
      mustChangePassword: users.mustChangePassword,
    })
    .from(dosen)
    .innerJoin(users, eq(dosen.userId, users.id));

  return result;
}

/*
|--------------------------------------------------------------------------
| DOSEN - GET BY ID
|--------------------------------------------------------------------------
*/

export async function getDosenByIdService(id: number) {
  const result = await db
    .select({
      id: dosen.id,
      userId: dosen.userId,
      name: users.name,
      email: users.email,
      nidn: dosen.nidn,
      isActive: users.isActive,
      mustChangePassword: users.mustChangePassword,
    })
    .from(dosen)
    .innerJoin(users, eq(dosen.userId, users.id))
    .where(eq(dosen.id, id));

  const data = result[0];
  if (!data) throw new Error("Dosen tidak ditemukan");
  return data;
}

/*
|--------------------------------------------------------------------------
| DOSEN - UPDATE
|--------------------------------------------------------------------------
*/

export async function updateDosenService(id: number, data: UpdateDosenInput) {
  return await db.transaction(async (tx) => {
    const dosenRows = await tx
      .select()
      .from(dosen)
      .where(eq(dosen.id, id));

    const selectedDosen = dosenRows[0];
    if (!selectedDosen) throw new Error("Dosen tidak ditemukan");

    // Cek email duplikat
    if (data.email) {
      const existingUser = await tx
        .select()
        .from(users)
        .where(eq(users.email, data.email));

      if (
        existingUser.length > 0 &&
        existingUser[0]?.id !== selectedDosen.userId
      ) {
        throw new Error("Email sudah digunakan");
      }
    }

    // Cek NIDN duplikat
    if (data.nidn) {
      const existingDosen = await tx
        .select()
        .from(dosen)
        .where(eq(dosen.nidn, data.nidn));

      if (
        existingDosen.length > 0 &&
        existingDosen[0]?.id !== id
      ) {
        throw new Error("NIDN sudah digunakan");
      }
    }

    // Update user
    await tx
      .update(users)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
      })
      .where(eq(users.id, selectedDosen.userId));

    // Update dosen
    if (data.nidn) {
      await tx
        .update(dosen)
        .set({ nidn: data.nidn })
        .where(eq(dosen.id, id));
    }

    return { message: "Dosen berhasil diperbarui" };
  });
}

/*
|--------------------------------------------------------------------------
| DOSEN - DELETE (soft delete)
|--------------------------------------------------------------------------
*/

export async function deleteDosenService(id: number) {
  return await db.transaction(async (tx) => {
    const dosenRows = await tx
      .select()
      .from(dosen)
      .where(eq(dosen.id, id));

    const selectedDosen = dosenRows[0];
    if (!selectedDosen) throw new Error("Dosen tidak ditemukan");

    await tx
      .update(users)
      .set({ isActive: false })
      .where(eq(users.id, selectedDosen.userId));

    return { message: "Dosen berhasil dinonaktifkan" };
  });
}

/*
|--------------------------------------------------------------------------
| USER MANAGEMENT - TOGGLE STATUS (Aktif/Nonaktif)
|--------------------------------------------------------------------------
*/

export async function toggleUserStatusService(userId: number) {
  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  const user = userRows[0];
  if (!user) throw new Error("User tidak ditemukan");

  const newStatus = !user.isActive;

  await db
    .update(users)
    .set({ isActive: newStatus })
    .where(eq(users.id, userId));

  return {
    message: newStatus
      ? "Akun berhasil diaktifkan"
      : "Akun berhasil dinonaktifkan",
    isActive: newStatus,
  };
}

/*
|--------------------------------------------------------------------------
| USER MANAGEMENT - RESET PASSWORD
|--------------------------------------------------------------------------
*/

export async function resetPasswordService(userId: number) {
  const userRows = await db
    .select({
      id: users.id,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, userId));

  const user = userRows[0];
  if (!user) throw new Error("User tidak ditemukan");

  // Tentukan password baru berdasarkan role
  let newRawPassword = "password123"; // fallback

  if (user.role === "MAHASISWA") {
    const mhsRows = await db
      .select({ nim: mahasiswa.nim })
      .from(mahasiswa)
      .where(eq(mahasiswa.userId, userId));

    if (mhsRows[0]) {
      newRawPassword = mhsRows[0].nim;
    }
  } else if (user.role === "DOSEN") {
    const dosenRows = await db
      .select({ nidn: dosen.nidn })
      .from(dosen)
      .where(eq(dosen.userId, userId));

    if (dosenRows[0]) {
      newRawPassword = dosenRows[0].nidn;
    }
  }

  const hashedPassword = await bcrypt.hash(newRawPassword, 10);

  await db
    .update(users)
    .set({
      password: hashedPassword,
      mustChangePassword: true,
    })
    .where(eq(users.id, userId));

  return {
    message: "Password berhasil direset. Password baru adalah NIM/NIDN pengguna.",
  };
}

/*
|--------------------------------------------------------------------------
| DASHBOARD STATS
|--------------------------------------------------------------------------
*/

export async function getDashboardService() {
  const [
    totalMahasiswaResult,
    totalDosenResult,
    totalProdiResult,
    totalSemesterResult,
    totalMataKuliahResult,
    totalKelasResult,
    totalKrsResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(mahasiswa),
    db.select({ count: count() }).from(dosen),
    db.select({ count: count() }).from(prodi),
    db.select({ count: count() }).from(semester),
    db.select({ count: count() }).from(mataKuliah),
    db.select({ count: count() }).from(kelas),
    db.select({ count: count() }).from(krs),
  ]);

  return {
    mahasiswa: totalMahasiswaResult[0]?.count ?? 0,
    dosen: totalDosenResult[0]?.count ?? 0,
    prodi: totalProdiResult[0]?.count ?? 0,
    semester: totalSemesterResult[0]?.count ?? 0,
    mataKuliah: totalMataKuliahResult[0]?.count ?? 0,
    kelas: totalKelasResult[0]?.count ?? 0,
    krs: totalKrsResult[0]?.count ?? 0,
  };
}
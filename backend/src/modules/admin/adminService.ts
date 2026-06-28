import bcrypt from "bcrypt";
import { count,eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  users,
  mahasiswa,
  prodi,
} from "../../db/schema/index.js";

import {
  dosen,
} from "../../db/schema/index.js";

interface CreateMahasiswaInput {
  id?: number;
  name: string;
  email: string;
  nim: string;
  prodi: number;
  angkatan: number;
}

export async function createMahasiswaService(
  data: CreateMahasiswaInput
) {

  return await db.transaction(
    async (tx) => {

      /*
      |--------------------------------------------------------------------------
      | CEK EMAIL
      |--------------------------------------------------------------------------
      */

      const existingUser =
        await tx
          .select()
          .from(users)
          .where(
            eq(
              users.email,
              data.email
            )
          );

      if (
        existingUser.length > 0
      ) {
        throw new Error(
          "Email sudah digunakan"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | CEK NIM
      |--------------------------------------------------------------------------
      */

      const existingNim =
        await tx
          .select()
          .from(mahasiswa)
          .where(
            eq(
              mahasiswa.nim,
              data.nim
            )
          );

      if (
        existingNim.length > 0
      ) {
        throw new Error(
          "NIM sudah digunakan"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | HASH PASSWORD
      |--------------------------------------------------------------------------
      */

      const passwordHash =
        await bcrypt.hash(
          data.nim,
          10
        );

      /*
      |--------------------------------------------------------------------------
      | INSERT USER
      |--------------------------------------------------------------------------
      */

      await tx
        .insert(users)
        .values({
          name: data.name,
          email: data.email,
          password:
            passwordHash,
          role: "MAHASISWA",
          isActive: true,
          mustChangePassword:
            true,
        });

      /*
      |--------------------------------------------------------------------------
      | AMBIL USER YANG BARU DIBUAT
      |--------------------------------------------------------------------------
      */

      const createdUser =
        await tx
          .select()
          .from(users)
          .where(
            eq(
              users.email,
              data.email
            )
          );
      const user = createdUser[0];
      if (
        !user
      ) {
        throw new Error(
          "Gagal membuat user"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | INSERT MAHASISWA
      |--------------------------------------------------------------------------
      */

      await tx
        .insert(mahasiswa)
        .values({
          userId:
            user.id,
          nim: data.nim,
          prodiId: data.prodi,
          angkatan:
            data.angkatan,
        });

      /*
      |--------------------------------------------------------------------------
      | RESPONSE
      |--------------------------------------------------------------------------
      */

      return {
        id: user.id,
        name: data.name,
        email: data.email,
        nim: data.nim,
        prodi: data.prodi,
        angkatan:
          data.angkatan,
      };
    }
  );
}

// get all mahasiswa
export async function getAllMahasiswaService() {
  try {

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
  })
  .from(mahasiswa)
  .innerJoin(
    users,
    eq(mahasiswa.userId, users.id)
  )
  .innerJoin(
    prodi,
    eq(mahasiswa.prodiId, prodi.id)
  )
  .where(
    eq(users.isActive, true)
  );
  return result;
  } catch (error) {

    throw new Error(
      "Gagal mengambil data mahasiswa"
    );
  }
}

// get mahasiswa by id
export async function getMahasiswaByIdService(
  id: number
) {
  try {

    const result = await db
      .select({
        id: mahasiswa.id,
        userId: mahasiswa.userId,

        name: users.name,
        email: users.email,

        nim: mahasiswa.nim,
        prodiId: mahasiswa.prodiId,
        angkatan: mahasiswa.angkatan,

        isActive: users.isActive,
      })
      .from(mahasiswa)
      .innerJoin(
        users,
        eq(mahasiswa.userId, users.id)
      )
      .where(
        eq(mahasiswa.id, id)
      );

    const mahasiswaData =
      result[0];

    if (!mahasiswaData) {
      throw new Error(
        "Mahasiswa tidak ditemukan"
      );
    }

    return mahasiswaData;

  } catch (error) {

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Gagal mengambil data mahasiswa"
    );
  }
}
// put update mahasiswa
export async function updateMahasiswaService(
  id: number,
  data: {
    name?: string;
    email?: string;
    prodiId?: number;
    angkatan?: number;
  }
) {

  return await db.transaction(
    async (tx) => {

      const mahasiswaData =
        await tx
          .select()
          .from(mahasiswa)
          .where(
            eq(
              mahasiswa.id,
              id
            )
          );

      const selectedMahasiswa =
        mahasiswaData[0];

      if (!selectedMahasiswa) {
        throw new Error(
          "Mahasiswa tidak ditemukan"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Cek Email Duplikat
      |--------------------------------------------------------------------------
      */

      if (data.email) {

        const existingUser =
          await tx
            .select()
            .from(users)
            .where(
              eq(
                users.email,
                data.email
              )
            );

        if (
          existingUser.length > 0 &&
          existingUser[0]?.id !==
          selectedMahasiswa.userId
        ) {
          throw new Error(
            "Email sudah digunakan"
          );
        }
      }

      /*
      |--------------------------------------------------------------------------
      | Update Users
      |--------------------------------------------------------------------------
      */

      await tx
        .update(users)
        .set({
          name: data.name,
          email: data.email,
        })
        .where(
          eq(
            users.id,
            selectedMahasiswa.userId
          )
        );

      /*
      |--------------------------------------------------------------------------
      | Update Mahasiswa
      |--------------------------------------------------------------------------
      */

      await tx
        .update(mahasiswa)
        .set({
          prodiId: data.prodiId,
          angkatan:
            data.angkatan,
        })
        .where(
          eq(
            mahasiswa.id,
            id
          )
        );

      return {
        message:
          "Mahasiswa berhasil diperbarui",
      };
    }
  );
}

// delete mahasiswa
export async function deleteMahasiswaService(
  id: number
) {

  return await db.transaction(
    async (tx) => {

      const mahasiswaData =
        await tx
          .select()
          .from(mahasiswa)
          .where(
            eq(
              mahasiswa.id,
              id
            )
          );

      const selectedMahasiswa =
        mahasiswaData[0];

      if (!selectedMahasiswa) {
        throw new Error(
          "Mahasiswa tidak ditemukan"
        );
      }

      await tx
        .update(users)
        .set({
          isActive: false,
        })
        .where(
          eq(
            users.id,
            selectedMahasiswa.userId
          )
        );

      return {
        message:
          "Mahasiswa berhasil dinonaktifkan",
      };
    }
  );
}

// dosen
interface CreateDosenInput {
  name: string;
  email: string;
  nidn: string;
}

export async function createDosenService(
  data: CreateDosenInput
) {

  return await db.transaction(
    async (tx) => {

      /*
      |--------------------------------------------------------------------------
      | CEK EMAIL
      |--------------------------------------------------------------------------
      */

      const existingUser =
        await tx
          .select()
          .from(users)
          .where(
            eq(
              users.email,
              data.email
            )
          );

      if (
        existingUser.length > 0
      ) {
        throw new Error(
          "Email sudah digunakan"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | CEK NIDN
      |--------------------------------------------------------------------------
      */

      const existingDosen =
        await tx
          .select()
          .from(dosen)
          .where(
            eq(
              dosen.nidn,
              data.nidn
            )
          );

      if (
        existingDosen.length > 0
      ) {
        throw new Error(
          "NIDN sudah digunakan"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | PASSWORD AWAL = NIDN
      |--------------------------------------------------------------------------
      */

      const passwordHash =
        await bcrypt.hash(
          data.nidn,
          10
        );

      /*
      |--------------------------------------------------------------------------
      | INSERT USER
      |--------------------------------------------------------------------------
      */

      await tx
        .insert(users)
        .values({
          name: data.name,
          email: data.email,
          password:
            passwordHash,
          role: "DOSEN",
          isActive: true,
          mustChangePassword:
            true,
        });

      const createdUser =
        await tx
          .select()
          .from(users)
          .where(
            eq(
              users.email,
              data.email
            )
          );

      const user =
        createdUser[0];

      if (!user) {
        throw new Error(
          "Gagal membuat user dosen"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | INSERT DOSEN
      |--------------------------------------------------------------------------
      */

      await tx
        .insert(dosen)
        .values({
          userId: user.id,
          nidn: data.nidn,
        });

      return {
        id: user.id,
        name: data.name,
        email: data.email,
        nidn: data.nidn,
      };
    }
  );
}

// get dosen by id
export async function getDosenByIdService(
  id: number
) {
  try {

    const result = await db
      .select({
        id: dosen.id,
        userId: dosen.userId,

        name: users.name,
        email: users.email,

        nidn: dosen.nidn,

        isActive: users.isActive,
      })
      .from(dosen)
      .innerJoin(
        users,
        eq(dosen.userId, users.id)
      )
      .where(
        eq(dosen.id, id)
      );

    const dosenData =
      result[0];

    if (!dosenData) {
      throw new Error(
        "Dosen tidak ditemukan"
      );
    }

    return dosenData;

  } catch (error) {

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Gagal mengambil data dosen"
    );
  }
}

// update dosen
export async function updateDosenService(
  id: number,
  data: {
    name?: string;
    email?: string;
  }
) {

  return await db.transaction(
    async (tx) => {

      const dosenData =
        await tx
          .select()
          .from(dosen)
          .where(
            eq(
              dosen.id,
              id
            )
          );

      const selectedDosen =
        dosenData[0];

      if (!selectedDosen) {
        throw new Error(
          "Dosen tidak ditemukan"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | CEK EMAIL
      |--------------------------------------------------------------------------
      */

      if (data.email) {

        const existingUser =
          await tx
            .select()
            .from(users)
            .where(
              eq(
                users.email,
                data.email
              )
            );

        if (
          existingUser.length > 0 &&
          existingUser[0]?.id !==
          selectedDosen.userId
        ) {
          throw new Error(
            "Email sudah digunakan"
          );
        }
      }

      /*
      |--------------------------------------------------------------------------
      | UPDATE USER
      |--------------------------------------------------------------------------
      */

      await tx
        .update(users)
        .set({
          name: data.name,
          email: data.email,
        })
        .where(
          eq(
            users.id,
            selectedDosen.userId
          )
        );

      return {
        message:
          "Dosen berhasil diperbarui",
      };
    }
  );
}

// delete dosen
export async function deleteDosenService(
  id: number
) {

  return await db.transaction(
    async (tx) => {

      const dosenData =
        await tx
          .select()
          .from(dosen)
          .where(
            eq(
              dosen.id,
              id
            )
          );

      const selectedDosen =
        dosenData[0];

      if (!selectedDosen) {
        throw new Error(
          "Dosen tidak ditemukan"
        );
      }

      await tx
        .update(users)
        .set({
          isActive: false,
        })
        .where(
          eq(
            users.id,
            selectedDosen.userId
          )
        );

      return {
        message:
          "Dosen berhasil dinonaktifkan",
      };
    }
  );
}

//  get all desen
export async function getAllDosenService() {
  try {

    const result = await db
      .select({
        id: dosen.id,
        userId: dosen.userId,

        name: users.name,
        email: users.email,

        nidn: dosen.nidn,

        isActive: users.isActive,
      })
      .from(dosen)
      .innerJoin(
        users,
        eq(dosen.userId, users.id)
      )
      .where(eq(users.isActive, true));

    return result;

  } catch (error) {

    throw new Error(
      "Gagal mengambil data dosen"
    );
  }
}

// =========================
// dashboard stats
// =========================
export async function getDashboardService() {
  try {

    /*
    |--------------------------------------------------------------------------
    | Total Mahasiswa
    |--------------------------------------------------------------------------
    */

    const totalMahasiswa = await db
      .select({
        count: count(),
      })
      .from(mahasiswa);

    /*
    |--------------------------------------------------------------------------
    | Total Dosen
    |--------------------------------------------------------------------------
    */

    const totalDosen = await db
      .select({
        count: count(),
      })
      .from(dosen);

    /*
    |--------------------------------------------------------------------------
    | Total Admin
    |--------------------------------------------------------------------------
    */

    const totalAdmin = await db
      .select({
        count: count(),
      })
      .from(users)
      .where(
        eq(users.role, "ADMIN")
      );

    return {
      totalMahasiswa:
        totalMahasiswa[0]?.count ?? 0,

      totalDosen:
        totalDosen[0]?.count ?? 0,

      totalAdmin:
        totalAdmin[0]?.count ?? 0,
    };

  } catch (error) {

    throw new Error(
      "Gagal mengambil data dashboard"
    );
  }
}
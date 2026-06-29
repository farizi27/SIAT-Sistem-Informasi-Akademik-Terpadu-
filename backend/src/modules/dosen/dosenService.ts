import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { users, dosen } from "../../db/schema/index.js";

/*
|--------------------------------------------------------------------------
| GET DOSEN PROFILE (by userId from JWT)
|--------------------------------------------------------------------------
*/

export async function getDosenProfileService(userId: number) {
  const result = await db
    .select({
      id: dosen.id,
      userId: dosen.userId,
      name: users.name,
      email: users.email,
      nidn: dosen.nidn,
    })
    .from(dosen)
    .innerJoin(users, eq(dosen.userId, users.id))
    .where(eq(dosen.userId, userId));

  const data = result[0];
  if (!data) throw new Error("Profil dosen tidak ditemukan");
  return data;
}

/*
|--------------------------------------------------------------------------
| UPDATE DOSEN PROFILE
|--------------------------------------------------------------------------
*/

interface UpdateDosenProfileInput {
  name?: string;
  email?: string;
  nidn?: string;
}

export async function updateDosenProfileService(
  userId: number,
  data: UpdateDosenProfileInput
) {
  // Get dosen record
  const dosenRows = await db
    .select()
    .from(dosen)
    .where(eq(dosen.userId, userId));

  const dosenRecord = dosenRows[0];
  if (!dosenRecord) throw new Error("Dosen tidak ditemukan");

  // Update user table (name, email)
  const userUpdates: Record<string, string> = {};
  if (data.name?.trim()) userUpdates.name = data.name.trim();
  if (data.email?.trim()) userUpdates.email = data.email.trim();

  if (Object.keys(userUpdates).length > 0) {
    await db
      .update(users)
      .set(userUpdates)
      .where(eq(users.id, userId));
  }

  // Update dosen table (nidn)
  if (data.nidn?.trim()) {
    await db
      .update(dosen)
      .set({ nidn: data.nidn.trim() })
      .where(eq(dosen.id, dosenRecord.id));
  }

  return { message: "Profil berhasil diperbarui" };
}

/*
|--------------------------------------------------------------------------
| CHANGE DOSEN PASSWORD
|--------------------------------------------------------------------------
*/

export async function changeDosenPasswordService(
  userId: number,
  oldPassword: string,
  newPassword: string
) {
  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  const user = userRows[0];
  if (!user) throw new Error("User tidak ditemukan");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Password lama salah");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(users)
    .set({
      password: hashedPassword,
      mustChangePassword: false,
    })
    .where(eq(users.id, userId));

  return { message: "Password berhasil diubah" };
}

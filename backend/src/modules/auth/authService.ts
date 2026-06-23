import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { users } from "../../db/schema/user.js";

const SECRET_KEY =
  process.env.JWT_SECRET!;

export async function loginService(
  email: string,
  password: string
) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = result[0];

  if (!user) {
    throw new Error("Email salah");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("password salah");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

// get profile service
export async function getProfileService(
  userId: number
) {

  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      mustChangePassword:
        users.mustChangePassword,
    })
    .from(users)
    .where(
      eq(users.id, userId)
    );

  const user = result[0];

  if (!user) {
    throw new Error(
      "User tidak ditemukan"
    );
  }

  return user;
}

// change password service
export async function changePasswordService(
  userId: number,
  oldPassword: string,
  newPassword: string
) {

  const result = await db
    .select()
    .from(users)
    .where(
      eq(users.id, userId)
    );

  const user = result[0];

  if (!user) {
    throw new Error(
      "User tidak ditemukan"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | CEK PASSWORD LAMA
  |--------------------------------------------------------------------------
  */

  const isMatch =
    await bcrypt.compare(
      oldPassword,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Password lama salah"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | HASH PASSWORD BARU
  |--------------------------------------------------------------------------
  */

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10
    );

  /*
  |--------------------------------------------------------------------------
  | UPDATE PASSWORD
  |--------------------------------------------------------------------------
  */

  await db
    .update(users)
    .set({
      password:
        hashedPassword,

      mustChangePassword:
        false,
    })
    .where(
      eq(users.id, userId)
    );

  return {
    message:
      "Password berhasil diubah",
  };
}
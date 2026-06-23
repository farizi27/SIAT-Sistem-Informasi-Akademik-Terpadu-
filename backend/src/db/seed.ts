import bcrypt from "bcrypt";
import { db } from "./index.js";
import { users } from "./schema/user.js";

const password = await bcrypt.hash(
  "admin123",
  10
);

await db.insert(users).values({
  name: "Administrator",
  email: "admin@siat.ac.id",
  password,
  role: "ADMIN",
  isActive: true,
  mustChangePassword: false
});

console.log("Admin created");
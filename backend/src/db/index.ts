import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

import { env } from "../config/env.js";

let connection;

try {
  connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  });

  console.log(
    "✅ Database connected successfully"
  );
} catch (error) {
  console.error(
    "❌ Failed to connect database"
  );

  console.error(error);

  process.exit(1);
}

export const db = drizzle(connection);
import { Router } from "express";

import {
  createMataKuliah,
  getAllMataKuliah,
  getMataKuliahById,
  getMataKuliahByProdi,
  updateMataKuliah,
  deleteMataKuliah,
} from "./mataKuliahController.js";

import { verifyToken } from "../../middleware/verifyToken.js";
import { authorizeRole } from "../../middleware/authorizeRole.js";

const router = Router();

// GET semua mata kuliah (semua role bisa lihat)
router.get(
  "/",
  verifyToken,
  getAllMataKuliah
);

// GET mata kuliah by ID
router.get(
  "/:id",
  verifyToken,
  getMataKuliahById
);

// GET mata kuliah by prodi
router.get(
  "/prodi/:prodiId",
  verifyToken,
  getMataKuliahByProdi
);

// CREATE (admin only)
router.post(
  "/",
  verifyToken,
  authorizeRole("ADMIN"),
  createMataKuliah
);

// UPDATE (admin only)
router.put(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateMataKuliah
);

// DELETE (admin only)
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteMataKuliah
);

export default router;
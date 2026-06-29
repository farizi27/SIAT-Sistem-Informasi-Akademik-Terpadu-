import { Router } from "express";

import {
  createKelas,
  getAllKelas,
  getKelasById,
  updateKelas,
  deleteKelas,
  getKelasByDosen,
  getKelasByProdi,
} from "./kelasController.js";

import { verifyToken } from "../../middleware/verifyToken.js";
import { authorizeRole } from "../../middleware/authorizeRole.js";

const router = Router();

// GET semua kelas (admin, dosen, mahasiswa bisa lihat)
router.get(
  "/",
  verifyToken,
  getAllKelas
);

// GET kelas berdasarkan dosen (HARUS sebelum /:id agar tidak bentrok)
router.get(
  "/dosen/:dosenId",
  verifyToken,
  getKelasByDosen
);

// GET kelas berdasarkan prodi (HARUS sebelum /:id agar tidak bentrok)
router.get(
  "/prodi/:prodiId",
  verifyToken,
  getKelasByProdi
);

// GET kelas by ID
router.get(
  "/:id",
  verifyToken,
  getKelasById
);

// CREATE kelas (admin only)
router.post(
  "/",
  verifyToken,
  authorizeRole("ADMIN"),
  createKelas
);

// UPDATE kelas (admin only)
router.put(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateKelas
);

// DELETE kelas (admin only)
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteKelas
);

export default router;
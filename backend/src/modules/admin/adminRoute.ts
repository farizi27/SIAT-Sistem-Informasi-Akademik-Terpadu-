import { Router } from "express";

import {
  createMahasiswa,
  getAllMahasiswa,
  getMahasiswaById,
  updateMahasiswa,
  deleteMahasiswa,
} from "./adminController.js";

import {
  verifyToken,
} from "../../middleware/verifyToken.js";

import {
  authorizeRole,
} from "../../middleware/authorizeRole.js";

import
 {createDosen,
  getDosenById,
  updateDosen,
  getAllDosen,
  deleteDosen,
  getDashboard} from "./adminController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| MAHASISWA
|--------------------------------------------------------------------------
*/

// Create Mahasiswa
router.post(
  "/mahasiswa",
  verifyToken,
  authorizeRole("ADMIN"),
  createMahasiswa
);

// Get Semua Mahasiswa
router.get(
  "/mahasiswa",
  verifyToken,
  authorizeRole("ADMIN"),
  getAllMahasiswa
);

// Get Mahasiswa By ID
router.get(
  "/mahasiswa/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  getMahasiswaById
);

// Update Mahasiswa
router.put(
  "/mahasiswa/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateMahasiswa
);

// Soft Delete Mahasiswa
router.delete(
  "/mahasiswa/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteMahasiswa
);

// Create Dosen
router.post(
  "/dosen",
  verifyToken,
  authorizeRole("ADMIN"),
  createDosen
);

// Get Dosen By ID
router.get(
  "/dosen/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  getDosenById
);

// Update Dosen
router.put(
  "/dosen/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateDosen
);

// Delete Dosen
router.delete(
  "/dosen/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteDosen
);

// Get All Dosen
router.get(
  "/dosen",
  verifyToken,
  authorizeRole("ADMIN"),
  getAllDosen
);

// Get Dashboard Stats
router.get(
  "/dashboard",
  verifyToken,
  authorizeRole("ADMIN"),
  getDashboard
);

export default router;
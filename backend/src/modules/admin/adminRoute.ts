import { Router } from "express";

import {
  createMahasiswa,
  getAllMahasiswa,
  getMahasiswaById,
  updateMahasiswa,
  deleteMahasiswa,
  createDosen,
  getAllDosen,
  getDosenById,
  updateDosen,
  deleteDosen,
  toggleUserStatus,
  resetPassword,
  getDashboard,
} from "./adminController.js";

import { verifyToken } from "../../middleware/verifyToken.js";
import { authorizeRole } from "../../middleware/authorizeRole.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| MAHASISWA
|--------------------------------------------------------------------------
*/

router.post(
  "/mahasiswa",
  verifyToken,
  authorizeRole("ADMIN"),
  createMahasiswa
);

router.get(
  "/mahasiswa",
  verifyToken,
  authorizeRole("ADMIN"),
  getAllMahasiswa
);

router.get(
  "/mahasiswa/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  getMahasiswaById
);

router.put(
  "/mahasiswa/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateMahasiswa
);

router.delete(
  "/mahasiswa/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteMahasiswa
);

/*
|--------------------------------------------------------------------------
| DOSEN
|--------------------------------------------------------------------------
*/

router.post(
  "/dosen",
  verifyToken,
  authorizeRole("ADMIN"),
  createDosen
);

router.get(
  "/dosen",
  verifyToken,
  authorizeRole("ADMIN"),
  getAllDosen
);

router.get(
  "/dosen/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  getDosenById
);

router.put(
  "/dosen/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateDosen
);

router.delete(
  "/dosen/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteDosen
);

/*
|--------------------------------------------------------------------------
| USER MANAGEMENT (Toggle Status & Reset Password)
|--------------------------------------------------------------------------
*/

// Toggle aktif/nonaktif akun user berdasarkan userId
router.patch(
  "/users/:userId/toggle-status",
  verifyToken,
  authorizeRole("ADMIN"),
  toggleUserStatus
);

// Reset password user ke NIM (mahasiswa) atau NIDN (dosen)
router.post(
  "/users/:userId/reset-password",
  verifyToken,
  authorizeRole("ADMIN"),
  resetPassword
);

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

// Dashboard accessible by all authenticated users (stats disesuaikan per role di frontend)
router.get(
  "/dashboard",
  verifyToken,
  getDashboard
);

export default router;
import { Router } from "express";

import {
  getAllKRS,
  getKRSById,
  getKRSByMahasiswa,
  createKRS,
  updateKRS,
  updateKRSStatus,
  updateNilaiKRS,
  deleteKRS,
} from "./krsController.js";

import { verifyToken } from "../../middleware/verifyToken.js";
import { authorizeRole } from "../../middleware/authorizeRole.js";

const router = Router();

// GET semua KRS (admin only)
router.get(
  "/",
  verifyToken,
  authorizeRole("ADMIN"),
  getAllKRS
);

// GET KRS by ID
router.get(
  "/:id",
  verifyToken,
  getKRSById
);

// GET KRS by Mahasiswa ID (mahasiswa, dosen, admin)
router.get(
  "/mahasiswa/:mahasiswaId",
  verifyToken,
  getKRSByMahasiswa
);

// CREATE KRS (mahasiswa & admin)
router.post(
  "/",
  verifyToken,
  createKRS
);

// UPDATE KRS - ganti mahasiswa/kelas (admin only)
router.put(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateKRS
);

// UPDATE STATUS KRS - DRAFT/DISETUJUI/DITOLAK (admin only)
router.patch(
  "/:id/status",
  verifyToken,
  authorizeRole("ADMIN"),
  updateKRSStatus
);

// UPDATE NILAI KRS - input nilai (admin & dosen)
router.patch(
  "/:id/nilai",
  verifyToken,
  updateNilaiKRS
);

// DELETE KRS (admin only)
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteKRS
);

export default router;

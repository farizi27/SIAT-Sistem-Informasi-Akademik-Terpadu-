import { Router } from "express";

import {
  createSemester,
  getAllSemester,
  getSemesterById,
  getActiveSemester,
  updateSemester,
  deleteSemester,
} from "./semesterController.js";

import { verifyToken } from "../../middleware/verifyToken.js";
import { authorizeRole } from "../../middleware/authorizeRole.js";

const router = Router();

// GET semester aktif (semua role bisa lihat)
router.get(
  "/active",
  verifyToken,
  getActiveSemester
);

// GET semua semester (semua role bisa lihat)
router.get(
  "/",
  verifyToken,
  getAllSemester
);

// GET semester by ID
router.get(
  "/:id",
  verifyToken,
  getSemesterById
);

// CREATE (admin only)
router.post(
  "/",
  verifyToken,
  authorizeRole("ADMIN"),
  createSemester
);

// UPDATE (admin only)
router.put(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateSemester
);

// DELETE (admin only)
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteSemester
);

export default router;
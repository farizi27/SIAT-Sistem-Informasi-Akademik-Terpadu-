import { Router } from "express";

import {
  getDosenProfile,
  updateDosenProfile,
  changeDosenPasswordCtrl,
} from "./dosenController.js";

import { verifyToken } from "../../middleware/verifyToken.js";
import { authorizeRole } from "../../middleware/authorizeRole.js";

const router = Router();

// GET profil dosen (dosen only)
router.get(
  "/profile",
  verifyToken,
  authorizeRole("DOSEN"),
  getDosenProfile
);

// PUT update profil dosen (dosen only)
router.put(
  "/profile",
  verifyToken,
  authorizeRole("DOSEN"),
  updateDosenProfile
);

// PATCH ubah password (dosen only)
router.patch(
  "/password",
  verifyToken,
  authorizeRole("DOSEN"),
  changeDosenPasswordCtrl
);

export default router;

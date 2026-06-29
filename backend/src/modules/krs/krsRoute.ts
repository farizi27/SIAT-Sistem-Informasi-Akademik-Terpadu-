import { Router } from "express";

import {
  getAllKRS,
  getKRSById,
  createKRS,
  updateKRS,
  deleteKRS,
} from "./krsController.js";

import {
  verifyToken,
} from "../../middleware/verifyToken.js";

import {
  authorizeRole,
} from "../../middleware/authorizeRole.js";

const router = Router();

// Get All KRS
router.get(
  "/",
  verifyToken,
  getAllKRS
);

// Get KRS By ID
router.get(
  "/:id",
  verifyToken,
  getKRSById
);

// Create KRS
router.post(
  "/",
  verifyToken,
  createKRS
);

// Update KRS
router.put(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateKRS
);

// Delete KRS
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteKRS
);

export default router;

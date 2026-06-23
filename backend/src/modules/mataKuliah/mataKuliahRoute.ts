import { Router } from "express";

import {
  createMataKuliah,
  getAllMataKuliah,
  getMataKuliahById,
  updateMataKuliah,
  deleteMataKuliah,
} from "./mataKuliahController.js";

import {
  verifyToken,
} from "../../middleware/verifyToken.js";

import {
  authorizeRole,
} from "../../middleware/authorizeRole.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  authorizeRole("ADMIN"),
  createMataKuliah
);

router.get(
  "/",
  verifyToken,
  authorizeRole("ADMIN"),
  getAllMataKuliah
);

router.get(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  getMataKuliahById
);

router.put(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateMataKuliah
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteMataKuliah
);

export default router;
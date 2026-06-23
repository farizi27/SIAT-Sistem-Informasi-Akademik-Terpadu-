import { Router } from "express";

import {
  createKelas,
  getAllKelas,
  getKelasById,
  updateKelas,
  deleteKelas,
} from "./kelasController.js";

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
  createKelas
);

router.get(
  "/",
  verifyToken,
  authorizeRole("ADMIN"),
  getAllKelas
);

router.get(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  getKelasById
);

router.put(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateKelas
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteKelas
);

export default router;
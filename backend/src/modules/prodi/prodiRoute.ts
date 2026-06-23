import { Router } from "express";

import {
  createProdi,
  getAllProdi,
  getProdiById,
  updateProdi,
  deleteProdi,
} from "./prodiController.js";

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
  createProdi
);

router.get(
  "/",
  verifyToken,
  authorizeRole("ADMIN"),
  getAllProdi
);

router.get(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  getProdiById
);

router.put(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateProdi
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteProdi
);

export default router;
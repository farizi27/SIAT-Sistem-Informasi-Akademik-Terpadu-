import { Router } from "express";

import {
  createSemester,
  getAllSemester,
  getSemesterById,
  updateSemester,
  deleteSemester,
} from "./semesterController.js";

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
  createSemester
);

router.get(
  "/",
  verifyToken,
  authorizeRole("ADMIN"),
  getAllSemester
);

router.get(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  getSemesterById
);

router.put(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  updateSemester
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteSemester
);

export default router;
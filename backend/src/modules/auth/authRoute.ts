import { Router } from "express";
import {
  verifyToken,
} from "../../middleware/verifyToken.js";
import { login, getProfile, changePassword} from "./authController.js";

const router = Router();

router.post("/login", login);
router.get("/me", verifyToken, getProfile);
router.put("/change-password", verifyToken, changePassword);

export default router;
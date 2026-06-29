import express from "express";
import cors from "cors";
import { verifyToken }
from "./middleware/verifyToken.js";
import { authorizeRole }
from "./middleware/authorizeRole.js";
import adminRoute
from "./modules/admin/adminRoute.js";
import authRoutes from "./modules/auth/authRoute.js";
import prodiRoute
from "./modules/prodi/prodiRoute.js";
import semesterRoute
from "./modules/semester/semesterRoute.js";
import mataKuliahRoute
from "./modules/mataKuliah/mataKuliahRoute.js";
import kelasRoute
from "./modules/kelas/kelasRoute.js";
import krsRoute
from "./modules/krs/krsRoute.js";



const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.get(
  "/api/test",
  verifyToken,
  (req, res) => {
    res.json({
      message: "Token valid",
      user: req.user,
    });
  }
);
app.get(
  "/api/admin-test",
  verifyToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.json({
      message:
        "Halo Admin, akses diterima",
    });
  }
);
app.use(
  "/api/admin",
  adminRoute
);
app.use(
  "/api/prodi",
  prodiRoute
);
app.use(
  "/api/semester",
  semesterRoute
);
app.use(
  "/api/mata-kuliah",
  mataKuliahRoute
);
app.use(
  "/api/kelas",
  kelasRoute
);
app.use(
  "/api/krs",
  krsRoute
);
export default app;
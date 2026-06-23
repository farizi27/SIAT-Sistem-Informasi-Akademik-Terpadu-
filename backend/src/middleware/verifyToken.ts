import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

const SECRET_KEY =
  process.env.JWT_SECRET ||
  "RAHASIA_NEGARA";

export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    // Ambil Authorization Header
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Token tidak ditemukan",
      });
    }

    // Format:
    // Bearer TOKEN
    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Format token tidak valid",
      });
    }

    // Verifikasi JWT
    const decoded = jwt.verify(
      token,
      SECRET_KEY
    ) as {
      id: number;
      role: string;
    };

    // Simpan user ke request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();

  } catch (error) {

    // Token expired
    if (
      error instanceof jwt.TokenExpiredError
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Token telah kedaluwarsa",
      });
    }

    // Token invalid
    if (
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Token tidak valid",
      });
    }

    // Error lain
    return res.status(500).json({
      success: false,
      message:
        "Terjadi kesalahan pada server",
    });
  }
}
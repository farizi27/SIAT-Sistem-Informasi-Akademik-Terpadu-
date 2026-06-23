import type {
  Request,
  Response,
  NextFunction,
} from "express";

export function authorizeRole(
  ...allowedRoles: string[]
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    // User belum login / token belum diverifikasi
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Anda belum terautentikasi",
      });
    }

    // Role tidak memiliki akses
    if (
      !allowedRoles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Anda tidak memiliki hak akses untuk resource ini",
      });
    }

    next();
  };
}
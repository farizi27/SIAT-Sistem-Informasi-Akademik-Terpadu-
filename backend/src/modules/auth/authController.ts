import type{ Request, Response } from "express";

import { loginService, getProfileService, changePasswordService } from "./authService.js";
import { validateLogin, validateChangePassword} from "./authValidation.js";

export async function login(
  req: Request,
  res: Response
) {
  try {
    const validation = validateLogin(
      req.body
    );

    if (!validation.isValid) {
      return res.status(400).json({
        message: "Validation Error",
        errors: validation.errors,
      });
    }

    const { email, password } = req.body;

    const result = await loginService(
      email,
      password
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Login gagal",
    });
  }
}

// get profile
export async function getProfile(
  req: Request,
  res: Response
) {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    const result =
      await getProfileService(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan",
    });
  }
}

// change password
export async function changePassword(
  req: Request,
  res: Response
) {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    const validation =
      validateChangePassword(
        req.body
      );

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message:
          "Validasi gagal",
        errors:
          validation.errors,
      });
    }

    const result =
      await changePasswordService(
        req.user.id,
        req.body.oldPassword,
        req.body.newPassword
      );

    return res.status(200).json({
      success: true,
      message:
        result.message,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan",
    });
  }
}
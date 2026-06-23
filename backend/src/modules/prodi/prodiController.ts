import type {
  Request,
  Response,
} from "express";

import {
  createProdiService,
  getAllProdiService,
  getProdiByIdService,
  updateProdiService,
  deleteProdiService,
} from "./prodiService.js";

import {
  validateCreateProdi,
  validateUpdateProdi,
} from "./prodiValidation.js";

/*
|--------------------------------------------------------------------------
| CREATE PRODI
|--------------------------------------------------------------------------
*/

export async function createProdi(
  req: Request,
  res: Response
) {
  try {

    const validation =
      validateCreateProdi(
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
      await createProdiService(
        req.body
      );

    return res.status(201).json({
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

/*
|--------------------------------------------------------------------------
| GET ALL PRODI
|--------------------------------------------------------------------------
*/

export async function getAllProdi(
  req: Request,
  res: Response
) {
  try {

    const result =
      await getAllProdiService();

    return res.status(200).json({
      success: true,
      message:
        "Data prodi berhasil diambil",
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan pada server",
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET PRODI BY ID
|--------------------------------------------------------------------------
*/

export async function getProdiById(
  req: Request,
  res: Response
) {
  try {

    const id =
      Number(req.params.id);

    const result =
      await getProdiByIdService(
        id
      );

    return res.status(200).json({
      success: true,
      message:
        "Data prodi berhasil ditemukan",
      data: result,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Prodi tidak ditemukan",
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE PRODI
|--------------------------------------------------------------------------
*/

export async function updateProdi(
  req: Request,
  res: Response
) {
  try {

    const id =
      Number(req.params.id);

    const validation =
      validateUpdateProdi(
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
      await updateProdiService(
        id,
        req.body
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

/*
|--------------------------------------------------------------------------
| DELETE PRODI
|--------------------------------------------------------------------------
*/

export async function deleteProdi(
  req: Request,
  res: Response
) {
  try {

    const id =
      Number(req.params.id);

    const result =
      await deleteProdiService(
        id
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
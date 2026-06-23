import type {
  Request,
  Response,
} from "express";

import {
  createKelasService,
  getAllKelasService,
  getKelasByIdService,
  updateKelasService,
  deleteKelasService,
} from "./kelasService.js";

import {
  validateCreateKelas,
  validateUpdateKelas,
} from "./kelasValidation.js";

/*
|--------------------------------------------------------------------------
| CREATE KELAS
|--------------------------------------------------------------------------
*/

export async function createKelas(
  req: Request,
  res: Response
) {
  try {

    const validation =
      validateCreateKelas(
        req.body
      );

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: validation.errors,
      });
    }

    const result =
      await createKelasService(
        req.body
      );

    return res.status(201).json({
      success: true,
      message: result.message,
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
| GET ALL KELAS
|--------------------------------------------------------------------------
*/

export async function getAllKelas(
  req: Request,
  res: Response
) {
  try {

    const result =
      await getAllKelasService();

    return res.status(200).json({
      success: true,
      message:
        "Data kelas berhasil diambil",
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal mengambil data kelas",
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET KELAS BY ID
|--------------------------------------------------------------------------
*/

export async function getKelasById(
  req: Request,
  res: Response
) {
  try {

    const id =
      Number(req.params.id);

    const result =
      await getKelasByIdService(
        id
      );

    return res.status(200).json({
      success: true,
      message:
        "Data kelas berhasil ditemukan",
      data: result,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Kelas tidak ditemukan",
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE KELAS
|--------------------------------------------------------------------------
*/

export async function updateKelas(
  req: Request,
  res: Response
) {
  try {

    const id =
      Number(req.params.id);

    const validation =
      validateUpdateKelas(
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
      await updateKelasService(
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
| DELETE KELAS
|--------------------------------------------------------------------------
*/

export async function deleteKelas(
  req: Request,
  res: Response
) {
  try {

    const id =
      Number(req.params.id);

    const result =
      await deleteKelasService(
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
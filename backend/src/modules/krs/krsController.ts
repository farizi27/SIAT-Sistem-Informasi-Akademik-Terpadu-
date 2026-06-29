import type {
  Request,
  Response,
} from "express";

import {
  getAllKRSService,
  getKRSByIdService,
  createKRSService,
  updateKRSService,
  deleteKRSService,
} from "./krsService.js";

/*
|--------------------------------------------------------------------------
| GET ALL KRS
|--------------------------------------------------------------------------
*/

export async function getAllKRS(
  req: Request,
  res: Response
) {
  try {

    const result = await getAllKRSService();

    return res.status(200).json({
      success: true,
      message: "Data KRS berhasil diambil",
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
| GET KRS BY ID
|--------------------------------------------------------------------------
*/

export async function getKRSById(
  req: Request,
  res: Response
) {
  try {

    const id = Number(req.params.id);

    const result = await getKRSByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Data KRS berhasil ditemukan",
      data: result,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "KRS tidak ditemukan",
    });

  }
}

/*
|--------------------------------------------------------------------------
| CREATE KRS
|--------------------------------------------------------------------------
*/

export async function createKRS(
  req: Request,
  res: Response
) {
  try {

    const { mahasiswaId, kelasId } = req.body;

    if (!mahasiswaId || !kelasId) {
      return res.status(400).json({
        success: false,
        message: "mahasiswaId dan kelasId wajib diisi",
      });
    }

    const result = await createKRSService({
      mahasiswaId: Number(mahasiswaId),
      kelasId: Number(kelasId),
    });

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
| UPDATE KRS
|--------------------------------------------------------------------------
*/

export async function updateKRS(
  req: Request,
  res: Response
) {
  try {

    const id = Number(req.params.id);
    const { mahasiswaId, kelasId } = req.body;

    if (!mahasiswaId || !kelasId) {
      return res.status(400).json({
        success: false,
        message: "mahasiswaId dan kelasId wajib diisi",
      });
    }

    const result = await updateKRSService(id, {
      mahasiswaId: Number(mahasiswaId),
      kelasId: Number(kelasId),
    });

    return res.status(200).json({
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
| DELETE KRS
|--------------------------------------------------------------------------
*/

export async function deleteKRS(
  req: Request,
  res: Response
) {
  try {

    const id = Number(req.params.id);

    const result = await deleteKRSService(id);

    return res.status(200).json({
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

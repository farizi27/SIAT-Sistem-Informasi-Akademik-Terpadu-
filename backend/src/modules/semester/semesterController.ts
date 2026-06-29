import type { Request, Response } from "express";

import {
  createSemesterService,
  getAllSemesterService,
  getSemesterByIdService,
  getActiveSemesterService,
  updateSemesterService,
  deleteSemesterService,
} from "./semesterService.js";

import {
  validateCreateSemester,
  validateUpdateSemester,
} from "./semesterValidation.js";

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export async function createSemester(req: Request, res: Response) {
  try {
    const validation = validateCreateSemester(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: validation.errors,
      });
    }

    const result = await createSemesterService(req.body);
    return res.status(201).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan",
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

export async function getAllSemester(req: Request, res: Response) {
  try {
    const result = await getAllSemesterService();
    return res.status(200).json({
      success: true,
      message: "Data semester berhasil diambil",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data semester",
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET SEMESTER AKTIF
|--------------------------------------------------------------------------
*/

export async function getActiveSemester(req: Request, res: Response) {
  try {
    const result = await getActiveSemesterService();
    return res.status(200).json({
      success: true,
      message: result
        ? "Semester aktif ditemukan"
        : "Tidak ada semester yang aktif",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil semester aktif",
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

export async function getSemesterById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await getSemesterByIdService(id);
    return res.status(200).json({
      success: true,
      message: "Data semester ditemukan",
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Semester tidak ditemukan",
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export async function updateSemester(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const validation = validateUpdateSemester(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: validation.errors,
      });
    }

    const result = await updateSemesterService(id, req.body);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan",
    });
  }
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export async function deleteSemester(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await deleteSemesterService(id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan",
    });
  }
}
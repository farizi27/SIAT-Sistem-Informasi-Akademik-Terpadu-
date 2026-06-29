import type { Request, Response } from "express";

import {
  createMataKuliahService,
  getAllMataKuliahService,
  getMataKuliahByIdService,
  getMataKuliahByProdiService,
  updateMataKuliahService,
  deleteMataKuliahService,
} from "./mataKuliahService.js";

import {
  validateCreateMataKuliah,
  validateUpdateMataKuliah,
} from "./mataKuliahValidation.js";

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export async function createMataKuliah(req: Request, res: Response) {
  try {
    const validation = validateCreateMataKuliah(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: validation.errors,
      });
    }

    const result = await createMataKuliahService(req.body);
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

export async function getAllMataKuliah(req: Request, res: Response) {
  try {
    const result = await getAllMataKuliahService();
    return res.status(200).json({
      success: true,
      message: "Data mata kuliah berhasil diambil",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengambil data mata kuliah",
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

export async function getMataKuliahById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await getMataKuliahByIdService(id);
    return res.status(200).json({
      success: true,
      message: "Data mata kuliah berhasil ditemukan",
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Mata kuliah tidak ditemukan",
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET BY PRODI
|--------------------------------------------------------------------------
*/

export async function getMataKuliahByProdi(req: Request, res: Response) {
  try {
    const prodiId = Number(req.params.prodiId);
    const result = await getMataKuliahByProdiService(prodiId);
    return res.status(200).json({
      success: true,
      message: "Data mata kuliah prodi berhasil diambil",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan",
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export async function updateMataKuliah(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const validation = validateUpdateMataKuliah(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: validation.errors,
      });
    }

    const result = await updateMataKuliahService(id, req.body);
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

export async function deleteMataKuliah(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await deleteMataKuliahService(id);
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
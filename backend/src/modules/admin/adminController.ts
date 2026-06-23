import type {
  Request,
  Response,
} from "express";

import {
  createMahasiswaService,
  getAllMahasiswaService,
  getMahasiswaByIdService,
  updateMahasiswaService,
  deleteMahasiswaService
} from "./adminService.js";

import {
  validateCreateMahasiswa,
  validateUpdateMahasiswa
} from "./adminValidation.js";


import 
  {createDosenService,
  getDosenByIdService,
  updateDosenService,
  getAllDosenService,
  deleteDosenService,
  getDashboardService
} from "./adminService.js";
import {validateCreateDosen} from "./adminValidation.js";
/*
|--------------------------------------------------------------------------
| CREATE MAHASISWA
|--------------------------------------------------------------------------
*/

export async function createMahasiswa(
  req: Request,
  res: Response
) {
  try {

    const validation =
      validateCreateMahasiswa(
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
      await createMahasiswaService(
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Mahasiswa berhasil dibuat",
      data: result,
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
| GET ALL MAHASISWA
|--------------------------------------------------------------------------
*/

export async function getAllMahasiswa(
  req: Request,
  res: Response
) {
  try {

    const result =
      await getAllMahasiswaService();

    return res.status(200).json({
      success: true,
      message:
        "Data mahasiswa berhasil diambil",
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        "Terjadi kesalahan pada server",
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET MAHASISWA BY ID
|--------------------------------------------------------------------------
*/

export async function getMahasiswaById(
  req: Request,
  res: Response
) {
  try {

    const id = Number(
      req.params.id
    );

    const result =
      await getMahasiswaByIdService(
        id
      );

    return res.status(200).json({
      success: true,
      message:
        "Data mahasiswa berhasil ditemukan",
      data: result,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Mahasiswa tidak ditemukan",
    });
  }
}

// update mahasiswa
export async function updateMahasiswa(
  req: Request,
  res: Response
) {
  try {

    const id =
      Number(req.params.id);

    const validation =
      validateUpdateMahasiswa(
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
      await updateMahasiswaService(
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

// delete mahasiswa
export async function deleteMahasiswa(
  req: Request,
  res: Response
) {
  try {

    const id =
      Number(req.params.id);

    const result =
      await deleteMahasiswaService(
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

// dosen
export async function createDosen(
  req: Request,
  res: Response
) {
  try {

    const validation =
      validateCreateDosen(
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
      await createDosenService(
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Dosen berhasil dibuat",
      data: result,
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

// get dosen by id
export async function getDosenById(
  req: Request,
  res: Response
) {
  try {

    const id =
      Number(req.params.id);

    const result =
      await getDosenByIdService(
        id
      );

    return res.status(200).json({
      success: true,
      message:
        "Data dosen berhasil ditemukan",
      data: result,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Dosen tidak ditemukan",
    });
  }
}

// update dosen
export async function updateDosen(
  req: Request,
  res: Response
) {
  try {

    const id =
      Number(req.params.id);

    const result =
      await updateDosenService(
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

// delete dosen
export async function deleteDosen(
  req: Request,
  res: Response
) {
  try {

    const id =
      Number(req.params.id);

    const result =
      await deleteDosenService(
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

// get all dosen
export async function getAllDosen(
  req: Request,
  res: Response
) {
  try {

    const result =
      await getAllDosenService();

    return res.status(200).json({
      success: true,
      message:
        "Data dosen berhasil diambil",
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

// =========
// dashboard stats
// =========
export async function getDashboard(
  req: Request,
  res: Response
) {
  try {

    const result =
      await getDashboardService();

    return res.status(200).json({
      success: true,
      message:
        "Data dashboard berhasil diambil",
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
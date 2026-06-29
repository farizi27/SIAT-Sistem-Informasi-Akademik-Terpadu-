interface CreateSemesterInput {
  tahunAjaran?: string;
  periode?: string;
  isActive?: unknown;
}

export function validateCreateSemester(data: CreateSemesterInput) {
  const errors: string[] = [];

  if (!data.tahunAjaran?.trim()) {
    errors.push("Tahun ajaran wajib diisi");
  } else if (!/^\d{4}\/\d{4}$/.test(data.tahunAjaran.trim())) {
    // Contoh format: 2024/2025
    errors.push("Format tahun ajaran tidak valid. Gunakan format: 2024/2025");
  }

  if (!data.periode?.trim()) {
    errors.push("Periode wajib diisi");
  } else if (!["GANJIL", "GENAP"].includes(data.periode.toUpperCase())) {
    errors.push("Periode harus GANJIL atau GENAP");
  }

  return { isValid: errors.length === 0, errors };
}

export function validateUpdateSemester(data: CreateSemesterInput) {
  const errors: string[] = [];

  if (data.tahunAjaran !== undefined && data.tahunAjaran.trim()) {
    if (!/^\d{4}\/\d{4}$/.test(data.tahunAjaran.trim())) {
      errors.push("Format tahun ajaran tidak valid. Gunakan format: 2024/2025");
    }
  }

  if (data.periode !== undefined) {
    if (!["GANJIL", "GENAP"].includes(data.periode.toUpperCase())) {
      errors.push("Periode harus GANJIL atau GENAP");
    }
  }

  return { isValid: errors.length === 0, errors };
}
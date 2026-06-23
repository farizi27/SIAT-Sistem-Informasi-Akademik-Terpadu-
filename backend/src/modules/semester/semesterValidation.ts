interface CreateSemesterInput {
  tahunAjaran?: string;
  periode?: string;
}

export function validateCreateSemester(
  data: CreateSemesterInput
) {
  const errors: string[] = [];

  if (!data.tahunAjaran?.trim()) {
    errors.push(
      "Tahun ajaran wajib diisi"
    );
  }

  if (!data.periode?.trim()) {
    errors.push(
      "Periode wajib diisi"
    );
  }

  if (
    data.periode &&
    !["GANJIL", "GENAP"].includes(
      data.periode
    )
  ) {
    errors.push(
      "Periode harus GANJIL atau GENAP"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUpdateSemester(
  data: CreateSemesterInput
) {
  const errors: string[] = [];

  if (
    data.periode &&
    !["GANJIL", "GENAP"].includes(
      data.periode
    )
  ) {
    errors.push(
      "Periode harus GANJIL atau GENAP"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
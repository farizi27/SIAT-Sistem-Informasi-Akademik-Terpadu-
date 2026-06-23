interface CreateProdiInput {
  kode?: string;
  nama?: string;
}

export function validateCreateProdi(
  data: CreateProdiInput
) {
  const errors: string[] = [];

  if (!data.kode?.trim()) {
    errors.push("Kode prodi wajib diisi");
  }

  if (!data.nama?.trim()) {
    errors.push("Nama prodi wajib diisi");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUpdateProdi(
  data: CreateProdiInput
) {
  const errors: string[] = [];

  if (
    data.kode &&
    data.kode.trim().length < 2
  ) {
    errors.push(
      "Kode prodi minimal 2 karakter"
    );
  }

  if (
    data.nama &&
    data.nama.trim().length < 3
  ) {
    errors.push(
      "Nama prodi minimal 3 karakter"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
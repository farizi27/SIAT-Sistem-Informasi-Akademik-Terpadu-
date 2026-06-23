interface CreateMataKuliahInput {
  kode?: string;
  nama?: string;
  sks?: number;
  semester?: number;
  prodiId?: number;
}

export function validateCreateMataKuliah(
  data: CreateMataKuliahInput
) {
  const errors: string[] = [];

  if (!data.kode?.trim()) {
    errors.push(
      "Kode mata kuliah wajib diisi"
    );
  }

  if (!data.nama?.trim()) {
    errors.push(
      "Nama mata kuliah wajib diisi"
    );
  }

  if (!data.sks) {
    errors.push(
      "SKS wajib diisi"
    );
  }

  if (
    data.sks &&
    (data.sks < 1 || data.sks > 6)
  ) {
    errors.push(
      "SKS harus antara 1 sampai 6"
    );
  }

  if (!data.semester) {
    errors.push(
      "Semester wajib diisi"
    );
  }

  if (!data.prodiId) {
    errors.push(
      "Prodi wajib dipilih"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUpdateMataKuliah(
  data: CreateMataKuliahInput
) {
  const errors: string[] = [];

  if (
    data.sks &&
    (data.sks < 1 || data.sks > 6)
  ) {
    errors.push(
      "SKS harus antara 1 sampai 6"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
interface CreateKelasInput {
  kodeKelas?: string;
  mataKuliahId?: number;
  dosenId?: number;
  semesterId?: number;
  kapasitas?: number;
}

export function validateCreateKelas(
  data: CreateKelasInput
) {
  const errors: string[] = [];

  if (!data.kodeKelas?.trim()) {
    errors.push(
      "Kode kelas wajib diisi"
    );
  }

  if (!data.mataKuliahId) {
    errors.push(
      "Mata kuliah wajib dipilih"
    );
  }

  if (!data.dosenId) {
    errors.push(
      "Dosen wajib dipilih"
    );
  }

  if (!data.semesterId) {
    errors.push(
      "Semester wajib dipilih"
    );
  }

  if (!data.kapasitas) {
    errors.push(
      "Kapasitas wajib diisi"
    );
  }

  if (
    data.kapasitas &&
    data.kapasitas < 1
  ) {
    errors.push(
      "Kapasitas minimal 1"
    );
  }

  return {
    isValid:
      errors.length === 0,
    errors,
  };
}

export function validateUpdateKelas(
  data: CreateKelasInput
) {
  const errors: string[] = [];

  if (
    data.kapasitas &&
    data.kapasitas < 1
  ) {
    errors.push(
      "Kapasitas minimal 1"
    );
  }

  return {
    isValid:
      errors.length === 0,
    errors,
  };
}
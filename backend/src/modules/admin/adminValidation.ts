interface CreateMahasiswaInput {
  name?: string;
  email?: string;
  nim?: string;
  prodi?: string;
  angkatan?: number;
}

export function validateCreateMahasiswa(
  data: CreateMahasiswaInput
) {
  const errors: string[] = [];

  /*
  |--------------------------------------------------------------------------
  | Nama
  |--------------------------------------------------------------------------
  */

  if (!data.name?.trim()) {
    errors.push(
      "Nama wajib diisi"
    );
  } else if (
    data.name.trim().length < 3
  ) {
    errors.push(
      "Nama minimal 3 karakter"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Email
  |--------------------------------------------------------------------------
  */

  if (!data.email?.trim()) {
    errors.push(
      "Email wajib diisi"
    );
  } else {

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        data.email
      )
    ) {
      errors.push(
        "Format email tidak valid"
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | NIM
  |--------------------------------------------------------------------------
  */

  if (!data.nim?.trim()) {
    errors.push(
      "NIM wajib diisi"
    );
  } else {

    const nimRegex =
      /^\d+$/;

    if (
      !nimRegex.test(
        data.nim
      )
    ) {
      errors.push(
        "NIM hanya boleh berisi angka"
      );
    }

    if (
      data.nim.length < 8
    ) {
      errors.push(
        "NIM minimal 8 digit"
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Prodi
  |--------------------------------------------------------------------------
  */

  if (!data.prodi?.trim()) {
    errors.push(
      "Program studi wajib diisi"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Angkatan
  |--------------------------------------------------------------------------
  */

  if (!data.angkatan) {
    errors.push(
      "Angkatan wajib diisi"
    );
  } else {

    const currentYear =
      new Date().getFullYear();

    if (
      data.angkatan < 2000 ||
      data.angkatan >
      currentYear + 1
    ) {
      errors.push(
        "Angkatan tidak valid"
      );
    }
  }

  return {
    isValid:
      errors.length === 0,
    errors,
  };
}

// update mahasiswa validation
interface UpdateMahasiswaInput {
  name?: string;
  email?: string;
  prodi?: string;
  angkatan?: number;
}

export function validateUpdateMahasiswa(
  data: UpdateMahasiswaInput
) {
  const errors: string[] = [];

  if (
    data.name &&
    data.name.trim().length < 3
  ) {
    errors.push(
      "Nama minimal 3 karakter"
    );
  }

  if (data.email) {

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        data.email
      )
    ) {
      errors.push(
        "Format email tidak valid"
      );
    }
  }

  if (
    data.angkatan
  ) {
    const currentYear =
      new Date().getFullYear();

    if (
      data.angkatan < 2000 ||
      data.angkatan >
      currentYear + 1
    ) {
      errors.push(
        "Angkatan tidak valid"
      );
    }
  }

  return {
    isValid:
      errors.length === 0,
    errors,
  };
}

// ______
// dosen
// ______
// create dosen
interface CreateDosenInput {
  name?: string;
  email?: string;
  nidn?: string;
}

export function validateCreateDosen(
  data: CreateDosenInput
) {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push(
      "Nama wajib diisi"
    );
  }

  if (!data.email?.trim()) {
    errors.push(
      "Email wajib diisi"
    );
  } else {

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        data.email
      )
    ) {
      errors.push(
        "Format email tidak valid"
      );
    }
  }

  if (!data.nidn?.trim()) {
    errors.push(
      "NIDN wajib diisi"
    );
  }

  return {
    isValid:
      errors.length === 0,
    errors,
  };
}
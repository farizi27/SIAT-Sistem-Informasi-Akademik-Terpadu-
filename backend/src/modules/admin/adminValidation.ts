/*
|--------------------------------------------------------------------------
| MAHASISWA
|--------------------------------------------------------------------------
*/

interface CreateMahasiswaInput {
  name?: string;
  email?: string;
  password?: string;
  nim?: string;
  prodi?: number;
  angkatan?: number;
}

export function validateCreateMahasiswa(data: CreateMahasiswaInput) {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push("Nama wajib diisi");
  } else if (data.name.trim().length < 3) {
    errors.push("Nama minimal 3 karakter");
  }

  if (!data.email?.trim()) {
    errors.push("Email wajib diisi");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Format email tidak valid");
    }
  }

  if (!data.nim?.trim()) {
    errors.push("NIM wajib diisi");
  } else {
    if (!/^\d+$/.test(data.nim)) {
      errors.push("NIM hanya boleh berisi angka");
    }
    if (data.nim.length < 8) {
      errors.push("NIM minimal 8 digit");
    }
  }

  if (!data.prodi || Number(data.prodi) <= 0) {
    errors.push("Program studi wajib dipilih");
  }

  if (!data.angkatan || Number(data.angkatan) <= 0) {
    errors.push("Angkatan wajib diisi");
  } else {
    const currentYear = new Date().getFullYear();
    const angkatanNum = Number(data.angkatan);
    if (angkatanNum < 2000 || angkatanNum > currentYear + 1) {
      errors.push("Angkatan tidak valid");
    }
  }

  return { isValid: errors.length === 0, errors };
}

interface UpdateMahasiswaInput {
  name?: string;
  email?: string;
  nim?: string;
  prodi?: number;
  angkatan?: number;
}

export function validateUpdateMahasiswa(data: UpdateMahasiswaInput) {
  const errors: string[] = [];

  if (data.name !== undefined && data.name.trim().length < 3) {
    errors.push("Nama minimal 3 karakter");
  }

  if (data.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Format email tidak valid");
    }
  }

  if (data.nim !== undefined) {
    if (!/^\d+$/.test(data.nim)) {
      errors.push("NIM hanya boleh berisi angka");
    }
    if (data.nim.length < 8) {
      errors.push("NIM minimal 8 digit");
    }
  }

  if (data.angkatan !== undefined) {
    const currentYear = new Date().getFullYear();
    const angkatanNum = Number(data.angkatan);
    if (angkatanNum < 2000 || angkatanNum > currentYear + 1) {
      errors.push("Angkatan tidak valid");
    }
  }

  return { isValid: errors.length === 0, errors };
}

/*
|--------------------------------------------------------------------------
| DOSEN
|--------------------------------------------------------------------------
*/

interface CreateDosenInput {
  name?: string;
  email?: string;
  nidn?: string;
  password?: string;
}

export function validateCreateDosen(data: CreateDosenInput) {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push("Nama wajib diisi");
  } else if (data.name.trim().length < 3) {
    errors.push("Nama minimal 3 karakter");
  }

  if (!data.email?.trim()) {
    errors.push("Email wajib diisi");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Format email tidak valid");
    }
  }

  if (!data.nidn?.trim()) {
    errors.push("NIDN wajib diisi");
  } else if (!/^\d+$/.test(data.nidn)) {
    errors.push("NIDN hanya boleh berisi angka");
  }

  return { isValid: errors.length === 0, errors };
}

interface UpdateDosenInput {
  name?: string;
  email?: string;
  nidn?: string;
}

export function validateUpdateDosen(data: UpdateDosenInput) {
  const errors: string[] = [];

  if (data.name !== undefined && data.name.trim().length < 3) {
    errors.push("Nama minimal 3 karakter");
  }

  if (data.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Format email tidak valid");
    }
  }

  if (data.nidn !== undefined && !/^\d+$/.test(data.nidn)) {
    errors.push("NIDN hanya boleh berisi angka");
  }

  return { isValid: errors.length === 0, errors };
}
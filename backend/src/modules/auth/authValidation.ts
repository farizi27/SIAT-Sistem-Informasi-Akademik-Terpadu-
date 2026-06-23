export function validateLogin(data: {
  email?: string;
  password?: string;
}) {
  const errors: string[] = [];

  if (!data.email) {
    errors.push("Email wajib diisi");
  }

  if (!data.password) {
    errors.push("Password wajib diisi");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// change password
interface ChangePasswordInput {
  oldPassword?: string;
  newPassword?: string;
}

export function validateChangePassword(
  data: ChangePasswordInput
) {
  const errors: string[] = [];

  if (!data.oldPassword) {
    errors.push(
      "Password lama wajib diisi"
    );
  }

  if (!data.newPassword) {
    errors.push(
      "Password baru wajib diisi"
    );
  } else {

    if (
      data.newPassword.length < 8
    ) {
      errors.push(
        "Password baru minimal 8 karakter"
      );
    }
  }

  return {
    isValid:
      errors.length === 0,
    errors,
  };
}
import { validate as isUUID } from "uuid";

function validateCreateUser(data) {
  const { name, password, email, birth_date } = data;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (typeof name !== "string" || name.trim() === "") {
    return createError(400, "Dado inválido", "name", "Nome não é válido");
  }
  if (name.trim().length < 3) {
    return createError(
      400,
      "Dado inválido",
      "name",
      "Nome deve ter 3 ou mais caracteres",
    );
  }

  if (typeof password !== "string" || password.trim().length < 8) {
    return createError(400, "Dado inválido", "password", "Senha não é válida");
  }

  if (typeof email !== "string" || email.trim() === "") {
    return createError(400, "Dado inválido", "email", "Email não é valido");
  }

  if (!emailRegex.test(email.trim())) {
    return createError(400, "Dado inválido", "email", "Email não é válido");
  }

  const birthDateError = validateBirthDate(birth_date);
  if (birthDateError) {
    return birthDateError;
  }

  return null;
}

function validateUpdateUser(data) {
  if ("name" in data) {
    if (typeof data.name !== "string" || data.name.trim().length < 3) {
      return createError(400, "Dado inválido", "name", "Nome inválido");
    }
  }

  if ("is_active" in data) {
    if (typeof data.is_active !== "boolean") {
      return createError(
        400,
        "Dado inválido",
        "is_active",
        "O campo is_active deve ser do tipo booleano (true ou false)",
      );
    }
  }

  if ("email" in data) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (typeof data.email !== "string" || !emailRegex.test(data.email.trim())) {
      return createError(400, "Dado inválido", "email", "Email inválido");
    }
  }

  if ("password" in data) {
    if (typeof data.password !== "string" || data.password.trim().length < 8) {
      return createError(400, "Dado inválido", "password", "Senha inválida");
    }
  }
  if ("birth_date" in data) {
    const birthDateError = validateBirthDate(data.birth_date);
    if (birthDateError) {
      return birthDateError;
    }
  }

  return null;
}

function validateBirthDate(birth_date) {
  if (typeof birth_date !== "string" || birth_date.trim() === "") {
    return createError(
      400,
      "Dado inválido",
      "birth_date",
      "Data de nascimento inválida",
    );
  }

  const birthDate = new Date(birth_date);
  if (Number.isNaN(birthDate.getTime())) {
    return createError(
      400,
      "Dado inválido",
      "birth_date",
      "Data de Nascimento não válida",
    );
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  const hasBirthdayPassed =
    monthDiff > 0 ||
    (monthDiff === 0 && today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  if (age < 18) {
    return createError(
      400,
      "Dado inválido",
      "birth_date",
      "Usuário deve ter pelo menos 18 anos.",
    );
  }

  return null;
}

function createError(status, message, field, detail) {
  return {
    status,
    message,
    error: {
      field,
      detail,
    },
  };
}

function validateUUID(id) {
  if (!isUUID(id)) {
    return createError(400, "UUID inválido", "uuid", "UUID não válido");
  }

  return null;
}

export { validateCreateUser, createError, validateUUID, validateUpdateUser };

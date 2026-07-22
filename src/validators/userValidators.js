import validateUUID from "./uuidValidator.js";
import createError from "../utils/createError.js";
import emailValidator from "./emailValidator.js";
import validateBirthDate from "./birthDateValidator.js";
import passwordValidator from "./passwordValidator.js";

function validateCreateUser(data) {
  const { name, password, email, birth_date } = data;

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

  const passwordError = passwordValidator(password);

  if (passwordError) {
    return passwordError;
  }

  const emailError = emailValidator(email);

  if (emailError) {
    return emailError;
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
    const emailError = emailValidator(data.email);
    if (emailError) {
      return emailError;
    }
  }

  if ("password" in data) {
    const passwordError = passwordValidator(data.password);
    if (passwordError) {
      return passwordError;
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

function validateLogin({ email, password }) {
  const emailError = emailValidator(email);

  if (emailError) {
    return emailError;
  }

  const passwordError = passwordValidator(password);

  if (passwordError) {
    return passwordError;
  }

  return null;
}

export { validateCreateUser, validateUpdateUser, validateLogin };

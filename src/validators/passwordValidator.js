import createError from "../utils/createError.js";

function passwordValidator(password) {
  if (typeof password !== "string" || password.trim().length < 8) {
    return createError(400, "Dado inválido", "password", "Senha não é válida");
  }

  return null;
}

export default passwordValidator;

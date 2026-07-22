import createError from "../utils/createError.js";
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function emailValidator(email) {
  if (typeof email !== "string" || email.trim() === "") {
    return createError(400, "Dado inválido", "email", "Email não é válido");
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return createError(400, "Dado inválido", "email", "Email não é válido");
  }

  return null;
}

export default emailValidator;

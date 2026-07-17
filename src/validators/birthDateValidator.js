import createError from "../utils/createError.js";

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

export default validateBirthDate;

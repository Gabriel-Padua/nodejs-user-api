function validateCreateUser(data) {
  const { name, password, email, birth_date } = data;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const today = new Date();

  if (typeof birth_date !== "string" || birth_date.trim() === "") {
    return createError(
      400,
      "Dado inválido",
      "birth_date",
      "Data de nascimento inválida",
    );
  }

  const birthDate = new Date(birth_date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  const hasBirthdayPassed =
    monthDiff > 0 ||
    (monthDiff === 0 && today.getDate() >= birthDate.getDate());

  if (Number.isNaN(birthDate.getTime())) {
    return createError(
      400,
      "Dado inválido",
      "birth_date",
      "Data de Nascimento não válida",
    );
  }

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

export { validateCreateUser, createError };

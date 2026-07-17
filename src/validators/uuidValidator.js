import { validate as isUUID } from "uuid";

function validateUUID(id) {
  if (!isUUID(id)) {
    return createError(400, "UUID inválido", "uuid", "UUID não válido");
  }

  return null;
}

export default validateUUID;

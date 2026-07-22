import { validate as isUUID } from "uuid";
import createError from "./../utils/createError.js";

function validateUUID(id) {
  if (!isUUID(id)) {
    return createError(400, "UUID inválido", "uuid", "UUID não válido");
  }

  return null;
}

export default validateUUID;

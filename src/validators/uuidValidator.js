import createError from "./../utils/createError.js";
import { validate as isUUID } from "uuid";

export function validateUUID(id) {
  if (!isUUID(id)) {
    return createError(400, "UUID inválido", "uuid", "UUID não válido");
  }

  return null;
}

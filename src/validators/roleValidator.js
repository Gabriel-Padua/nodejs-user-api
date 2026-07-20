import createError from "../utils/createError.js";
import { ROLES } from "../constants/roles.js";

function roleValidator(role) {
  const isRoleValid = Object.values(ROLES).includes(role.trim());

  if (!isRoleValid) {
    return createError(400, "Dado inválido", "role", "Role não é válida");
  }

  return null;
}

export default roleValidator;

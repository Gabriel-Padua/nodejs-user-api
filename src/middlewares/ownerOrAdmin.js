import { ROLES } from "../constants/roles.js";
import createError from "../utils/createError.js";

function ownerOrAdmin(req, res, next) {
  if (req.user.role === ROLES.ADMIN) {
    return next();
  }
  if (req.user.id === req.params.id) {
    return next();
  }

  return res
    .status(403)
    .json(
      createError(
        403,
        "Acesso negado",
        "authorization",
        "Você não possui permissão para realizar esta ação.",
      ),
    );
}

export default ownerOrAdmin;

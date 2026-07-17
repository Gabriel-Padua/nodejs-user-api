import createError from "../utils/createError.js";

function owner(req, res, next) {
  if (req.user.id !== req.params.id) {
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

  next();
}

export default owner;

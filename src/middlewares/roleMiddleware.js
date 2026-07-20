import createError from "../utils/createError.js";

function authorize(...roles) {
  return function (req, res, next) {
    if (roles.includes(req.user.role)) {
      return next();
    }

    return res
      .status(403)
      .json(
        createError(
          403,
          "Sem autorização",
          "role",
          "Essa role não tem permissão para acessar este recurso.",
        ),
      );
  };
}

export default authorize;

import jwt from "jsonwebtoken";
import { createError } from "../validators/userValidators.js";

function authenticator(req, res, next) {
  let { authorization } = req.headers;
  console.log(req.headers.authorization);
  if (!authorization) {
    return res
      .status(401)
      .json(
        createError(
          401,
          "Não autorizado",
          "authorization",
          "Token não informado",
        ),
      );
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return res
      .status(401)
      .json(
        createError(
          401,
          "Não autorizado",
          "authorization",
          "Token não informado ou tipo errado",
        ),
      );
  }
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res
      .status(401)
      .json(
        createError(
          401,
          "Não autorizado",
          "token",
          "Token inválido ou expirado",
        ),
      );
  }

  req.user = payload;

  next();
}

export default authenticator;

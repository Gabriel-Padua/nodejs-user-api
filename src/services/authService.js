import bcrypt from "bcrypt";
import toPublicUser from "../utils/userMapper.js";
import { generateToken } from "../helpers/jwt.js";
import { validateLogin } from "../validators/userValidators.js";
import { findByEmail } from "../repositories/userRepository.js";
import createError from "../utils/createError.js";

async function loginUserService({ email, password }) {
  const erro = validateLogin({ email, password });

  if (erro) {
    throw erro;
  }

  const user = await findByEmail(email);

  if (!user) {
    throw createError(
      401,
      "Usuário não autorizado",
      "user",
      "Email ou senha inválidos",
    );
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw createError(
      401,
      "Usuário não autorizado",
      "user",
      "Email ou senha não são compativeis",
    );
  }

  const token = generateToken(user);

  return {
    user: toPublicUser(user),
    token,
  };
}

export default loginUserService;

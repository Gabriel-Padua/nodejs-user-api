import {
  validateCreateUser,
  createError,
  validateUUID,
} from "../validators/userValidators.js";
import {
  findByEmail,
  createUser as createUserRepository,
  findAllUsers,
  findById,
} from "../repositories/userRepository.js";

async function getUsers() {
  const users = await findAllUsers();

  return users;
}

async function getUserById(id) {
  const erro = validateUUID(id);
  if (erro) {
    throw erro;
  }

  const user = await findById(id);

  if (!user) {
    throw createError(
      404,
      "Usuário não encontrado",
      "id",
      "Nenhum usuário encontrado com esse ID",
    );
  }

  return user;
}

async function createUser(data) {
  const error = validateCreateUser(data);

  if (error) {
    throw error;
  }

  const user = await findByEmail(data.email);

  if (user) {
    throw createError(
      409,
      "Email já cadastrado",
      "email",
      "Email já cadastrado",
    );
  }

  const newUser = await createUserRepository(data);

  delete newUser.password;

  return newUser;
}

export { createUser, getUserById, getUsers };

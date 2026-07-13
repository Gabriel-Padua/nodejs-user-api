import {
  validateCreateUser,
  createError,
  validateUUID,
  validateUpdateUser,
} from "../validators/userValidators.js";
import {
  findByEmail,
  createUser as createUserRepository,
  findAllUsers,
  findById,
  deleteUser as deleteUserRepository,
  updateUser as updateUserRepository,
} from "../repositories/userRepository.js";

async function getUsersService(limit, isActive) {
  const users = await findAllUsers(limit, isActive);

  return users;
}

async function updateUserService(id, data = {}) {
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

  const allowedFields = [
    "name",
    "email",
    "password",
    "birth_date",
    "is_active",
  ];

  const filteredData = {};

  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      filteredData[key] = data[key];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    throw createError(
      400,
      "Dados inválidos",
      "body",
      "Nenhum campo enviado para atualização",
    );
  }
  const error = validateUpdateUser(filteredData);

  if (error) {
    throw error;
  }

  const mergedUser = {
    ...user,
    ...filteredData,
  };

  if (filteredData.email && filteredData.email !== user.email) {
    const emailExists = await findByEmail(filteredData.email);

    if (emailExists) {
      throw createError(
        409,
        "Email já cadastrado",
        "email",
        "Já existe um usuário com esse email",
      );
    }
  }

  const updatedUser = await updateUserRepository(id, filteredData);

  delete updatedUser.password;

  return updatedUser;
}

async function getUserByIdService(id) {
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

async function createUserService(data) {
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

async function deleteUserService(id) {
  const erro = validateUUID(id);

  if (erro) {
    throw erro;
  }

  const user = await getUserByIdService(id);

  if (!user) {
    throw createError(
      404,
      "Usuário não encontrado",
      "id",
      "Nenhum usuário encontrado com esse ID",
    );
  }

  const deletedUser = await deleteUserRepository(id);

  delete deletedUser.password;

  return deletedUser;
}

export {
  createUserService,
  getUserByIdService,
  getUsersService,
  updateUserService,
  deleteUserService,
};

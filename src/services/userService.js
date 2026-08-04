import "dotenv/config";
import bcrypt from "bcrypt";
import createError from "../utils/createError.js";
import * as mapper from "../utils/userMapper.js";
import * as uuidValidator from "../validators/uuidValidator.js";
import * as userValidator from "../validators/userValidator.js";
import * as userRepository from "../repositories/userRepository.js";
import * as roleValidator from "../validators/roleValidator.js";
import { ROLES } from "../constants/roles.js";

async function getUsersService(limit, isActive) {
  const users = await userRepository.findAllUsers(limit, isActive);

  return users;
}

async function updateUserService(id, data = {}) {
  const erro = uuidValidator.validateUUID(id);

  if (erro) {
    throw erro;
  }

  const user = await userRepository.findById(id);

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
  const error = userValidator.validateUpdateUser(filteredData);

  if (error) {
    throw error;
  }

  if (filteredData.email && filteredData.email !== user.email) {
    const emailExists = await userRepository.findByEmail(filteredData.email);

    if (emailExists) {
      throw createError(
        409,
        "Email já cadastrado",
        "email",
        "Já existe um usuário com esse email",
      );
    }
  }

  const updatedUser = await userRepository.updateUser(id, filteredData);

  return mapper.toPublicUser(updatedUser);
}

async function getUserByIdService(id) {
  const erro = uuidValidator.validateUUID(id);
  if (erro) {
    throw erro;
  }

  const user = await userRepository.findById(id);

  if (!user) {
    throw createError(
      404,
      "Usuário não encontrado",
      "id",
      "Nenhum usuário encontrado com esse ID",
    );
  }

  return mapper.toPublicUser(user);
}

async function createUserService(data) {
  const error = userValidator.validateCreateUser(data);

  if (error) {
    throw error;
  }

  const user = await userRepository.findByEmail(data.email);

  if (user) {
    throw createError(
      409,
      "Email já cadastrado",
      "email",
      "Email já cadastrado",
    );
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const newUser = {
    name: data.name,
    email: data.email,
    password: passwordHash,
    birth_date: data.birth_date,
  };

  const createdUser = await userRepository.createUser(newUser);

  return mapper.toPublicUser(createdUser);
}

async function deleteUserService(id) {
  const erro = uuidValidator.validateUUID(id);

  if (erro) {
    throw erro;
  }

  const user = await userRepository.findById(id);

  if (!user) {
    throw createError(
      404,
      "Usuário não encontrado",
      "id",
      "Nenhum usuário encontrado com esse ID",
    );
  }

  const deletedUser = await userRepository.deleteUser(id);

  return mapper.toPublicUser(deletedUser);
}

async function updateUserRoleService(id, role) {
  const erro = uuidValidator.validateUUID(id);
  if (erro) {
    throw erro;
  }
  const roleError = roleValidator.roleValidator(role);

  if (roleError) {
    throw roleError;
  }

  const user = await userRepository.findById(id);

  if (!user) {
    throw createError(
      404,
      "Usuário não encontrado",
      "id",
      "Nenhum usuário encontrado com esse ID",
    );
  }

  if (user.role === ROLES.ADMIN && role !== ROLES.ADMIN) {
    const totalAdmins = await userRepository.countAdmins();

    if (totalAdmins === 1) {
      throw createError(
        409,
        "Operação não permitida",
        "role",
        "O sistema deve possuir pelo menos um administrador.",
      );
    }
  }

  const updatedUser = await userRepository.updateUser(id, {
    role,
  });

  return mapper.toPublicUser(updatedUser);
}

export {
  createUserService,
  getUserByIdService,
  getUsersService,
  updateUserService,
  deleteUserService,
  updateUserRoleService,
};

import * as userService from "../services/userService.js";

import loginUserService from "../services/authService.js";

async function createUserController(req, res) {
  try {
    const user = await userService.createUserService(req.body);
    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso!", user });
  } catch (error) {
    return res.status(error.status ?? 500).json(error);
  }
}

async function updateUserController(req, res) {
  const { id } = req.params;
  const data = req.body;
  try {
    const user = await userService.updateUserService(id, data);
    return res
      .status(200)
      .json({ message: `Usuário atualizado com sucesso`, user });
  } catch (error) {
    return res.status(error.status ?? 500).json(error);
  }
}

async function getUsersController(req, res) {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const limitValid = isNaN(limit) ? undefined : limit;

  let isActiveValid = null;
  if (req.query.isActive === "true") isActiveValid = true;
  if (req.query.isActive === "false") isActiveValid = false;
  try {
    const result = await userService.getUsersService(limitValid, isActiveValid);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

async function getUserByIdController(req, res) {
  const { id } = req.params;
  try {
    const result = await userService.getUserByIdService(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status ?? 500).json(error);
  }
}

async function deleteUserController(req, res) {
  const { id } = req.params;

  try {
    const result = await userService.deleteUserService(id);
    return res
      .status(200)
      .json({ message: "Usuário deletado com sucesso!", result });
  } catch (error) {
    return res.status(error.status ?? 500).json(error);
  }
}

async function loginUserController(req, res) {
  const { email, password } = req.body;

  try {
    const result = await loginUserService({ email, password });

    return res.status(200).json({ message: "Usuário logado!", ...result });
  } catch (error) {
    return res.status(error.status ?? 500).json(error);
  }
}

async function getMeController(req, res) {
  const { id } = req.user;
  try {
    const user = await userService.getUserByIdService(id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(error.status ?? 500).json(error);
  }
}

async function updateUserRoleController(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await userService.updateUserRoleService(id, role);
    return res
      .status(200)
      .json({ message: "Role atualizado com sucesso", user });
  } catch (error) {
    return res.status(error.status ?? 500).json(error);
  }
}

export {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  updateUserRoleController,
  deleteUserController,
  loginUserController,
  getMeController,
};

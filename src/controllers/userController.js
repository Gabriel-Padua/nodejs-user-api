import {
  createUser as createUserService,
  getUsers as getUsersService,
  getUserById as getUserByIdService,
} from "../services/userService";

async function createUser(req, res) {
  try {
    const newUser = await createUserService(req.body);
    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso!", newUser });
  } catch (error) {
    return res.status(error.status ?? 500).json(error);
  }
}

async function getUsers(req, res) {
  try {
    const result = await getUsersService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const result = await getUserByIdService(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status ?? 500).json(error);
  }
}

export { createUser, getUsers, getUserById };

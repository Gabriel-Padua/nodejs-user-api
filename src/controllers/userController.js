import { createUser as createUserService } from "../services/userService";

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

export { createUser };

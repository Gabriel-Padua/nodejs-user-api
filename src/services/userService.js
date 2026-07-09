import {
  validateCreateUser,
  validationError,
} from "../validators/userValidators.js";
import {
  findByEmail,
  createUser as createUserRepository,
} from "../repositories/userRepository.js";

async function createUser(data) {
  const error = validateCreateUser(data);

  if (error) {
    throw error;
  }

  const user = await findByEmail(data.email);

  if (user) {
    throw validationError("email", "Email já cadastrado");
  }

  const newUser = await createUserRepository(data);

  delete newUser.password;

  return newUser;
}

export { createUser };

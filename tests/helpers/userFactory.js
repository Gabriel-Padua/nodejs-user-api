import * as userRepository from "../../src/repositories/userRepository.js";
import bcrypt from "bcrypt";
import { ROLES } from "../../src/constants/roles.js";

export function makeUser(overrides = {}) {
  return {
    name: "John Doe",
    password: "senha_com_hash_fake",
    email: "john@email.com",
    birth_date: "2000-01-01",
    role: ROLES.USER,
    is_active: false,
    ...overrides,
  };
}

export async function createTestUser(overrides = {}) {
  const user = makeUser(overrides);

  return await userRepository.createUser(user);
}

export async function createLoginTestUser(overrides = {}) {
  const user = makeUser(overrides);

  const passwordHash = await bcrypt.hash(user.password, 10);

  return await userRepository.createUser({
    ...user,
    password: passwordHash,
  });
}

export async function createAdminTestUser(overrides = {}) {
  const user = await createTestUser(overrides);

  return await userRepository.updateUser(user.id, {
    role: ROLES.ADMIN,
  });
}

export async function createActiveTestUser(overrides = {}) {
  const user = await createTestUser(overrides);

  return await userRepository.updateUser(user.id, {
    is_active: true,
  });
}

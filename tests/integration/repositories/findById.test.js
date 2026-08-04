import test, { describe } from "node:test";
import assert from "node:assert/strict";
import "../../helpers/setup.js";
import * as userFactory from "../../helpers/userFactory.js";
import pool from "../../../src/database/pool.js";
import { findById } from "../../../src/repositories/userRepository.js";

describe("findById()", () => {
  test("Deve retornar o usuário quando o id existir", async () => {
    const createdUser = await userFactory.createTestUser();

    const foundUser = await findById(createdUser.id);

    assert.ok(foundUser);

    assert.strictEqual(foundUser.id, createdUser.id);
    assert.strictEqual(foundUser.name, createdUser.name);
    assert.strictEqual(foundUser.email, createdUser.email);
    assert.strictEqual(foundUser.role, createdUser.role);
  });
  test("Deve retornar null quando o usuário não existir", async () => {
    const result = await findById(crypto.randomUUID());

    assert.strictEqual(result, null);
  });
  test("Deve retornar todos os dados do usuário", async () => async () => {
    const createdUser = await userFactory.createTestUser();

    const foundUser = await findById(createdUser.id);

    assert.deepStrictEqual(
      {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        is_active: foundUser.is_active,
      },
      {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        is_active: createdUser.is_active,
      },
    );
  });
});

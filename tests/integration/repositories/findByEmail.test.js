import test, { describe } from "node:test";
import assert from "node:assert/strict";
import "../../helpers/setup.js";
import * as userFactory from "../../helpers/userFactory.js";

import { findByEmail } from "../../../src/repositories/userRepository.js";

describe("findByEmail()", () => {
  test("Deve retornar o usuario se o email existir", async () => {
    const createdUser = await userFactory.createTestUser();

    const foundUser = await findByEmail(createdUser.email);

    assert.ok(foundUser);

    assert.strictEqual(foundUser.email, createdUser.email);
  });
  test("Deve retornar todos os dados do usuário", async () => {
    const createdUser = await userFactory.createTestUser();

    const foundUser = await findByEmail(createdUser.email);

    assert.strictEqual(foundUser.id, createdUser.id);
    assert.strictEqual(foundUser.name, createdUser.name);
    assert.strictEqual(foundUser.email, createdUser.email);
    assert.strictEqual(foundUser.password, createdUser.password);
    assert.strictEqual(foundUser.role, createdUser.role);
    assert.strictEqual(foundUser.is_active, createdUser.is_active);
    assert.strictEqual(
      foundUser.birth_date.toISOString().slice(0, 10),
      createdUser.birth_date.toISOString().slice(0, 10),
    );
  });
  test("Deve retornar null quando o usuário não existir", async () => {
    const foundUser = await findByEmail("naoexiste@email.com");

    assert.deepEqual(foundUser, null);
  });
});

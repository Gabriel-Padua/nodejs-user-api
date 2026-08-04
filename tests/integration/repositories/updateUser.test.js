import { describe, test } from "node:test";
import assert from "node:assert/strict";

import "../../helpers/setup.js";

import { updateUser } from "../../../src/repositories/userRepository.js";

import * as userFactory from "../../helpers/userFactory.js";

describe("updateUser()", () => {
  test("Deve atualizar um único campo", async () => {
    const user = await userFactory.createTestUser();

    const updatedUser = await updateUser(user.id, {
      email: "novoemail@email.com",
    });

    assert.strictEqual(updatedUser.name, user.name);
    assert.strictEqual(updatedUser.email, "novoemail@email.com");
  });
  test("Deve atualizar múltiplos campos", async () => {
    const user = await userFactory.createTestUser();
    const updatedUser = await updateUser(user.id, {
      email: "novoemail@email.com",
      is_active: true,
      password: "novaSenha_hash",
    });

    assert.strictEqual(updatedUser.name, user.name);
    assert.strictEqual(updatedUser.email, "novoemail@email.com");
    assert.strictEqual(updatedUser.is_active, true);
    assert.strictEqual(updatedUser.password, "novaSenha_hash");
  });

  test("Deve atualizar o campo updated_at", async () => {
    const user = await userFactory.createTestUser();

    await new Promise((res) => setTimeout(res, 10));
    const updatedUser = await updateUser(user.id, { name: "Jane Doe" });

    assert.ok(updatedUser.updated_at > user.updated_at);
  });
  test("Deve retornar null quando o usuário não existir", async () => {
    const updatedUser = await updateUser(crypto.randomUUID(), {
      name: "Joaquin",
    });

    assert.strictEqual(updatedUser, null);
  });

  test("Deve remover espaços em branco de valores string", async () => {
    const user = await userFactory.createTestUser();

    const updatedUser = await updateUser(user.id, {
      name: "   Gabriel  ",
    });

    assert.strictEqual(updatedUser.name, "Gabriel");
  });
});

import test, { describe } from "node:test";
import assert from "node:assert/strict";

import * as userService from "../../../src/services/userService.js";
import { makeResponse } from "../../helpers/responseFactory.js";
import { updateUserController } from "../../../src/controllers/userController.js";
import "../../helpers/setup.js"
import * as userFactory from "../../helpers/userFactory.js";
import { findByEmail } from "../../../src/repositories/userRepository.js";
import { clearDatabase, closeDatabase } from "../../helpers/database.js";

describe("updateUserController()", () => {
  test("Sucesso : Deve retornar 200.", async () => {
    const user = await userFactory.createTestUser();
    const newEmail = "updatedEmail@email.com";
    const req = {
      body: { email: newEmail },
      params: {
        id: user.id,
      },
    };

    const res = makeResponse();

    await updateUserController(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.message, "Usuário atualizado com sucesso");
    assert.strictEqual(res.body.user.email, newEmail);
    const userInDatabase = await findByEmail(newEmail);

    assert.ok(userInDatabase);
    assert.strictEqual(userInDatabase.email, newEmail);
  });
  test("Dados inválidos: Deve retornar 400.", async () => {
    const user = await userFactory.createTestUser();

    const req = {
      body: {},
      params: {
        id: user.id,
      },
    };

    const res = makeResponse();

    await updateUserController(req, res);

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.message, "Dados inválidos");
  });
  test("Usuário não encontrado: Deve retornar 404.", async () => {
    const req = {
      body: {},
      params: {
        id: crypto.randomUUID(),
      },
    };

    const res = makeResponse();

    await updateUserController(req, res);

    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.status, 404);
    assert.strictEqual(res.body.message, "Usuário não encontrado");
  });
  test("Email já existente : Deve retornar 409.", async () => {
    await clearDatabase();
    const user1 = await userFactory.createTestUser();
    const user2 = await userFactory.createTestUser({
      email: "diferente@email.com",
    });

    const req = {
      params: {
        id: user1.id,
      },
      body: {
        ...userFactory.makeUser({ email: user2.email }),
      },
    };

    const res = makeResponse();

    await updateUserController(req, res);

    assert.strictEqual(res.statusCode, 409);
  });
});

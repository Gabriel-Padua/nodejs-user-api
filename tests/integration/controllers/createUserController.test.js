import test, { describe } from "node:test";
import assert from "node:assert/strict";

import { makeResponse } from "../../helpers/responseFactory.js";
import { createUserController } from "../../../src/controllers/userController.js";
import "../../helpers/setup.js";
import * as userFactory from "../../helpers/userFactory.js";
import { findByEmail } from "../../../src/repositories/userRepository.js";
import pool from "../../../src/database/pool.js";

describe("createUserController()", () => {
  test("Deve retornar 201 e o usuário criado", async () => {
    // Arrange
    const user = userFactory.makeUser();

    const req = {
      body: user,
    };

    const res = makeResponse();

    // Act
    await createUserController(req, res);

    // Assert
    assert.strictEqual(res.statusCode, 201);

    assert.strictEqual(res.body.message, "Usuário criado com sucesso!");

    assert.ok(res.body.user.id);

    assert.strictEqual(res.body.user.email, user.email);

    assert.ok(!("password" in res.body.user));

    const userInDatabase = await findByEmail(user.email);

    assert.ok(userInDatabase);
    assert.strictEqual(userInDatabase.email, user.email);
  });

  test("Deve retornar o erro lançado pelo service", async () => {
    const user = userFactory.makeUser();

    const req = {
      body: {},
    };

    const res = makeResponse();

    await createUserController(req, res);

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.status, 400);
  });
  test("Deve retornar 409 quando o email já existir", async () => {
    const user = await userFactory.createTestUser();

    const req = {
      body: { ...userFactory.makeUser({ email: user.email }) },
    };

    const res = makeResponse();

    await createUserController(req, res);

    assert.strictEqual(res.statusCode, 409);
    assert.strictEqual(res.body.status, 409);
  });
});

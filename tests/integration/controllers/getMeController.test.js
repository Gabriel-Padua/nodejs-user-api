import test, { describe } from "node:test";
import assert from "node:assert/strict";

import * as userService from "../../../src/services/userService.js";
import { makeResponse } from "../../helpers/responseFactory.js";
import { getMeController } from "../../../src/controllers/userController.js";

import "../../helpers/setup.js";
import * as userFactory from "../../helpers/userFactory.js";

describe("getMeController()", () => {
  test("Sucesso : Deve retornar 200.", async () => {
    const user = await userFactory.createLoginTestUser();

    const req = {
      user: {
        id: user.id,
      },
    };

    const res = makeResponse();

    await getMeController(req, res);

    assert.strictEqual(res.statusCode, 200);

    assert.strictEqual(res.body.id, user.id);
    assert.strictEqual(res.body.email, user.email);
    assert.strictEqual(res.body.name, user.name);

    assert.ok(!("password" in res.body));
  });
  test("Usuário não encontrado : Deve retornar 404.", async () => {
    const req = {
      user: {
        id: crypto.randomUUID(),
      },
    };

    const res = makeResponse();

    await getMeController(req, res);

    assert.strictEqual(res.statusCode, 404);
  });
});

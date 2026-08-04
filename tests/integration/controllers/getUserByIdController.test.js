import test, { describe } from "node:test";
import assert from "node:assert/strict";

import * as userService from "../../../src/services/userService.js";
import { makeResponse } from "../../helpers/responseFactory.js";
import { getUserByIdController } from "../../../src/controllers/userController.js";

import "../../helpers/setup.js";
import * as userFactory from "../../helpers/userFactory.js";

describe("getUserByIdController()", () => {
  test("Sucesso : Deve retornar 200.", async () => {
    const user = await userFactory.createTestUser();
    const req = {
      params: {
        id: user.id,
      },
    };

    const res = makeResponse();

    await getUserByIdController(req, res);

    assert.strictEqual(res.statusCode, 200);
  });
  test("UUID Invalido : Deve retornar 400.", async () => {
    const req = {
      params: {
        id: "abc-def",
      },
    };

    const res = makeResponse();

    await getUserByIdController(req, res);

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.message, "UUID inválido");
  });
  test("Usuário não encontrado : Deve retornar 404.", async () => {
    const req = {
      params: {
        id: crypto.randomUUID(),
      },
    };

    const res = makeResponse();

    await getUserByIdController(req, res);

    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.message, "Usuário não encontrado");
  });
});

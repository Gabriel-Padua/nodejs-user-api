import test, { describe } from "node:test";
import assert from "node:assert/strict";

import * as userService from "../../../src/services/userService.js";
import { makeResponse } from "../../helpers/responseFactory.js";
import { loginUserController } from "../../../src/controllers/userController.js";

import "../../helpers/setup.js";
import * as userFactory from "../../helpers/userFactory.js";
import { findById } from "../../../src/repositories/userRepository.js";

describe("loginUserController()", () => {
  test("Sucesso : Deve retornar 200.", async () => {
    const user = await userFactory.createLoginTestUser();

    const req = {
      body: {
        email: user.email,
        password: "senha_com_hash_fake",
      },
    };

    const res = makeResponse();

    await loginUserController(req, res);

    assert.strictEqual(res.statusCode, 200);
  });
  test("Dados Inválidos : Deve retornar 400.", async () => {
    const req = {
      body: {},
    };

    const res = makeResponse();

    await loginUserController(req, res);

    assert.strictEqual(res.statusCode, 400);
  });
  test("E-mail/senha incorretos : Deve retornar 401.", async () => {
    const user = await userFactory.createLoginTestUser();

    const req = {
      body: {
        email: user.email,
        password: "senha_errada",
      },
    };

    const res = makeResponse();

    await loginUserController(req, res);

    assert.strictEqual(res.statusCode, 401);
  });
});

import test, { describe } from "node:test";
import assert from "node:assert/strict";

import * as userService from "../../../src/services/userService.js";
import { makeResponse } from "../../helpers/responseFactory.js";
import { getUsersController } from "../../../src/controllers/userController.js";

import * as userFactory from "../../helpers/userFactory.js";
import { findByEmail } from "../../../src/repositories/userRepository.js";
import pool from "../../../src/database/pool.js";

describe("getUsersController()", () => {
  test("Sucesso : Deve retornar 200.", async () => {
    const req = {
      query: {},
    };
    const res = makeResponse();

    await getUsersController(req, res);

    assert.strictEqual(res.statusCode, 200);
  });
  test("Erro interno : Deve retornar 500.", async () => {
    await pool.end();
    const req = {
      query: {},
    };
    const res = makeResponse();

    await getUsersController(req, res);

    assert.strictEqual(res.statusCode, 500);
  });
});

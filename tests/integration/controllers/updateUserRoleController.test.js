import test, { describe } from "node:test";
import assert from "node:assert/strict";

import * as userService from "../../../src/services/userService.js";
import { makeResponse } from "../../helpers/responseFactory.js";
import { updateUserRoleController } from "../../../src/controllers/userController.js";

import "../../helpers/setup.js";
import * as userFactory from "../../helpers/userFactory.js";
import { ROLES } from "../../../src/constants/roles.js";
import { findById } from "../../../src/repositories/userRepository.js";

describe("updateUserRoleController()", () => {
  test("Sucesso : Deve retornar 200.", async () => {
    const user = await userFactory.createAdminTestUser();

    const req = {
      params: {
        id: user.id,
      },
      body: {
        role: ROLES.ADMIN,
      },
    };

    const res = makeResponse();

    await updateUserRoleController(req, res);

    assert.strictEqual(res.statusCode, 200);
  });
  test("Role inválida : Deve retornar 400.", async () => {
    const req = {
      params: {},
      body: {},
    };

    const res = makeResponse();

    await updateUserRoleController(req, res);

    assert.deepEqual(res.statusCode, 400);
  });
  test("Usuário não encontrado : Deve retornar 404.", async () => {
    const user = await userFactory.createLoginTestUser();

    const req = {
      params: {
        id: crypto.randomUUID(),
      },
      body: {
        role: ROLES.USER,
      },
    };

    const res = makeResponse();

    await updateUserRoleController(req, res);

    assert.strictEqual(res.statusCode, 404);
  });
  test("Ultimo ADM : Deve retornar 409.", async () => {
    const user = await userFactory.createAdminTestUser({ role: ROLES.ADMIN });

    const req = {
      params: {
        id: user.id,
      },
      body: {
        role: ROLES.USER,
      },
    };

    const res = makeResponse();

    await await updateUserRoleController(req, res);

    assert.strictEqual(res.statusCode, 409);

    const userInDatabase = await findById(user.id);

    assert.strictEqual(userInDatabase.role, "admin");
  });
});

import test, { describe } from "node:test";
import assert from "node:assert/strict";

import "../../helpers/setup.js";

import ownerOrAdmin from "../../../src/middlewares/ownerOrAdmin.js";

import { makeNext } from "../../helpers/nextFactory.js";
import { makeResponse } from "../../helpers/responseFactory.js";
import { ROLES } from "../../../src/constants/roles.js";

describe("ownerOrAdmin()", () => {
  test("Deve chamar next() quando o usuário for admin.", () => {
    const req = {
      user: {
        role: ROLES.ADMIN,
        id: "123",
      },
      params: {
        id: "444",
      },
    };

    const res = makeResponse();

    const next = makeNext();

    ownerOrAdmin(req, res, next);

    assert.ok(next.called());
  });
  test("Deve chamar next() quando o usuário for o próprio dono.", async () => {
    const req = {
      user: {
        role: ROLES.USER,
        id: "123",
      },
      params: {
        id: "123",
      },
    };

    const res = makeResponse();

    const next = makeNext();

    ownerOrAdmin(req, res, next);

    assert.ok(next.called());
  });
  test("Deve retornar 403 quando não for admin nem dono.", () => {
    const req = {
      user: {
        role: ROLES.USER,
        id: "123",
      },
      params: {
        id: "432",
      },
    };

    const res = makeResponse();

    const next = makeNext();

    ownerOrAdmin(req, res, next);

    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.body.message, "Acesso negado");
    assert.strictEqual(
      res.body.error.detail,
      "Você não possui permissão para realizar esta ação.",
    );
  });
});

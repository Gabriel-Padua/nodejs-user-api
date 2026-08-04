import { describe, test } from "node:test";
import assert from "node:assert/strict";

import "../../helpers/setup.js";

import authenticator from "../../../src/middlewares/authMiddlewares.js";

import { makeNext } from "../../helpers/nextFactory.js";
import { makeResponse } from "../../helpers/responseFactory.js";
import { generateToken } from "../../../src/helpers/jwt.js";
import { ROLES } from "../../../src/constants/roles.js";

describe("authenticator()", () => {
  test("Deve chamar next() quando o token for válido.", async () => {
    const token = generateToken({
      id: crypto.randomUUID(),
      email: "teste@gmail.com",
      role: ROLES.USER,
    });

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const res = makeResponse();
    const next = makeNext();

    await authenticator(req, res, next);

    assert.ok(next.called());
  });
  test("Deve retornar 401 quando o header Authorization não existir.", async () => {
    const req = {
      headers: {},
    };

    const res = makeResponse();

    const next = makeNext();

    await authenticator(req, res, next);

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.message, "Não autorizado");
  });
  test("Deve retornar 401 quando o tipo não for Bearer", async () => {
    const req = {
      headers: {
        authorization: "erro test1test2test3",
      },
    };
    const res = makeResponse();
    const next = makeNext();

    await authenticator(req, res, next);

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(
      res.body.error.detail,
      "Token não informado ou tipo errado",
    );
  });
  test("Deve retornar 401 quando o token for inválido ou expirado", async () => {
    const req = {
      headers: {
        authorization: "Bearer token-invalido",
      },
    };
    const res = makeResponse();
    const next = makeNext();

    await authenticator(req, res, next);

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.error.detail, "Token inválido ou expirado");
  });
});

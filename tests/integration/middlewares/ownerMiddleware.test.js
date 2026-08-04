import { describe, test } from "node:test";
import assert from "node:assert/strict";

import "../../helpers/setup.js";

import owner from "../../../src/middlewares/ownerMiddleware.js";

import { makeNext } from "../../helpers/nextFactory.js";
import { makeResponse } from "../../helpers/responseFactory.js";


describe("owner()", () => {
  test("Deve chamar next() quando req.user.id === req.params.id.", async () => {
    const req = {
      user: {
        id: "12345",
      },
      params: {
        id: "12345",
      },
    };

    const res = makeResponse();
    const next = makeNext();

    await owner(req, res, next);

    assert.ok(next.called());
  });
  test("Deve retornar 403 quando os IDs forem diferentes.", async () => {
    const req = {
      user: {
        id: "12345",
      },
      params: {
        id: "54321",
      },
    };

    const res = makeResponse();
    const next = makeNext();

    await owner(req, res, next);

    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(
      res.body.error.detail,
      "Você não possui permissão para realizar esta ação.",
    );
  });
});

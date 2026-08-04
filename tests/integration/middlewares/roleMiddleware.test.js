import test, { describe } from "node:test";
import assert from "node:assert/strict";

import { ROLES } from "../../../src/constants/roles.js";
import authorize from "../../../src/middlewares/roleMiddleware.js";
import { makeResponse } from "../../helpers/responseFactory.js";
import { makeNext } from "../../helpers/nextFactory.js";

describe("authorize()", () => {
  test("Deve chamar next() quando a role estiver permitida.", async () => {
    const req = {
      user: {
        role: ROLES.ADMIN,
      },
    };

    const res = makeResponse();
    const next = makeNext();

    await authorize(ROLES.ADMIN)(req, res, next);

    assert.ok(next.called());
  });
  test("Deve retornar 403 quando a role não estiver permitida.", async () => {
    const req = {
      user: {
        role: ROLES.USER,
      },
    };

    const res = makeResponse();
    const next = makeNext();

    await authorize("barman")(req, res, next);

    assert.strictEqual(res.statusCode, 403);
  });
});

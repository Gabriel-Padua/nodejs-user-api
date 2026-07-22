import test, { describe } from "node:test";
import assert from "node:assert/strict";

import roleValidator from "../src/validators/roleValidator.js";
import { ROLES } from "../src/constants/roles.js";

describe("roleValidator()", () => {
  test("Deve retornar null quando enviado uma role válida", () => {
    const error = roleValidator(ROLES.USER);

    assert.strictEqual(error, null);
  });

  test("Deve rejeitar uma role inválida e", () => {
    const result = roleValidator("estrela");

    assert.equal(result.status, 400);
    assert.deepStrictEqual(result.error, {
      field: "role",
      detail: "Role não é válida",
    });
  });
});

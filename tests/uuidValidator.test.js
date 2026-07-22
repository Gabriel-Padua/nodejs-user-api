import test, { describe } from "node:test";
import assert from "node:assert/strict";
import validateUUID from "../src/validators/uuidValidator.js";

describe("validateUUID()", () => {
  test("Deve retornar null se o UUID for válido", () => {
    const error = validateUUID("d530c6e5-be75-4a13-af3e-63596953c88a");

    assert.strictEqual(error, null);
  });

  test("Deve retonar um erro caso o UUID seja inválido", () => {
    const result = validateUUID("uuid-invalido");

    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(result.error, {
      field: "uuid",
      detail: "UUID não válido",
    });
  });
});

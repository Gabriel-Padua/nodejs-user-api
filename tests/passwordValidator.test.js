import test, { describe } from "node:test";
import assert from "node:assert/strict";
import passwordValidator from "../src/validators/passwordValidator.js";

describe("passwordValidator()", () => {
  test("Deve retornar null se a senha for enviada corretamente", () => {
    const error = passwordValidator("12345678");

    assert.strictEqual(error, null);
  });

  test("Deve retonar um erro caso o senha seja enviado incorretamente", () => {
    const result = passwordValidator("1234567");

    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.message, "Dado inválido");
    assert.deepStrictEqual(result.error, {
      field: "password",
      detail: "Senha não é válida",
    });
  });

  test("Deve retornar um erro caso a senha seja diferente de 'string' e seja válida", () => {
    const result = passwordValidator(undefined);

    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.message, "Dado inválido");
    assert.deepStrictEqual(result.error, {
      field: "password",
      detail: "Senha não é válida",
    });
  });
});

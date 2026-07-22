import test, { describe } from "node:test";
import assert from "node:assert/strict";
import emailValidator from "../src/validators/emailValidator.js";

describe("emailValidator()", () => {
  test("Deve retornar null se o e-mail for mandado corretamente", () => {
    const error = emailValidator("teste@teste.com");

    assert.strictEqual(error, null);
  });

  test("Deve retonar um erro caso o e-mail seja enviado incorretamente", () => {
    const result = emailValidator("teste@teste");

    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.message, "Dado inválido");
    assert.deepStrictEqual(result.error, {
      field: "email",
      detail: "Email não é válido",
    });
  });

  test("Deve retornar erro quando o email for vazio", () => {
    const result = emailValidator("   ");
    assert.deepStrictEqual(result.error, {
      field: "email",
      detail: "Email não é válido",
    });
  });

  test("Deve retornar erro quando o email não for uma string", () => {
    const result = emailValidator(null);
    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(result.error, {
      field: "email",
      detail: "Email não é válido",
    });
  });
});

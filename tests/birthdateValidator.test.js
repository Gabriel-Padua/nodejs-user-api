import { test, describe } from "node:test";
import assert from "node:assert/strict";
import validateBirthDate from "../src/validators/birthDateValidator.js";

describe("birthDateValidator()", () => {
  test("Deve retorna null se a data de nascimento enviado seja válida e tenha mais de 18 anos", () => {
    const error = validateBirthDate("1990-01-01");

    assert.strictEqual(error, null);
  });

  test("Deve retonar um erro caso a pessoa tenha menos de 18 anos.", () => {
    const result = validateBirthDate("2026-01-01");

    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.message, "Dado inválido");
    assert.deepStrictEqual(result.error, {
      field: "birth_date",
      detail: "Usuário deve ter pelo menos 18 anos.",
    });
  });

  test("Deve retonar um erro caso a data enviada seja inválida", () => {
    const result = validateBirthDate("uma-data-qualquer");

    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.message, "Dado inválido");
    assert.deepStrictEqual(result.error, {
      field: "birth_date",
      detail: "Data de Nascimento não é válida",
    });
  });
});

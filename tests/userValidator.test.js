import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  validateCreateUser,
  validateLogin,
  validateUpdateUser,
} from "../src/validators/userValidators.js";

const validUser = {
  name: "John Doe",
  password: "teste12345",
  email: "john@email.com",
  birth_date: "2000-01-01",
};

describe("validateCreateUser()", () => {
  test("Deve retornar null quando todos os dados forem válidos", () => {
    const result = validateCreateUser(validUser);

    assert.strictEqual(result, null);
  });

  test("Deve retornar erro caso o campo seja enviado vazio ou diferente de uma string", () => {
    const user = { ...validUser, name: "  " };

    const result = validateCreateUser(user);

    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(result.error, {
      field: "name",
      detail: "Nome não é válido",
    });
  });

  test("Deve retornar erro quando o campo name não existir", () => {
    const result = validateCreateUser({});

    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(result.error, {
      field: "name",
      detail: "Nome não é válido",
    });
  });

  test("Deve retornar caso o nome tiver menos de 3 caracteres", () => {
    const user = { ...validUser, name: " JD" };
    const result = validateCreateUser(user);

    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(result.error, {
      field: "name",
      detail: "Nome deve ter 3 ou mais caracteres",
    });
  });
});

describe("Integração do validateCreateUser()", () => {
  test("Deve retornar erro caso o passwordValidator encontre uma falha", () => {
    const user = { ...validUser, password: "" };
    const result = validateCreateUser(user);
    assert.strictEqual(result.error.field, "password");
  });

  test("Deve retornar erro caso o emailValidator encontre uma falha", () => {
    const user = { ...validUser, email: undefined };
    const result = validateCreateUser(user);
    assert.strictEqual(result.error.field, "email");
  });
  test("Deve retornar erro caso o validateBirthDate encontre uma falha", () => {
    const user = { ...validUser, birth_date: "2025-01-01" };
    const result = validateCreateUser(user);
    assert.strictEqual(result.error.field, "birth_date");
  });
});

describe("validateLogin()", () => {
  test("Deve retornar null quando email e senha forem válidos", () => {
    const result = validateLogin(validUser);

    assert.strictEqual(result, null);
  });
  test("Deve retornar erro quando o email for inválido", () => {
    const user = { ...validUser, email: "testeteste.com" };
    const result = validateLogin(user);

    assert.strictEqual(result.error.field, "email");
  });
  test("Deve retornar erro quando a senha for inválida", () => {
    const user = { ...validUser, password: 123 };
    const result = validateLogin(user);

    assert.strictEqual(result.error.field, "password");
  });
});

describe("validateUpdateUser()", () => {
  test("Deve retornar null quando os dados enviados forem válidos", () => {
    const result = validateUpdateUser(validUser);

    assert.strictEqual(result, null);
  });

  test("Deve retornar erro quando name for inválido", () => {
    const user = { ...validUser, name: undefined };
    const result = validateUpdateUser(user);

    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(result.error, {
      field: "name",
      detail: "Nome inválido",
    });
  });

  test("Deve retornar erro quando is_active não for boolean", () => {
    const user = { ...validUser, is_active: undefined };
    const result = validateUpdateUser(user);

    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(result.error, {
      field: "is_active",
      detail: "O campo is_active deve ser do tipo booleano (true ou false)",
    });
  });

  test("Deve retornar erro quando email for inválido", () => {
    const user = { ...validUser, email: undefined };
    const result = validateUpdateUser(user);

    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(result.error, {
      field: "email",
      detail: "Email não é válido",
    });
  });

  test("Deve retornar erro quando password for inválida", () => {
    const user = { ...validUser, password: undefined };
    const result = validateUpdateUser(user);

    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(result.error, {
      field: "password",
      detail: "Senha não é válida",
    });
  });

  test("Deve retornar erro quando birth_date for inválida", () => {
    const user = { ...validUser, birth_date: undefined };
    const result = validateUpdateUser(user);

    assert.strictEqual(result.status, 400);
    assert.deepStrictEqual(result.error, {
      field: "birth_date",
      detail: "Data de Nascimento não é válida",
    });
  });

  test("Deve permitir atualização parcial dos dados", () => {
    const user = { password: "uma_senha_valida" };
    const result = validateUpdateUser(user);

    assert.strictEqual(result, null);
  });
});

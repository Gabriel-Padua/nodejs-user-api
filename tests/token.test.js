import test, { describe } from "node:test";
import assert from "node:assert/strict";

import { generateToken, verifyToken } from "../src/helpers/jwt.js";

process.env.JWT_SECRET = "chave_secreta_de_teste";

const userMock = {
  id: "1234",
  email: "teste@email.com",
  role: "user",
};

describe("generateToken() e verifyToken()", () => {
  test("Deve retornar uma string", () => {
    const token = generateToken(userMock);

    assert.strictEqual(typeof token, "string");
    assert.ok(token.length > 0);
  });

  test("Deve gerar um token contendo id, email e role", () => {
    const token = generateToken(userMock);
    const payload = verifyToken(token);

    assert.strictEqual(payload.id, userMock.id);
    assert.strictEqual(payload.email, userMock.email);
    assert.strictEqual(payload.role, userMock.role);
  });

  test("Deve falhar caso o token seja inválido", () => {
    assert.throws(
      () => {
        verifyToken("abc.def.hij");
      },
      {
        name: "JsonWebTokenError",
      },
    );
  });
});

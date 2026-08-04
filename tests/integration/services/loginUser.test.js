import test, { describe } from "node:test";
import assert from "node:assert/strict";
import loginUserService from "../../../src/services/authService.js";
import * as userFactory from "../../helpers/userFactory.js";
import bcrypt from "bcrypt";
import "../../helpers/setup.js";
import { verifyToken } from "../../../src/helpers/jwt.js";

describe("loginUserService()", () => {
  test("Deve realizar login com sucesso", async () => {
    const userMock = await userFactory.createLoginTestUser();

    const userLogin = await loginUserService({
      email: userMock.email,
      password: "senha_com_hash_fake",
    });
  });
  test("Deve lançar erro quando os dados de login forem inválidos", async () => {
    await assert.rejects(
      () => loginUserService({ password: "12345" }),
      (erro) => {
        assert.strictEqual(erro.status, 400);
        assert.strictEqual(erro.message, "Dado inválido");
        return true;
      },
    );
  });
  test("Deve lançar erro quando o email não existir", async () => {
    const userMock = await userFactory.createLoginTestUser();
    await assert.rejects(
      () =>
        loginUserService({
          email: "teste@gmail.com",
          password: "senha_com_hash_fake",
        }),
      (erro) => {
        assert.strictEqual(erro.status, 401);
        assert.strictEqual(erro.message, "Usuário não autorizado");
        return true;
      },
    );
  });
  test("Deve lançar erro quando a senha estiver incorreta", async () => {
    const userMock = await userFactory.createLoginTestUser();
    await assert.rejects(
      () =>
        loginUserService({
          email: userMock.email,
          password: "senha_incorreta_hash",
        }),
      (erro) => {
        assert.strictEqual(erro.status, 401);
        assert.strictEqual(erro.message, "Usuário não autorizado");
        return true;
      },
    );
  });
  test("Deve retornar o usuário sem a senha", async () => {
    const userMock = await userFactory.createLoginTestUser();

    const userLogin = await loginUserService({
      email: userMock.email,
      password: "senha_com_hash_fake",
    });

    assert.ok(!("password" in userLogin));
  });
  test("Deve retornar um token válido", async () => {
    const createdUser = await userFactory.createLoginTestUser();

    const result = await loginUserService({
      email: createdUser.email,
      password: "senha_com_hash_fake",
    });

    const payload = verifyToken(result.token);

    assert.strictEqual(payload.id, createdUser.id);
    assert.strictEqual(payload.email, createdUser.email);
    assert.strictEqual(payload.role, createdUser.role);
  });
});

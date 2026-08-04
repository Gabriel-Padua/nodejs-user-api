import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { createUserService } from "../../../src/services/userService.js";
import * as userFactory from "../../helpers/userFactory.js";
import "../../helpers/setup.js";
import { findByEmail } from "../../../src/repositories/userRepository.js";
import bcrypt from "bcrypt";

describe("createUserService()", () => {
  test("Deve criar um usuário com sucesso", async () => {
    const userMock = userFactory.makeUser();

    const createdUser = await createUserService(userMock);

    assert.ok(createdUser);
  });
  test("Deve lançar erro quando os dados forem inválidos", async () => {
    const userMock = userFactory.makeUser({ password: "1234567" });

    await assert.rejects(
      () => createUserService(userMock),
      (erro) => {
        assert.strictEqual(erro.status, 400);
        assert.strictEqual(erro.message, "Dado inválido");
        assert.strictEqual(erro.error.field, "password");
        return true;
      },
    );
  });
  test("Deve lançar um erro quando o e-mail já estiver cadastrado", async () => {
    const userMock = userFactory.makeUser();
    const userMock2 = userFactory.makeUser({ email: userMock.email });

    await createUserService(userMock);

    await assert.rejects(
      () => createUserService(userMock2),
      (erro) => {
        assert.strictEqual(erro.status, 409);
        assert.strictEqual(erro.message, "Email já cadastrado");
        return true;
      },
    );
  });
  test("Deve armazenar a senha criptografada", async () => {
    const userMock = userFactory.makeUser({ password: "12345678" });

    await createUserService(userMock);

    const savedUser = await findByEmail(userMock.email);

    const isValid = await bcrypt.compare("12345678", savedUser.password);

    assert.strictEqual(isValid, true);

    assert.notStrictEqual(savedUser.password, "12345678");
  });
  test("Deve retornar o usuário sem a senha", async () => {
    const userMock = userFactory.makeUser();

    const user = await createUserService(userMock);

    assert.ok(!("password" in user));
  });
});

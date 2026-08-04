import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  createUserService,
  deleteUserService,
} from "../../../src/services/userService.js";
import * as userFactory from "../../helpers/userFactory.js";
import "../../helpers/setup.js";

describe("deleteUserService()", () => {
  test("Deve deletar um usuário", async () => {
    const userMock = await userFactory.createTestUser();

    const deletedUser = await deleteUserService(userMock.id);

    assert.ok(deletedUser);
  });
  test("Deve lançar erro quando o UUID for inválido", async () => {
    await assert.rejects(
      () => deleteUserService("abc-def"),
      (erro) => {
        assert.strictEqual(erro.status, 400);
        assert.strictEqual(erro.message, "UUID inválido");

        return true;
      },
    );
  });
  test("Deve lançar erro quando o usuário não existir", async () => {
    await assert.rejects(
      () => deleteUserService(crypto.randomUUID()),
      (erro) => {
        assert.strictEqual(erro.status, 404);
        assert.strictEqual(erro.message, "Usuário não encontrado");
        return true;
      },
    );
  });
  test("Deve retornar o usuário sem a senha", async () => {
    const userMock = await userFactory.createTestUser();

    const deletedUser = await deleteUserService(userMock.id);

    assert.ok(!("password" in deletedUser));
  });
});

import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { getUserByIdService } from "../../../src/services/userService.js";
import * as userFactory from "../../helpers/userFactory.js";
import "../../helpers/setup.js";

describe("getUserByIdService()", () => {
  test(" Deve retornar um usuário quando encontrado", async () => {
    const createdUser = await userFactory.createTestUser();

    const user = await getUserByIdService(createdUser.id);

    assert.strictEqual(user.id, createdUser.id);
    assert.strictEqual(user.email, createdUser.email);
  });

  test("Deve lançar erro quando o UUID for inválido", async () => {
    await assert.rejects(
      () => getUserByIdService("abc-def-ghi"),
      (error) => {
        assert.strictEqual(error.status, 400);
        assert.strictEqual(error.message, "UUID inválido");
        return true;
      },
    );
  });

  test("Deve lançar erro quando o usuário não existir", async () => {
    await assert.rejects(
      () => getUserByIdService(crypto.randomUUID()),
      (error) => {
        assert.strictEqual(error.status, 404);
        assert.strictEqual(error.message, "Usuário não encontrado");
        return true;
      },
    );
  });

  test("Deve remover a senha antes de retornar o usuário", async () => {
    const createdUser = await userFactory.createTestUser();

    const user = await getUserByIdService(createdUser.id);

    assert.ok(!("password" in user));
  });
});

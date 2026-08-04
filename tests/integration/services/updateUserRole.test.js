import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  updateUserRoleService,
  createUserService,
} from "../../../src/services/userService.js";
import * as userFactory from "../../helpers/userFactory.js";
import "../../helpers/setup.js";
import { ROLES } from "../../../src/constants/roles.js";

describe("updateUserRoleService()", () => {
  test("Deve atualizar a role com sucesso", async () => {
    const userMock = await userFactory.createTestUser();

    const updatedUserRole = await updateUserRoleService(userMock.id, "admin");

    assert.ok(updatedUserRole);
    assert.strictEqual(updatedUserRole.role, ROLES.ADMIN);
  });
  test("Deve lançar erro quando o UUID for inválido", async () => {
    await assert.rejects(
      () => updateUserRoleService(crypto.randomUUID()),
      (erro) => {
        assert.strictEqual(erro.status, 400);
        assert.strictEqual(erro.message, "Dado inválido");
        return true;
      },
    );
  });
  test("Deve lançar erro quando o role for inválido", async () => {
    const userMock = await userFactory.createTestUser();

    await assert.rejects(
      () => updateUserRoleService(userMock.id, "manager"),
      (erro) => {
        assert.strictEqual(erro.status, 400);
        assert.strictEqual(erro.error.detail, "Role não é válida");
        return true;
      },
    );
  });
  test("Deve lançar erro quando o usuário não existir", async () => {
    await assert.rejects(
      () => updateUserRoleService(crypto.randomUUID(), ROLES.USER),
      (erro) => {
        assert.strictEqual(erro.status, 404);
        assert.strictEqual(erro.message, "Usuário não encontrado");
        return true;
      },
    );
  });
  test("Deve impedir de remover o último administrador", async () => {
    const userMock = await userFactory.createAdminTestUser({
      role: ROLES.ADMIN,
    });

    await assert.rejects(
      () => updateUserRoleService(userMock.id, ROLES.USER),
      (erro) => {
        assert.strictEqual(erro.status, 409);
        assert.strictEqual(
          erro.error.detail,
          "O sistema deve possuir pelo menos um administrador.",
        );
        return true;
      },
    );
  });
  test("Deve permitir remover um administrador quando existir outro admnistrador", async () => {
    const userMock = await userFactory.createAdminTestUser({
      role: ROLES.ADMIN,
    });
    const userMock1 = await userFactory.createAdminTestUser({
      email: "teste@teste.com",
      role: ROLES.ADMIN,
    });

    const updatedUser = await updateUserRoleService(userMock1.id, ROLES.USER);

    assert.ok(updatedUser);
    assert.strictEqual(updatedUser.role, ROLES.USER);
    assert.strictEqual(userMock.role, ROLES.ADMIN);
  });
  test("Deve retornar o usuário sem senha", async () => {
    const userMock = await userFactory.createTestUser();

    const updatedUser = await updateUserRoleService(userMock.id, ROLES.ADMIN);

    assert.ok(!("password" in updatedUser));
  });
});

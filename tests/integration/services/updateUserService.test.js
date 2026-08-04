import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  updateUserService,
  createUserService,
} from "../../../src/services/userService.js";
import * as userFactory from "../../helpers/userFactory.js";
import "../../helpers/setup.js";

describe("updateUserService()", () => {
  test("Deve atualizar um usuário com sucesso.", async () => {
    const userMock = await userFactory.createTestUser();

    const updatedUser = await updateUserService(userMock.id, {
      name: "Gabriel",
      email: "teste@teste.com",
      birth_date: "2000-01-02",
      is_active: true,
    });

    assert.ok(updatedUser);
    assert.strictEqual(updatedUser.name, "Gabriel");
    assert.strictEqual(updatedUser.email, "teste@teste.com");
  });
  test("Deve permitir atualizacão parcial", async () => {
    const userMock = await userFactory.createTestUser();

    const updatedUser = await updateUserService(userMock.id, {
      birth_date: "1950-03-03",
    });

    assert.strictEqual(
      updatedUser.birth_date.toISOString().slice(0, 10),
      "1950-03-03",
    );
  });
  test("Deve lançar erro quando o UUID for inválido", async () => {
    await assert.rejects(
      () => updateUserService("abc-def-ghi"),
      (erro) => {
        assert.strictEqual(erro.status, 400);
        assert.strictEqual(erro.message, "UUID inválido");
        return true;
      },
    );
  });
  test("Deve lançar erro quando o usuário não existir", async () => {
    await assert.rejects(
      () => updateUserService(crypto.randomUUID()),
      (erro) => {
        assert.strictEqual(erro.status, 404);
        assert.strictEqual(erro.message, "Usuário não encontrado");
        return true;
      },
    );
  });
  test("Deve lançar erro quando nenhum campo válido for enviado", async () => {
    const userMock = await userFactory.createTestUser();
    await assert.rejects(
      () => updateUserService(userMock.id, { roda: "2", motor: "v8" }),
      (erro) => {
        assert.strictEqual(erro.status, 400);
        assert.strictEqual(
          erro.error.detail,
          "Nenhum campo enviado para atualização",
        );
        return true;
      },
    );
  });
  test("Deve lançar erro quando os dados enviados forem inválidos", async () => {
    const userMock = await userFactory.createTestUser();

    await assert.rejects(
      () => updateUserService(userMock.id, { name: "Gb" }),
      (erro) => {
        assert.strictEqual(erro.status, 400);
        assert.strictEqual(erro.message, "Dado inválido");
        return true;
      },
    );
  });
  test("Deve lançar erro quando o novo e-mail já existir", async () => {
    const user = await userFactory.createTestUser();
    const user1 = await userFactory.createTestUser({
      email: "teste@teste.com",
    });

    await assert.rejects(
      () => updateUserService(user.id, { email: user1.email }),
      (erro) => {
        assert.strictEqual(erro.status, 409);
        return true;
      },
    );
  });
  test("Deve ignorar campos que não podem ser atualizados", async () => {
    const userMock = await userFactory.createTestUser();

    const user = await updateUserService(userMock.id, {
      name: "Gabriel",
      rodas: "2",
      email: "email@teste.com",
    });

    assert.strictEqual(user.name, "Gabriel");
    assert.ok(!("rodas" in user));
    assert.strictEqual(user.email, "email@teste.com");
  });
  test("Deve retornar o usuário sem a senha", async () => {
    const userMock = await userFactory.createTestUser();

    const updatedUser = await updateUserService(userMock.id, {
      is_active: true,
    });

    assert.ok(updatedUser);
    assert.ok(!("password" in updatedUser));
    assert.strictEqual(updatedUser.is_active, true);
  });
});

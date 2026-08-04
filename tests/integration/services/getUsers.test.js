import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { getUsersService } from "../../../src/services/userService.js";
import * as userFactory from "../../helpers/userFactory.js";
import "../../helpers/setup.js";

describe("getUsersService()", () => {
  test("Deve retornar a lista de usuários", async () => {
    const createdUser = await userFactory.createTestUser();

    const users = await getUsersService();

    assert.ok(users);
  });

  test("Deve respeitar os parâmetros limit e isActive", async () => {
    const user1 = await userFactory.createActiveTestUser();
    const user2 = await userFactory.createActiveTestUser({
      email: "teste2@teste.com",
    });
    const user3 = await userFactory.createTestUser({
      email: "teste3@teste.com",
    });

    const users = await getUsersService(2, true);

    assert.strictEqual(users.length, 2);
    for (const user of users) {
      assert.strictEqual(user.is_active, true);
    }
  });
});

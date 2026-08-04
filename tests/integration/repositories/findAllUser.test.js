import test, { describe } from "node:test";
import assert from "node:assert/strict";

import "../../helpers/setup.js";

import * as userFactory from "../../helpers/userFactory.js";
import { findAllUsers } from "../../../src/repositories/userRepository.js";

describe("findAllUsers()", () => {
  test("Deve retornar uma lista de usuários", async () => {
    const user1 = await userFactory.createTestUser();
    const user2 = await userFactory.createTestUser({ email: "test@test.com" });

    const result = await findAllUsers();

    assert.ok(Array.isArray(result));
    assert.strictEqual(result.length, 2);

    assert.strictEqual(result[0].email, user1.email);
    assert.strictEqual(result[1].email, user2.email);
  });
  test("Deve respeitar o limite informado", async () => {
    const user1 = await userFactory.createTestUser();
    const user2 = await userFactory.createTestUser({ email: "test@test.com" });
    const user3 = await userFactory.createTestUser({ email: "test1@test.com" });

    const result = await findAllUsers(2);

    assert.ok(Array.isArray(result));
    assert.strictEqual(result.length, 2);

    assert.strictEqual(result[0].email, user1.email);
    assert.strictEqual(result[1].email, user2.email);
    assert.strictEqual(result[2], undefined);
  });
  test("Deve retornar apenas usuários ativos quando isActive for true", async () => {
    const user1 = await userFactory.createTestUser();
    const user2 = await userFactory.createTestUser({
      email: "test2@email.com",
      is_active: true,
    });
    const user3 = await userFactory.createTestUser({
      email: "test3@email.com",
    });
    const user4 = await userFactory.createTestUser({
      email: "test4@email.com",
      is_active: true,
    });

    const users = await findAllUsers(4, true);

    for (const user of users) {
      assert.strictEqual(user.is_active, true);
    }
  });
  test("Deve retornar apenas usuários inativos quando isActive for false", async () => {
    const user1 = await userFactory.createTestUser();
    const user2 = await userFactory.createTestUser({
      email: "test2@email.com",
    });
    const user3 = await userFactory.createTestUser({
      email: "test3@email.com",
      is_active: true,
    });
    const user4 = await userFactory.createTestUser({
      email: "test4@email.com",
    });

    const users = await findAllUsers(4, false);

    for (const user of users) {
      assert.strictEqual(user.is_active, false);
    }
  });
});

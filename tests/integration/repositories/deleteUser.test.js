import test, { describe } from "node:test";
import assert from "node:assert/strict";

import "../../helpers/setup.js";

import {
  deleteUser,
  findById,
} from "../../../src/repositories/userRepository.js";
import * as userFactory from "../../helpers/userFactory.js";

describe("deleteUser()", () => {
  test("Deve retornar null quando o usuário não existir", async () => {
    const deletedUser = await deleteUser(crypto.randomUUID());

    assert.strictEqual(deletedUser, null);
  });
  test("Deve retornar o usuário quando for deletado", async () => {
    const user = await userFactory.createTestUser();

    const deletedUser = await deleteUser(user.id);

    assert.ok(deletedUser);
    assert.strictEqual(user.id, deletedUser.id);
    assert.strictEqual(user.email, deletedUser.email);

    const userInDatebase = await findById(user.id);

    assert.strictEqual(userInDatebase, null);
  });
});

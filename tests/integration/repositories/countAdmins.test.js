import test, { describe } from "node:test";
import assert from "node:assert/strict";
import "../../helpers/setup.js";

import * as userFactory from "../../helpers/userFactory.js";
import { countAdmins } from "../../../src/repositories/userRepository.js";

describe("countAdmins()", () => {
  test("Deve retornar a quantidade correta de administradores", async () => {
    await userFactory.createAdminTestUser();

    await userFactory.createAdminTestUser({
      email: "test@gmail.com",
    });

    const result = await countAdmins();

    assert.strictEqual(result, 2);
  });

  test("Deve retornar 0 quando não houver administradores", async () => {
    await userFactory.createTestUser();

    const result = await countAdmins();

    assert.strictEqual(result, 0);
  });

  test("Deve retornar um número", async () => {
    const result = await countAdmins();

    assert.strictEqual(typeof result, "number");
  });
});

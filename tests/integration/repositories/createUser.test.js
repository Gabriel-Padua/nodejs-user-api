import { describe, test } from "node:test";
import assert from "node:assert/strict";

import "../../helpers/setup.js";

import {
  createUser,
  findById,
} from "../../../src/repositories/userRepository.js";
import pool from "../../../src/database/pool.js";

import { ROLES } from "../../../src/constants/roles.js";
import * as userFactory from "../../helpers/userFactory.js";

describe("createUser()", () => {
  test("Deve criar um usuário no banco de dados", async () => {
    const user = userFactory.makeUser();

    const createdUser = await createUser(user);

    const result = await pool.query(
      ` SELECT id, name, email FROM users WHERE id=$1`,
      [createdUser.id],
    );

    assert.strictEqual(result.rowCount, 1);
    const userInDatabase = result.rows[0];

    assert.strictEqual(userInDatabase.id, createdUser.id);
    assert.strictEqual(userInDatabase.name, createdUser.name);
    assert.strictEqual(userInDatabase.email, createdUser.email);
  });

  test("Deve retornar um usuário com um id", async () => {
    const user = userFactory.makeUser();

    const createdUser = await createUser(user);

    assert.strictEqual(typeof createdUser.id, "string");
    assert.ok(createdUser.id.length > 0);
  });

  test("Deve retornar os mesmos dados enviados", async () => {
    const user = userFactory.makeUser();

    const createdUser = await createUser(user);

    assert.strictEqual(createdUser.name, user.name);
    assert.strictEqual(createdUser.email, user.email);
    assert.strictEqual(createdUser.password, user.password);
    assert.strictEqual(
      createdUser.birth_date.toISOString().slice(0, 10),
      user.birth_date,
    );
  });

  test("Deve definir a role padrão como USER", async () => {
    const user = userFactory.makeUser();

    const createdUser = await createUser(user);

    assert.strictEqual(createdUser.role, ROLES.USER);
  });

  test("Deve definir is_active como false", async () => {
    const user = userFactory.makeUser();

    const createdUser = await createUser(user);

    assert.strictEqual(createdUser.is_active, false);
  });

  test("Deve preencher created_at", async () => {
    const user = userFactory.makeUser();

    const createdUser = await createUser(user);

    assert.ok(createdUser.created_at instanceof Date);
  });

  test("Deve preencher updated_at", async () => {
    const user = userFactory.makeUser();

    const createdUser = await createUser(user);

    assert.ok(createdUser.updated_at instanceof Date);
  });
});

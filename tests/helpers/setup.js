import { beforeEach, afterEach, after } from "node:test";
import { clearDatabase, closeDatabase } from "./database.js";

beforeEach(async () => {
  await clearDatabase();
});

afterEach(async () => {
  await clearDatabase();
});

after(async () => {
  await closeDatabase();
});

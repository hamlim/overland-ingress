import { expect, test } from "bun:test";
import app, { Env } from ".";

test("Should return 200 response", async () => {
  const res = await app.fetch(
    new Request("http://localhost/"),
    { DB: {} } as unknown as Env,
    {} as unknown as ExecutionContext,
  );
  expect(res.status).toBe(200);
});

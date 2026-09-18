import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { CryptoLibError, hash, hashFile } from "../src/index.ts";

test("hash defaults to sha256 hex", () => {
  assert.equal(
    hash("hello"),
    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  );
});

test("hash accepts buffers and custom algorithms", () => {
  const fromString = hash("hello", { algorithm: "sha512" });
  const fromBuffer = hash(Buffer.from("hello"), { algorithm: "sha512", encoding: "base64url" });

  assert.equal(fromString.length, 128);
  assert.match(fromBuffer, /^[A-Za-z0-9_-]+$/);
});

test("hash rejects unknown algorithms", () => {
  assert.throws(() => hash("hello", { algorithm: "not-a-real-hash" }), (error: unknown) => {
    assert.ok(error instanceof CryptoLibError);
    assert.equal(error.code, "UNSUPPORTED_ALGORITHM");
    return true;
  });
});

test("hashFile streams file contents", async () => {
  const dir = await mkdtemp(join(tmpdir(), "crypto-lib-"));
  const filePath = join(dir, "message.txt");
  await writeFile(filePath, "hello");

  assert.equal(await hashFile(filePath), hash("hello"));
});

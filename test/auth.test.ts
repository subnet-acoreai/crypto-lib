import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CryptoLibError,
  generateKeyPair,
  hashPassword,
  sign,
  verify,
  verifyPassword,
} from "../src/index.ts";

test("hashPassword and verifyPassword round-trip", async () => {
  const stored = await hashPassword("correct horse battery staple");

  assert.match(stored, /^scrypt\$16384\$8\$1\$[0-9a-f]+\$[0-9a-f]+$/);
  assert.equal(await verifyPassword("correct horse battery staple", stored), true);
  assert.equal(await verifyPassword("wrong password", stored), false);
});

test("hashPassword rejects empty passwords", async () => {
  await assert.rejects(() => hashPassword(""), (error: unknown) => {
    assert.ok(error instanceof CryptoLibError);
    assert.equal(error.code, "INVALID_INPUT");
    return true;
  });
});

test("verifyPassword rejects malformed hashes", async () => {
  await assert.rejects(() => verifyPassword("password", "not-a-hash"), (error: unknown) => {
    assert.ok(error instanceof CryptoLibError);
    assert.equal(error.code, "INVALID_HASH");
    return true;
  });
});

test("Ed25519 sign and verify round-trip", () => {
  const { publicKey, privateKey } = generateKeyPair();
  const signature = sign("message", privateKey);

  assert.equal(verify("message", signature, publicKey), true);
  assert.equal(verify("other", signature, publicKey), false);
});

test("Ed25519 verify rejects a different key pair", () => {
  const alice = generateKeyPair();
  const bob = generateKeyPair();
  const signature = sign("message", alice.privateKey);

  assert.equal(verify("message", signature, bob.publicKey), false);
});

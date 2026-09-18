import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CryptoLibError,
  decrypt,
  decryptUtf8,
  encrypt,
  generateKey,
  hmac,
  randomBase64Url,
  randomBytes,
  randomHex,
  randomInt,
  randomToken,
  randomUUID,
  timingSafeEqual,
} from "../src/index.ts";

test("hmac is deterministic and key-dependent", () => {
  const a = hmac("payload", "secret");
  const b = hmac("payload", "secret");
  const c = hmac("payload", "other");

  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.equal(a.length, 64);
});

test("hmac rejects empty keys", () => {
  assert.throws(() => hmac("payload", ""), (error: unknown) => {
    assert.ok(error instanceof CryptoLibError);
    assert.equal(error.code, "INVALID_KEY");
    return true;
  });
});

test("AES-256-GCM round-trips unicode text", () => {
  const key = generateKey();
  const payload = encrypt("hello 🔐", key);

  assert.match(payload, /^c1\./);
  assert.equal(decryptUtf8(payload, key), "hello 🔐");
});

test("AES-256-GCM accepts hex keys and empty plaintext", () => {
  const key = generateKey();
  const payload = encrypt("", key.toString("hex"));

  assert.equal(decrypt(payload, key).length, 0);
});

test("AES-256-GCM rejects wrong keys and tampering", () => {
  const key = generateKey();
  const payload = encrypt("secret", key);
  const tampered = `${payload.slice(0, -1)}${payload.endsWith("a") ? "b" : "a"}`;

  assert.throws(() => decrypt(payload, generateKey()), (error: unknown) => {
    assert.ok(error instanceof CryptoLibError);
    assert.equal(error.code, "DECRYPT_FAILED");
    return true;
  });

  assert.throws(() => decrypt(tampered, key), (error: unknown) => {
    assert.ok(error instanceof CryptoLibError);
    assert.equal(error.code, "DECRYPT_FAILED");
    return true;
  });
});

test("AES-256-GCM binds optional AAD", () => {
  const key = generateKey();
  const payload = encrypt("body", key, { aad: "context" });

  assert.equal(decryptUtf8(payload, key, { aad: "context" }), "body");
  assert.throws(() => decryptUtf8(payload, key), (error: unknown) => {
    assert.ok(error instanceof CryptoLibError);
    assert.equal(error.code, "DECRYPT_FAILED");
    return true;
  });
});

test("generateKey rejects undersized material on decrypt", () => {
  const payload = encrypt("x", generateKey());
  assert.throws(() => decrypt(payload, Buffer.alloc(16)), (error: unknown) => {
    assert.ok(error instanceof CryptoLibError);
    assert.equal(error.code, "INVALID_KEY");
    return true;
  });
});

test("random helpers produce values of the expected shape", () => {
  assert.equal(randomBytes(16).length, 16);
  assert.equal(randomHex(8).length, 16);
  assert.match(randomBase64Url(12), /^[A-Za-z0-9_-]+$/);
  assert.match(randomUUID(), /^[0-9a-f-]{36}$/);
  assert.equal(randomToken(8).length > 0, true);

  const value = randomInt(5, 9);
  assert.ok(value >= 5 && value < 9);
});

test("timingSafeEqual compares equal and unequal secrets", () => {
  assert.equal(timingSafeEqual("abc", "abc"), true);
  assert.equal(timingSafeEqual("abc", "abd"), false);
  assert.equal(timingSafeEqual("abc", "ab"), false);
});

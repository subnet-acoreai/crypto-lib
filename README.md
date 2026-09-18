# crypto-lib

A small, secure Node.js cryptography toolkit built on the native [`node:crypto`](https://nodejs.org/api/crypto.html) module. Use it when you need hashing, HMAC, AES-256-GCM, scrypt password hashes, Ed25519 signatures, and cryptographically strong random values — without extra native dependencies.

**Requires Node.js 18+.** This package is ESM-only.

## Install

```bash
npm install crypto-lib
```

Before publishing, change `"name"` in `package.json` if `crypto-lib` is already taken on npm.

## Quick start

```js
import {
  hash,
  hmac,
  generateKey,
  encrypt,
  decryptUtf8,
  hashPassword,
  verifyPassword,
  generateKeyPair,
  sign,
  verify,
  randomToken,
} from "crypto-lib";

hash("hello"); // SHA-256 hex
hmac("hello", "secret");

const key = generateKey();
const payload = encrypt("classified", key);
decryptUtf8(payload, key); // "classified"

const stored = await hashPassword("correct horse");
await verifyPassword("correct horse", stored); // true

const { publicKey, privateKey } = generateKeyPair();
const signature = sign("payload", privateKey);
verify("payload", signature, publicKey); // true

randomToken(); // URL-safe random token
```

## API

### Hashing

- `hash(data, { algorithm = "sha256", encoding = "hex" })` — digest a string, `Buffer`, or `Uint8Array`
- `hashFile(path, options)` — stream a file from disk and hash it

### HMAC

- `hmac(data, key, { algorithm = "sha256", encoding = "hex" })`

### Authenticated encryption (AES-256-GCM)

- `generateKey()` — 32 random bytes
- `encrypt(plaintext, key, { aad })` — returns `c1.<iv>.<tag>.<ciphertext>` (base64url)
- `decrypt(payload, key, { aad })` — returns a `Buffer`
- `decryptUtf8(payload, key, { aad })` — returns a UTF-8 string

Keys must be 32 bytes. Strings are accepted as 64-char hex or base64/base64url.

Wrong keys, missing AAD, or tampered payloads throw `CryptoLibError` with code `DECRYPT_FAILED`.

### Passwords (scrypt)

- `hashPassword(password, { n, r, p })` — format `scrypt$n$r$p$saltHex$keyHex`
- `verifyPassword(password, storedHash)` — constant-time compare of the derived key

### Signatures (Ed25519)

- `generateKeyPair()` — PEM public/private key pair
- `sign(data, privateKey)` — base64url signature
- `verify(data, signature, publicKey)` — boolean

### Random values

- `randomBytes(size)`
- `randomHex(size)`
- `randomBase64Url(size)`
- `randomInt(min, max)` — `min` inclusive, `max` exclusive
- `randomUUID()`
- `randomToken(bytes)` — URL-safe token

### Compare

- `timingSafeEqual(a, b)` — constant-time equality; different lengths return `false`

### Errors

All validation and crypto failures throw `CryptoLibError` with a `code` such as `INVALID_INPUT`, `INVALID_KEY`, `INVALID_PAYLOAD`, `DECRYPT_FAILED`, `INVALID_HASH`, or `UNSUPPORTED_ALGORITHM`.

## Security notes

- Algorithms come from Node.js. Do not treat this as a place to invent new ciphers.
- Prefer AES-256-GCM and Ed25519. MD5 and SHA-1 are available only if you pass them explicitly to `hash` / `hmac`.
- Store AES keys and Ed25519 private keys outside source control.
- `hashPassword` is for passwords. Use `hash` / `hmac` for integrity of data, not for user passwords.

## Scripts

```bash
npm test          # run tests
npm run build     # emit dist/ with type declarations
npm pack          # preview the tarball that npm publish will upload
```

## Publish to npm

1. Use a unique package name in `package.json`.
2. Set `author`, `repository`, and `homepage`.
3. Sign in: `npm login`
4. Publish: `npm publish`

`prepack` runs tests and the TypeScript build automatically on `npm pack` and `npm publish`.

## License

MIT

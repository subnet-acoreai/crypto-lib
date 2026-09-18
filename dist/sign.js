import { generateKeyPairSync, sign as nodeSign, verify as nodeVerify, } from "node:crypto";
import { fail } from "./errors.js";
import { assertNonEmptyString, fromBase64Url, toBase64Url, toBuffer } from "./encoding.js";
/**
 * Generate an Ed25519 key pair as PEM strings.
 */
export function generateKeyPair() {
    const { publicKey, privateKey } = generateKeyPairSync("ed25519");
    return {
        publicKey: publicKey.export({ type: "spki", format: "pem" }).toString(),
        privateKey: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    };
}
/**
 * Sign data with an Ed25519 private key. Returns a base64url signature.
 */
export function sign(data, privateKey) {
    if (typeof privateKey === "string") {
        assertNonEmptyString(privateKey, "privateKey");
    }
    const signature = nodeSign(null, toBuffer(data), privateKey);
    return toBase64Url(signature);
}
/**
 * Verify an Ed25519 signature.
 */
export function verify(data, signature, publicKey) {
    assertNonEmptyString(signature, "signature");
    if (typeof publicKey === "string") {
        assertNonEmptyString(publicKey, "publicKey");
    }
    try {
        return nodeVerify(null, toBuffer(data), publicKey, fromBase64Url(signature));
    }
    catch {
        fail("Signature verification failed: invalid key or signature encoding", "VERIFY_FAILED");
    }
}
//# sourceMappingURL=sign.js.map
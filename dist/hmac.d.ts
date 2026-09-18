import { type BinaryToTextEncoding } from "node:crypto";
import { type Bytes } from "./encoding.js";
export interface HmacOptions {
    algorithm?: string;
    encoding?: BinaryToTextEncoding;
}
/**
 * Compute an HMAC. Defaults to HMAC-SHA-256 hex.
 */
export declare function hmac(data: Bytes, key: Bytes, options?: HmacOptions): string;
//# sourceMappingURL=hmac.d.ts.map
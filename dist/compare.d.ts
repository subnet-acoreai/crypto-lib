import { type Bytes } from "./encoding.js";
/**
 * Constant-time comparison for secrets. Different lengths always return false
 * without throwing, and still perform a dummy compare to reduce timing leaks.
 */
export declare function timingSafeEqual(a: Bytes, b: Bytes): boolean;
//# sourceMappingURL=compare.d.ts.map
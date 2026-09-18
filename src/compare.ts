import { timingSafeEqual as nodeTimingSafeEqual } from "node:crypto";
import { toBuffer, type Bytes } from "./encoding.js";

/**
 * Constant-time comparison for secrets. Different lengths always return false
 * without throwing, and still perform a dummy compare to reduce timing leaks.
 */
export function timingSafeEqual(a: Bytes, b: Bytes): boolean {
  const left = toBuffer(a);
  const right = toBuffer(b);

  if (left.length !== right.length) {
    nodeTimingSafeEqual(left, left);
    return false;
  }

  return nodeTimingSafeEqual(left, right);
}

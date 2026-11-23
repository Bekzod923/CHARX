import ru from "./ru";

/**
 * Every other locale's dictionary is typed against this exact shape, so a
 * missing or extra key in en.ts / uz.ts is a compile-time error, not a
 * silent runtime gap.
 */
export type Dictionary = typeof ru;

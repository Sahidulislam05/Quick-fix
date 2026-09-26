export function unwrapList<T>(raw: unknown, nestedKey: string): T[] {
  if (Array.isArray(raw)) return raw as T[];

  if (raw && typeof raw === "object" && nestedKey in raw) {
    const value = (raw as Record<string, unknown>)[nestedKey];
    if (Array.isArray(value)) return value as T[];
  }

  console.warn(
    `unwrapList: expected an array or a "${nestedKey}" key, got:`,
    raw,
  );
  return [];
}

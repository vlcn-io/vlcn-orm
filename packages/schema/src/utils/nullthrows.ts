export default function nullthrows<T>(x?: T, msg?: string): T {
  if (x == null) {
    throw new Error(msg);
  }

  return x;
}

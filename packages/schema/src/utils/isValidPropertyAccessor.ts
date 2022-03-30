export default function isValidPropertyAccessor(a: string): boolean {
  return (a.match(/[A-z_$]+[A-z0-9_$]*/) || [])[0] === a;
}

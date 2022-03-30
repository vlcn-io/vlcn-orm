export default function upcaseAt(str: string, i: number) {
  return str.substr(0, i) + str.substr(i, 1).toUpperCase() + str.substr(i + 1);
}

// @ts-ignore
import ts from 'typescript';

export function filter<S extends ts.Node>(n: ts.Node, pred: (n: ts.Node) => n is S): S[] {
  const ret: S[] = [];
  n.forEachChild(c => {
    if (pred(c)) {
      ret.push(c);
    }
  });
  return ret;
}

export function map<R>(n: ts.Node, m: (n: ts.Node) => R): R[] {
  const ret: R[] = [];
  n.forEachChild(c => {
    ret.push(m(c));
  });
  return ret;
}

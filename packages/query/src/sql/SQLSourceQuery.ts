import { Spec } from "../../Model.js";
import { SourceQuery } from "../Query.js";
import SQLSourceExpression, { SQLResult } from "./SqlSourceExpression.js";

export default class SQLSourceQuery<T> extends SourceQuery<T> {
  constructor(spec: Spec<T>) {
    super(new SQLSourceExpression(spec, { what: "model" }));
  }
}

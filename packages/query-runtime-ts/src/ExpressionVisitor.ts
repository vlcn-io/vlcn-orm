import { filter, hop, orderBy, take } from "./Expression.js";

export interface ExpressionVisitor<TRet> {
  filter(f: ReturnType<typeof filter>): TRet;
  orderBy(o: ReturnType<typeof orderBy>): TRet;
  limit(l: ReturnType<typeof take>): TRet;
  hop(h: ReturnType<typeof hop>): TRet;
}

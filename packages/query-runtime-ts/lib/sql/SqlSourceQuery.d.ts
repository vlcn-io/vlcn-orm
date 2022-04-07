import { ModelSpec } from '@aphro/model-runtime-ts';
import { SourceQuery } from '../Query.js';
export default class SQLSourceQuery<T> extends SourceQuery<T> {
    constructor(spec: ModelSpec<T>);
}

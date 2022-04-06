import { SourceQuery } from '../Query.js';
import SQLSourceExpression from './SqlSourceExpression.js';
export default class SQLSourceQuery extends SourceQuery {
    constructor(spec) {
        super(new SQLSourceExpression(spec, { what: 'model' }));
    }
}
//# sourceMappingURL=SqlSourceQuery.js.map
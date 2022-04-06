export class ModelFieldGetter {
    fieldName;
    constructor(fieldName) {
        this.fieldName = fieldName;
    }
    get(model) {
        return model._get(this.fieldName);
    }
}
//# sourceMappingURL=Field.js.map
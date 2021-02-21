import { Field, FieldType, MapField } from "../schema/Field"

function fieldToTsType(field: Field<FieldType>): string {
  switch (field.type) {
    case 'int':
      return 'number';
    case 'map':
      return `Map<string, ${fieldToTsType((field as MapField<any, any>).valueType)}>`;
  }

  return field.type;
}

export {
  fieldToTsType,
};

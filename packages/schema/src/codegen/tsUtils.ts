import { Field, FieldType, MapField } from "../schema/Field"

function fieldToTsType(field: Field<FieldType>): string {
  switch (field.type) {
    case 'id':
      // TODO: should be id_of and a type alias.
      return 'string';
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

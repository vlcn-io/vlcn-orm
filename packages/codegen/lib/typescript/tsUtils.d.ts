import { Field, RemoveNameField } from '@aphro/schema';
declare function fieldToTsType(field: RemoveNameField<Field>): string;
export { fieldToTsType };

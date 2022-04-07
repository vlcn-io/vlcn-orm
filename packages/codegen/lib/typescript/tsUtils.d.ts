import { Field, Import, RemoveNameField } from '@aphro/schema-api';
declare function fieldToTsType(field: RemoveNameField<Field>): string;
export declare function importToString(val: Import): string;
export declare function importsToString(imports: readonly Import[]): string;
export declare function collapseImports(imports: readonly Import[]): readonly Import[];
export { fieldToTsType };

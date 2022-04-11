// class SqlClass<T> {
//   constructor(private types: ReplacementType[], private values: T[]) {}

//   toString(engine: 'postgres' = 'postgres'): string {
//     // escape and quote values based on types.
//     return '';
//   }
// }

// export type SQL = SqlClass<any>;

// type TypeMappings = {
//   T: string;
//   c: string;
//   s: string;
//   n: number;
//   cL: string[];
//   sL: string[];
//   nL: number[];
//   S: SQL;
//   SL: SQL[];
// };

// type ReplacementType = keyof TypeMappings;
// type Type<T extends ReplacementType> = TypeMappings[T];

// type Types<Tuple extends [...ReplacementType[]]> = {
//   // @ts-ignore
//   [Index in keyof Tuple]: Type<Tuple[Index]>; // <--- >>> error in defining my type. <<<
// };

// export default function sql<T extends [...ReplacementType[]]>(
//   s: TemplateStringsArray,
//   ...types: T
// ): (...values: Types<T>) => SQL {
//   return (...values) => new SqlClass(types, values);
// }

// const checkedFormatString = sql`SELECT * FROM ${'T'} WHERE ${'c'} = ${'n'}`;

// // >>> but types check correctly when using the function that had the error in its type declaration <<<
// checkedFormatString('user', 'id', 1);

// // >>> correctly catches incorrect types being passed <<<
// checkedFormatString(0, 1, 2);
// checkedFormatString('f', 1, 'f');

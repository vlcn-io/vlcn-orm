import { NodeReference, SchemaFileAst, ValidationError } from '@aphro/schema-api';

export default function condenseEntities<Tc, Ta>(
  entities: {
    [key: string]: Ta;
  },
  preamble: SchemaFileAst['preamble'],
  condensor: (entity: Ta, preamble: SchemaFileAst['preamble']) => [ValidationError[], Tc],
): [
  ValidationError[],
  {
    [key: string]: Tc;
  },
] {
  let errors: ValidationError[] = [];
  const condensedEntities: { [key: NodeReference]: Tc } = Object.entries(entities).reduce(
    (l: { [key: string]: Tc }, [key, entity]) => {
      const [entityErrors, condensed] = condensor(entity, preamble);
      errors = errors.concat(entityErrors);
      l[key] = condensed;
      return l;
    },
    {},
  );
  return [errors, condensedEntities];
}

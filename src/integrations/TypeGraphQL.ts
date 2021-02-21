class TypeGraphQL {
  expose(fieldsOrEdges: string[]) {
    return this;
  }
}

export default function tgql() {
  return new TypeGraphQL();
}

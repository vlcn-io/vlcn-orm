type Import = {
  name?: string | null,
  as?: string | null,
  from: string,
};

export default class ModuleConfig {
  imports: Map<string, Import> = new Map();

  import(...imports: Import[]): this {
    // Using a map so we don't get duplicative imports
    for (const i of imports) {
      this.imports.set(
        // Map key is just the structure in json
        JSON.stringify({
          // ensure consistent ordering
          name: i.name,
          as: i.as,
          from: i.from,
        }),
        i,
      );
    }

    return this;
  }
}

export function tsImport(name: string | null, as: string | null, from: string): Import {
  return {
    name,
    as,
    from,
  };
}

export function javaImport(from: string): Import {
  return {
    from,
  };
}

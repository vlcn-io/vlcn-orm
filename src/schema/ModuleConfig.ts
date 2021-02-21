type Import = {
  name?: string,
  as?: string,
  from: string,
};

export default class ModuleConfig {
  imports: Import[];

  import(...imports: Import[]): this {
    this.imports = this.imports.concat(imports);
    return this;
  }
}

export function tsImport(name: string, as: string, from: string): Import {
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

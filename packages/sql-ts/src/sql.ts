class SqlClass<T extends [...ReplacementType[]]> {
  constructor(private parts: TemplateStringsArray, private types: T, private values: Types<T>) {}

  toString(dialect: 'sqlite' | 'postgres'): [string, any[]] {
    // TODO: dialect conversion
    return [this.pullStatement(), this.pullBindings()];
  }

  private sanitize(i: number): string {
    const t = this.types[i];
    switch (t) {
      case 'T':
      case 'C':
      case 't':
        return this.values[i] as string;
      case 'Q':
        return (this.values[i] as SQL).pullStatement();
      case 'LQ':
        return (this.values[i] as SQL[]).map(q => q.pullStatement()).join('');
      case 'd':
      case 's':
      case 'Ld':
      case 'Ls':
        return '?';
      default:
        unreachable(t);
    }
  }

  pullBindings(): any[] {
    let ret = [];
    for (let i = 0; i < this.values.length; ++i) {
      const type = this.types[i];
      switch (type) {
        case 'T':
        case 'C':
        case 't':
          break;
        case 'd':
        case 's':
        case 'Ld':
        case 'Ls':
          ret.push(this.values[i]);
          break;
        case 'Q':
          ret = ret.concat((this.values[i] as SQL).pullBindings());
          break;
        case 'LQ':
          ret = ret.concat((this.values[i] as SQL[]).flatMap(q => q.pullBindings()));
          break;
        default:
          unreachable(type);
      }
    }
    return ret;
  }

  pullStatement(): string {
    return this.parts
      .map((part, i) => {
        return part + (i < this.values.length ? this.sanitize(i) : '');
      })
      .join('');
  }
}

export type SQL = SqlClass<any>;

type TypeMappings = {
  T: string;
  C: string;
  t: string;
  Q: SQL;
  LQ: SQL[];
  d: number;
  s: string;
  Ld: number[];
  Ls: string[];
};

type ReplacementType = keyof TypeMappings;
type Type<T extends ReplacementType> = TypeMappings[T];

type Types<Tuple extends [...ReplacementType[]]> = {
  [Index in keyof Tuple]: Type<Tuple[Index extends number ? Index : never]>;
};

export function sql<T extends [...ReplacementType[]]>(
  parts: TemplateStringsArray,
  ...types: T
): (...values: Types<T>) => SQL {
  return (...values) => new SqlClass(parts, types, values);
}

function unreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

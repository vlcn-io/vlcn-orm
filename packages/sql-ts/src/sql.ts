export type SQL = SqlClass<any>;

type TypeMappings = {
  T: string;
  C: string;
  LC: string[];
  t: string;
  l: string;
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
  // @ts-ignore -- fixing this breaks type checking on actual usage.
  [Index in keyof Tuple]: Type<Tuple[Index]>;
};

class SqlClass<T extends [...ReplacementType[]]> {
  constructor(private parts: TemplateStringsArray, private types: T, private values: Types<T>) {}

  toString(dialect: 'sqlite'): [string, any[]] {
    // TODO: dialect conversion
    return [this.pullStatement() + ';', this.pullBindings()];
  }

  private sanitize(i: number): string {
    const t = this.types[i];
    switch (t) {
      case 'LC':
        return (this.values[i] as string[]).map(this.sanitizeColumn).join(', ');
      case 'C':
        return this.sanitizeColumn(this.values[i] as string);
      case 'T':
        return '`' + this.values[i] + '`';
      case 'Q':
        return (this.values[i] as SQL).pullStatement();
      case 'LQ':
        return (this.values[i] as SQL[]).map(q => q.pullStatement()).join(', ');
      case 't':
      case 'l':
        return this.values[i] as string;
      case 'd':
      case 's':
      case 'Ld':
      case 'Ls':
        return '?';
      default:
        unreachable(t);
    }
  }

  private sanitizeColumn(column: string): string {
    const parts = column.split('.');
    return parts.map(p => '`' + p + '`').join('.');
  }

  pullBindings(): any[] {
    let ret: any[] = [];
    for (let i = 0; i < this.values.length; ++i) {
      const type = this.types[i];
      switch (type) {
        case 'T':
        case 'LC':
        case 'C':
        case 't':
        case 'l':
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

export function sql<T extends [...ReplacementType[]]>(
  parts: TemplateStringsArray,
  ...types: T
): (...values: Types<T>) => SQL {
  return (...values) => new SqlClass(parts, types, values);
}

function unreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

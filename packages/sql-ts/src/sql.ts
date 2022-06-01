/**
 * So the day after writing this I was browsing my old `fk-your-frameworks` project in order to create the TODO-MVC
 * example for [Aphrodite](https://aphrodite.sh). The TODO example project being the original reason for writing this
 * file (because Knexjs doesn't work in the browser). While looking at `fk-your-frameworks` I remembered that
 * a former Facebooker contributed to it. Browsing what he was up to these days and lo and behold he has spent
 * a ton of time creating a Facebook inspired SQL library for TypeScript:
 * https://www.atdatabases.org/docs/sql
 *
 * We should replace this file with @databases/sql. They're both inspired by Facebook's SQL library and
 * similar in that regard. His, however, has more than 4 hrs of work put into it and has a much cleaner API :)
 */

export type SQL = SqlClass<any>;

type TypeMappings = {
  T: string; // table name
  C: string; // column name
  LC: string[]; // list of column names
  t: string; // type name
  l: string; // "literal" / "raw"
  Q: SQL;
  LQ: SQL[]; // list of queries
  LQA: SQL[]; // list of queries joined by AND
  'LQ,': SQL[]; // list of queries joined by ,
  'Q?': SQL | null; // maybe a query
  d: number;
  s: string;
  a: any;
  Ld: number[];
  Ls: string[];
  La: any[]; // list of any
  'L?': number; // a number of ? marks to insert
  LR: any[][];
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
    return [this.pullStatement().trim() + ';', this.pullBindings()];
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
      case 'Q?':
        if (this.values[i] == null) {
          return '';
        }

      // intentional fall-through
      case 'Q':
        return (this.values[i] as SQL).pullStatement();
      case 'LQ':
        return (this.values[i] as SQL[]).map(q => q.pullStatement()).join(' ');
      case 'LQA':
        return (this.values[i] as SQL[]).map(q => q.pullStatement()).join(' AND ');
      case 'LQ,':
        return (this.values[i] as SQL[]).map(q => q.pullStatement()).join(', ');
      case 't':
      case 'l':
        return this.values[i] as string;
      case 'd':
      case 's':
      case 'a':
      case 'Ld':
      case 'Ls':
      case 'La':
        return '?';
      case 'LR':
        return (this.values[i] as [][])
          .map(v => '(' + v.map(v => '?').join(', ') + ')')
          .join(',\n');
      case 'L?':
        const count = this.values[i] as number;
        const marks: string[] = [];
        for (let i = 0; i < count; ++i) {
          marks.push('?');
        }
        return marks.join(', ');
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
        case 'L?':
          break;
        case 'd':
        case 's':
        case 'Ld':
        case 'Ls':
        case 'La':
        case 'a':
          const v = this.values[i];
          ret.push(v === undefined ? null : v);
          break;
        case 'LR':
          ret = ret.concat(
            (this.values[i] as [][]).flatMap(a => a).map(x => (x === undefined ? null : x)),
          );
          break;
        case 'Q?':
          if (this.values[i] == null) {
            break;
          }
        // intentional fall-through
        case 'Q':
          ret = ret.concat((this.values[i] as SQL).pullBindings());
          break;
        case 'LQ':
        case 'LQA':
        case 'LQ,':
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

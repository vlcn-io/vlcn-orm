import { escapePostgresIdentifier, escapeSQLiteIdentifier } from '@databases/escape-identifier';
import { FormatConfig } from '@databases/sql';
export { default as sql, SQLQuery } from '@databases/sql';

const pgFormat: FormatConfig = {
  escapeIdentifier: str => escapePostgresIdentifier(str),
  formatValue: (value, index) => ({ placeholder: `$${index + 1}`, value }),
};

const sqliteFormat: FormatConfig = {
  escapeIdentifier: str => escapeSQLiteIdentifier(str),
  formatValue: value => ({ placeholder: '?', value }),
};

const error = {
  escapeIdentifier: (str: string) => {
    throw new Error('Memory storage should not go through sql formatting');
  },
  formatValue: (value: unknown) => {
    throw new Error('Memory storage should not go through sql formatting');
  },
} as const;

export const formatters: { [key in 'sqlite' | 'postgres' | 'memory' | 'ephemeral']: FormatConfig } =
  {
    sqlite: sqliteFormat,
    postgres: pgFormat,
    ephemeral: error,
    memory: error,
  } as const;

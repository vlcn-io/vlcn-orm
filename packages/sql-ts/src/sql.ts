import { escapePostgresIdentifier, escapeSQLiteIdentifier } from '@databases/escape-identifier';
import { FormatConfig } from '@databases/sql';
export { default as sql, SQLQuery } from '@databases/sql';

export const pgFormat: FormatConfig = {
  escapeIdentifier: str => escapePostgresIdentifier(str),
  formatValue: (value, index) => ({ placeholder: `$${index + 1}`, value }),
};

export const sqliteFormat: FormatConfig = {
  escapeIdentifier: str => escapeSQLiteIdentifier(str),
  formatValue: value => ({ placeholder: '?', value }),
};

export const formatters: { [key in 'sqlite' | 'postgres']: FormatConfig } = {
  sqlite: sqliteFormat,
  postgres: pgFormat,
};

import { FormatConfig, SQLQuery } from '@databases/sql';
import connect, { DatabaseConnection, sql } from '@databases/sqlite';
import { escapeSQLiteIdentifier } from '@databases/escape-identifier';

const sqliteFormat: FormatConfig = {
  escapeIdentifier: str => escapeSQLiteIdentifier(str),
  formatValue: value => ({ placeholder: '?', value }),
};

export default async function setupDb(): Promise<DatabaseConnection> {
  const db = connect();

  // Process schemas serially. Some depend on one another
  // and not a big enough deal to parallelize those that do not.
  await db.query(sql.file('../schemas/crr_db_version.sqlite.sql'));
  await db.query(sql.file('../schemas/crr_peer_id.sqlite.sql'));
  await db.query(sql.file('../schemas/1_todo_crr.sqlite.sql'));
  await db.query(sql.file('../schemas/2_todo_view.sqlite.sql'));
  await db.query(sql.file('../schemas/3_insert_todo_trig.sqlite.sql'));
  await db.query(sql.file('../schemas/4_update_todo_trig.sqlite.sql'));
  await db.query(sql.file('../schemas/5_delete_todo_trig.sqlite.sql'));
  await db.query(sql.file('../schemas/6_todo_patch.sqlite.sql'));
  await db.query(sql.file('../schemas/7_insert_todo_patch.sqlite.sql'));
  await db.query(sql.file('../schemas/8_todo_vector_clocks.sqlite.sql'));

  return db;
}

/* Schema and initalization of locks */

DROP TABLE IF EXISTS lock_tbl;
CREATE TABLE lock_tbl(
  tbl text PRIMARY KEY,
  trigger_lock integer DEFAULT 0
);

INSERT INTO lock_tbl(
  tbl
) VALUES
  (
    "crr_a"
  );

INSERT INTO lock_tbl(
    tbl
) VALUES
  (
    "crr_b"
  );

INSERT INTO lock_tbl(
      tbl
) VALUES
  (
    "crr_c"
  );

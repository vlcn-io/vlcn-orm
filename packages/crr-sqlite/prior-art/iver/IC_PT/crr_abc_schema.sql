
DROP TABLE IF EXISTS crr_a;
CREATE TABLE crr_a (
  uuid blob PRIMARY KEY,
  b blob,
  crr_b integer,
  crr_cl integer DEFAULT 1,
  FOREIGN KEY(b) REFERENCES crr_b(uuid)
);

DROP TABLE IF EXISTS crr_b;
CREATE TABLE crr_b(
  uuid blob PRIMARY KEY,
  c blob,
  crr_c integer,
  crr_cl integer DEFAULT 1,
  FOREIGN KEY(c) REFERENCES crr_c(uuid)
);

DROP TABLE IF EXISTS crr_c;
CREATE TABLE crr_c(
  uuid blob PRIMARY KEY,
  a blob,
  crr_a integer,
  crr_cl integer DEFAULT 1,
  FOREIGN KEY(a) REFERENCES crr_a(uuid)
);

/* Temporary tables used to store old values in a merge */
DROP TABLE IF EXISTS crr_cpy_a;
CREATE TABLE crr_cpy_a (
  uuid blob PRIMARY KEY,
  b blob,
  crr_b integer,
  crr_cl integer
);

DROP TABLE IF EXISTS crr_cpy_b;
CREATE TABLE crr_cpy_b (
  uuid blob PRIMARY KEY,
  c blob,
  crr_c integer,
  crr_cl integer
);

DROP TABLE IF EXISTS crr_cpy_c;
CREATE TABLE crr_cpy_c (
  uuid blob PRIMARY KEY,
  a blob,
  crr_a integer,
  crr_cl integer
);

BEGIN TRANSACTION;

/* We assume for this prototype that foreign keys are on */
/* Turn off foreign_key violations before merge, so constraints can be fixed locally*/
PRAGMA foreign_keys = OFF;

/* Disable triggers */
UPDATE db1.lock_tbl
    SET trigger_lock = 1 WHERE tbl = "crr_a";
UPDATE db1.lock_tbl
    SET trigger_lock = 1 WHERE tbl = "crr_b";
UPDATE db1.lock_tbl
    SET trigger_lock = 1 WHERE tbl = "crr_c";

/*
  PROBLEM:
        To undo a row insertion or deletion, we simply increment
        the causal length by one.

        To undo an attribute update augmented with the LWWregister CRDT, we set the attribute with the old value, using
        the current clock value as the timestamp. In order to be able to
        generate the undo update, the message of an attribute update
        also includes the old value of the attribute.
*/

/*
  SOLUTION:
        Store old values in temporary table
*/
  INSERT INTO db1.crr_cpy_a SELECT * FROM db1.crr_a;
  INSERT INTO db1.crr_cpy_b SELECT * FROM db1.crr_b;
  INSERT INTO db1.crr_cpy_c SELECT * FROM db1.crr_c;



/*Update local tables cr layer on all uuids shared with forign table and all
  UUIDs unique to the forign table (LEFT JOIN forign local)*/
INSERT OR REPLACE INTO db1.crr_a(
    uuid,
    b,
    crr_b,
    crr_cl
    )
    SELECT
      t2.uuid
      END,
      CASE
          WHEN t1.b IS NULL THEN t2.b
          WHEN t2.b IS NULL THEN t1.b
          WHEN t1.crr_b > t2.crr_b THEN t1.b
          ELSE t2.b
      END,
      CASE
          WHEN t1.crr_b IS NULL THEN t2.crr_b
          WHEN t2.crr_b IS NULL THEN t1.crr_b
          WHEN t1.crr_b > t2.crr_b THEN t1.crr_b
          ELSE t2.crr_b
      END,
      CASE
          WHEN t1.crr_cl IS NULL THEN t2.crr_cl
          WHEN t2.crr_cl IS NULL THEN t1.crr_cl
          WHEN t1.crr_cl > t2.crr_cl THEN t1.crr_cl
          ELSE t2.crr_cl
      END
    FROM db2.crr_a t2 LEFT JOIN db1.crr_a t1 USING(uuid);

INSERT OR REPLACE INTO db1.crr_b(
    uuid,
    c,
    crr_c,
    crr_cl
    )
    SELECT
      t2.uuid
      END,
      CASE
          WHEN t1.c IS NULL THEN t2.c
          WHEN t2.c IS NULL THEN t1.c
          WHEN t1.crr_c > t2.crr_c THEN t1.c
          ELSE t2.c
      END,
      CASE
          WHEN t1.crr_c IS NULL THEN t2.crr_c
          WHEN t2.crr_c IS NULL THEN t1.crr_c
          WHEN t1.crr_c > t2.crr_c THEN t1.crr_c
          ELSE t2.crr_c
      END,
      CASE
          WHEN t1.crr_cl IS NULL THEN t2.crr_cl
          WHEN t2.crr_cl IS NULL THEN t1.crr_cl
          WHEN t1.crr_cl > t2.crr_cl THEN t1.crr_cl
          ELSE t2.crr_cl
      END
    FROM db2.crr_b t2 LEFT JOIN db1.crr_b t1 USING(uuid);

INSERT OR REPLACE INTO db1.crr_c(
    uuid,
    a,
    crr_a,
    crr_cl
    )
    SELECT
      t2.uuid
      END,
      CASE
          WHEN t1.a IS NULL THEN t2.a
          WHEN t2.a IS NULL THEN t1.a
          WHEN t1.crr_a > t2.crr_a THEN t1.a
          ELSE t2.a
      END,
      CASE
          WHEN t1.crr_a IS NULL THEN t2.crr_a
          WHEN t2.crr_a IS NULL THEN t1.crr_a
          WHEN t1.crr_a > t2.crr_a THEN t1.crr_a
          ELSE t2.crr_a
      END,
      CASE
          WHEN t1.crr_cl IS NULL THEN t2.crr_cl
          WHEN t2.crr_cl IS NULL THEN t1.crr_cl
          WHEN t1.crr_cl > t2.crr_cl THEN t1.crr_cl
          ELSE t2.crr_cl
      END
    FROM db2.crr_c t2 LEFT JOIN db1.crr_c t1 USING(uuid);



/* Resolve integrety constraints */

/* UPDATE constraints */

UPDATE db1.nano_time SET epoch = (SELECT CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)) WHERE id = 1;

INSERT OR REPLACE INTO db1.crr_a(
    uuid,
    b,
    crr_b,
    crr_cl
    )
    SELECT
      adb.uuid,
      cpy.b,
      (SELECT * FROM db1.current_time),
      adb.crr_cl
    FROM db1.crr_a adb, db1.crr_b bdb, db1.crr_cpy_a cpy
    WHERE adb.b = bdb.uuid AND (bdb.crr_cl%2) = 0;

INSERT OR REPLACE INTO db1.crr_b(
    uuid,
    c,
    crr_c,
    crr_cl
    )
    SELECT
      bdb.uuid,
      cpy.c,
      (SELECT * FROM db1.current_time),
      bdb.crr_cl
    FROM db1.crr_b bdb, db1.crr_c cdb, db1.crr_cpy_b cpy
    WHERE bdb.c = cdb.uuid AND (cdb.crr_cl%2) = 0;

INSERT OR REPLACE INTO db1.crr_c(
    uuid,
    a,
    crr_a,
    crr_cl
    )
    SELECT
      cdb.uuid,
      cpy.a,
      (SELECT * FROM db1.current_time),
      cdb.crr_cl
    FROM db1.crr_c cdb, db1.crr_a adb, db1.crr_cpy_c cpy
    WHERE cdb.a = adb.uuid AND (adb.crr_cl%2) = 0;


INSERT OR REPLACE INTO db1.crr_cpy_a SELECT * FROM db1.crr_a;
INSERT OR REPLACE INTO db1.crr_cpy_b SELECT * FROM db1.crr_b;
INSERT OR REPLACE INTO db1.crr_cpy_c SELECT * FROM db1.crr_c;

/* Deletion and insertion constraints */
INSERT OR REPLACE INTO db1.crr_a(
    uuid,
    b,
    crr_b,
    crr_cl
    )
    SELECT
      adb.uuid,
      adb.b,
      adb.crr_b,
      adb.crr_cl+1
    FROM db1.crr_a adb, db1.crr_c cdb, db1.crr_cpy_c cpy
    WHERE adb.uuid = cdb.a AND (adb.crr_cl%2) = 0 AND cpy.a == cdb.a;

INSERT OR REPLACE INTO db1.crr_b(
    uuid,
    c,
    crr_c,
    crr_cl
    )
    SELECT
      bdb.uuid,
      bdb.c,
      bdb.crr_c,
      bdb.crr_cl+1
    FROM db1.crr_b bdb, db1.crr_a adb, db1.crr_cpy_a cpy
    WHERE bdb.uuid = adb.b AND (bdb.crr_cl%2) = 0 AND cpy.b == adb.b;

INSERT OR REPLACE INTO db1.crr_c(
    uuid,
    a,
    crr_a,
    crr_cl
    )
    SELECT
      cdb.uuid,
      cdb.a,
      cdb.crr_a,
      cdb.crr_cl+1
    FROM db1.crr_c cdb, db1.crr_b bdb, db1.crr_cpy_b cpy
    WHERE cdb.uuid = bdb.c AND (cdb.crr_cl%2) = 0 AND cpy.c == bdb.c;




/*Now that constraints are resolved, turn foreign_keys back on */
PRAGMA foreign_keys = ON;

/* Remove all elements from temporary tables */
DELETE FROM db1.crr_cpy_a;
DELETE FROM db1.crr_cpy_b;
DELETE FROM db1.crr_cpy_c;

/* Propegate data into AR layer: */
INSERT OR REPLACE INTO db1.a(
  uuid,
  b
)
  SELECT CR.uuid, CR.b
  FROM db1.crr_a as CR
  WHERE CR.uuid = uuid;

INSERT OR REPLACE INTO db1.b(
  uuid,
  c
)
  SELECT CR.uuid, CR.c
  FROM db1.crr_b as CR
  WHERE CR.uuid = uuid;


INSERT OR REPLACE INTO db1.c(
  uuid,
  a
)
  SELECT CR.uuid, CR.a
  FROM db1.crr_c as CR
  WHERE CR.uuid = uuid;


/* DELETE from AR where causal length is even */
DELETE FROM db1.a
WHERE uuid IN (SELECT uuid FROM db1.crr_a
              WHERE (crr_cl%2)=0);

DELETE FROM db1.b
WHERE uuid IN (SELECT uuid FROM db1.crr_b
              WHERE (crr_cl%2)=0);

DELETE FROM db1.c
WHERE uuid IN (SELECT uuid FROM db1.crr_c
              WHERE (crr_cl%2)=0);


/* Enable triggers again */
UPDATE db1.lock_tbl
    SET trigger_lock = 0 WHERE tbl = "crr_a";
UPDATE db1.lock_tbl
    SET trigger_lock = 0 WHERE tbl = "crr_b";
UPDATE db1.lock_tbl
    SET trigger_lock = 0 WHERE tbl = "crr_c";


COMMIT TRANSACTION;

BEGIN TRANSACTION;

/* Disable triggers */
UPDATE db1.lock_tbl
    SET trigger_lock = 1 WHERE tbl = "crr_users";


/*Update local tables cr layer on all uuids shared with forign table and all
  UUIDs unique to the forign table (LEFT JOIN forign local)*/

INSERT OR REPLACE INTO db1.crr_users(
    uuid,
    first_name,
    crr_first_name,
    last_name,
    crr_last_name,
    phone,
    crr_phone,
    email,
    crr_email,
    crr_cl
    )
    SELECT
      t2.uuid
      END,
      CASE
          WHEN t1.first_name IS NULL THEN t2.first_name
          WHEN t2.first_name IS NULL THEN t1.first_name
          WHEN t1.crr_first_name > t2.crr_first_name THEN t1.first_name
          ELSE t2.first_name
      END,
      CASE
          WHEN t1.crr_first_name IS NULL THEN t2.crr_first_name
          WHEN t2.crr_first_name IS NULL THEN t1.crr_first_name
          WHEN t1.crr_first_name > t2.crr_first_name THEN t1.crr_first_name
          ELSE t2.crr_first_name
      END,
      CASE
          WHEN t1.last_name IS NULL THEN t2.last_name
          WHEN t2.last_name IS NULL THEN t1.last_name
          WHEN t1.crr_last_name > t2.crr_last_name THEN t1.last_name
          ELSE t2.last_name
      END,
      CASE
          WHEN t1.crr_last_name IS NULL THEN t2.crr_last_name
          WHEN t2.crr_last_name IS NULL THEN t1.crr_last_name
          WHEN t1.crr_last_name > t2.crr_last_name THEN t1.crr_last_name
          ELSE t2.crr_last_name
      END,
      CASE
          WHEN t1.phone IS NULL THEN t2.phone
          WHEN t2.phone IS NULL THEN t1.phone
          WHEN t1.crr_phone > t2.crr_phone THEN t1.phone
          ELSE t2.phone
      END,
      CASE
          WHEN t1.crr_phone IS NULL THEN t2.crr_phone
          WHEN t2.crr_phone IS NULL THEN t1.crr_phone
          WHEN t1.crr_phone > t2.crr_phone THEN t1.crr_phone
          ELSE t2.crr_phone
      END,
      CASE
          WHEN t1.email IS NULL THEN t2.email
          WHEN t2.email IS NULL THEN t1.email
          WHEN t1.crr_email > t2.crr_email THEN t1.email
          ELSE t2.email
      END,
      CASE
          WHEN t1.crr_email IS NULL THEN t2.crr_email
          WHEN t2.crr_email IS NULL THEN t1.crr_email
          WHEN t1.crr_email > t2.crr_email THEN t1.crr_email
          ELSE t2.crr_email
      END,
      CASE
          WHEN t1.crr_cl IS NULL THEN t2.crr_cl
          WHEN t2.crr_cl IS NULL THEN t1.crr_cl
          WHEN t1.crr_cl > t2.crr_cl THEN t1.crr_cl
          ELSE t2.crr_cl
      END
    FROM db2.crr_users t2 LEFT JOIN db1.crr_users t1 USING(uuid);

/* Propegate data into AR layer: */

INSERT OR REPLACE INTO db1.users(
  uuid,
  first_name,
  last_name,
  phone,
  email
)
  SELECT CR.uuid, first_name, last_name, phone, email
  FROM db1.crr_users as CR
  WHERE CR.uuid = uuid;

/* DELETE from AR where CR.cll is even */

DELETE FROM db1.users
WHERE uuid IN (SELECT uuid FROM db1.crr_users
              WHERE (crr_cl%2)=0);

/* Enable triggers again */
UPDATE db1.lock_tbl
    SET trigger_lock = 0 WHERE tbl = "crr_users";

COMMIT TRANSACTION;

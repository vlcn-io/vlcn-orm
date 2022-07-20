
CREATE TRIGGER a_after_insert
  AFTER INSERT ON a
BEGIN

  UPDATE nano_time SET epoch = (SELECT CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)) WHERE id = 1;

  UPDATE crr_a
  SET crr_cl = crr_cl+1,
      b = NEW.b,
      crr_b = (SELECT * FROM current_time)
  WHERE uuid = NEW.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_a") = 0;

  INSERT INTO crr_a (
    crr_cl,
    uuid,
    b,
    crr_b
  )
  SELECT
    1,
    NEW.uuid,
    NEW.b,
    (SELECT * FROM current_time)
  WHERE NOT EXISTS (SELECT uuid FROM crr_a WHERE uuid = NEW.uuid)
    AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_a") = 0;
END;




CREATE TRIGGER b_after_insert
  AFTER INSERT ON b
BEGIN

  UPDATE nano_time SET epoch = (SELECT CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)) WHERE id = 1;

  UPDATE crr_b
  SET crr_cl = crr_cl+1,
      c = NEW.c,
      crr_c = (SELECT * FROM current_time)
  WHERE uuid = NEW.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_b") = 0;

  INSERT INTO crr_b (
    crr_cl,
    uuid,
    c,
    crr_c
  )
  SELECT
    1,
    NEW.uuid,
    NEW.c,
    (SELECT * FROM current_time)
  WHERE NOT EXISTS (SELECT uuid FROM crr_b WHERE uuid = NEW.uuid)
    AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_b") = 0;
END;




CREATE TRIGGER c_after_insert
  AFTER INSERT ON c
BEGIN

  UPDATE nano_time SET epoch = (SELECT CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)) WHERE id = 1;

  UPDATE crr_c
  SET crr_cl = crr_cl+1,
      a = NEW.a,
      crr_a = (SELECT * FROM current_time)
  WHERE uuid = NEW.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_c") = 0;

  INSERT INTO crr_c (
    crr_cl,
    uuid,
    a,
    crr_a
  )
  SELECT
    1,
    NEW.uuid,
    NEW.a,
    (SELECT * FROM current_time)
  WHERE NOT EXISTS (SELECT uuid FROM crr_c WHERE uuid = NEW.uuid)
    AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_c") = 0;
END;

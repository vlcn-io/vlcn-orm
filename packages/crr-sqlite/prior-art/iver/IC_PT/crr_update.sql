CREATE TRIGGER a_after_update
  after UPDATE ON a
BEGIN
  /*Set timer*/
  UPDATE nano_time SET epoch = (SELECT CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)) WHERE id = 1;
  UPDATE crr_a
  SET   b = NEW.b,
        crr_b = CASE WHEN OLD.b != NEW.b THEN (SELECT * FROM current_time) ELSE crr_b END
  WHERE uuid = OLD.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_a") = 0;
END;



CREATE TRIGGER b_after_update
  after UPDATE ON b
BEGIN
  /*Set timer*/
  UPDATE nano_time SET epoch = (SELECT CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)) WHERE id = 1;

  UPDATE crr_b
  SET   c = NEW.c,
        crr_c = CASE WHEN OLD.c != NEW.c THEN (SELECT * FROM current_time) ELSE crr_c END
  WHERE uuid = OLD.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_b") = 0;
END;




CREATE TRIGGER c_after_update
  after UPDATE ON c
BEGIN
  /*Set timer*/
  UPDATE nano_time SET epoch = (SELECT CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)) WHERE id = 1;

  UPDATE crr_c
  SET   a = NEW.a,
        crr_a = CASE WHEN OLD.a != NEW.a THEN (SELECT * FROM current_time) ELSE crr_a END
  WHERE uuid = OLD.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_c") = 0;
END;

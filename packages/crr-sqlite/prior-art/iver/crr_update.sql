CREATE TRIGGER after_update
  after UPDATE ON users
BEGIN
  /*Set timer*/
  UPDATE nano_time SET epoch = (SELECT CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)) WHERE id = 1;

  UPDATE crr_users
  SET   first_name = NEW.first_name,
        crr_first_name = CASE WHEN OLD.first_name != NEW.first_name THEN (SELECT * FROM current_time) ELSE crr_first_name END,
        last_name = NEW.last_name,
        crr_last_name = CASE WHEN OLD.last_name != NEW.last_name THEN (SELECT * FROM current_time) ELSE crr_last_name END,
        phone = NEW.phone,
        crr_phone = CASE WHEN OLD.phone != NEW.phone THEN (SELECT * FROM current_time) ELSE crr_phone END,
        email = NEW.email,
        crr_email = CASE WHEN OLD.email != NEW.email THEN (SELECT * FROM current_time) ELSE crr_email END
  WHERE uuid = OLD.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_users") = 0;
END;

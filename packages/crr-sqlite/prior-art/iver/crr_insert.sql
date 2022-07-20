
CREATE TRIGGER after_insert
  AFTER INSERT ON users
BEGIN

  UPDATE nano_time SET epoch = (SELECT CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)) WHERE id = 1;

  UPDATE crr_users
  SET crr_cl = crr_cl+1,
      first_name = NEW.first_name,
      crr_first_name = (SELECT * FROM current_time),
      last_name = NEW.last_name,
      crr_last_name = (SELECT * FROM current_time),
      phone = NEW.phone,
      crr_phone = (SELECT * FROM current_time),
      email = NEW.email,
      crr_email = (SELECT * FROM current_time)
  WHERE uuid = NEW.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_users") = 0;

  INSERT INTO crr_users (
    crr_cl,
    uuid,
    first_name,
    crr_first_name,
    last_name,
    crr_last_name,
    phone,
    crr_phone,
    email,
    crr_email
  )
  SELECT
    1,
    NEW.uuid,
    NEW.first_name,
    (SELECT * FROM current_time),
    NEW.last_name,
    (SELECT * FROM current_time),
    NEW.phone,
    (SELECT * FROM current_time),
    NEW.email,
    (SELECT * FROM current_time)
  WHERE NOT EXISTS (SELECT uuid FROM crr_users WHERE uuid = NEW.uuid)
    AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_users") = 0;
END;

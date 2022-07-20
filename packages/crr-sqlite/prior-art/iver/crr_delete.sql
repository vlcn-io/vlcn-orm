
CREATE TRIGGER after_delete
  AFTER DELETE ON users
BEGIN
  UPDATE crr_users
  SET crr_cl = crr_cl+1
  WHERE uuid = OLD.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_users") = 0; 
END;

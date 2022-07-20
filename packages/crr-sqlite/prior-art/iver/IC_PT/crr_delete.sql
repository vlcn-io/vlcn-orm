
CREATE TRIGGER a_after_delete
  AFTER DELETE ON a
BEGIN
  UPDATE crr_a
  SET crr_cl = crr_cl+1
  WHERE uuid = OLD.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_a") = 0;
END;




CREATE TRIGGER b_after_delete
  AFTER DELETE ON b
BEGIN
  UPDATE crr_b
  SET crr_cl = crr_cl+1
  WHERE uuid = OLD.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_b") = 0;
END;




CREATE TRIGGER c_after_delete
  AFTER DELETE ON c
BEGIN
  UPDATE crr_c
  SET crr_cl = crr_cl+1
  WHERE uuid = OLD.uuid AND (SELECT trigger_lock FROM lock_tbl WHERE tbl = "crr_c") = 0;
END;

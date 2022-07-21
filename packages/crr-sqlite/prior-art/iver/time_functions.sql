/* Schemas and initalization to support simulated nano-second time and
    uphold local ordering of events*/

-- just register a function to act as time
DROP TABLE IF EXISTS nano_time;
CREATE TABLE nano_time(
  id integer PRIMARY KEY CHECK(id = 1),
  epoch unsigned integer DEFAULT 0,
  offs unsigned integer DEFAULT 0
);

INSERT INTO nano_time(id) VALUES(1);

CREATE TRIGGER crr_time_trigger
  after UPDATE ON nano_time
BEGIN
  UPDATE nano_time
  SET
    offs = CASE WHEN old.epoch == new.epoch THEN OLD.offs + abs(RANDOM()%(1000000 - OLD.offs))
              ELSE abs(RANDOM()%1000000) END
  WHERE id = 1;
END;

DROP VIEW IF EXISTS current_time;
CREATE VIEW current_time AS
  SELECT epoch * 1000000 + offs FROM nano_time WHERE id = 1;

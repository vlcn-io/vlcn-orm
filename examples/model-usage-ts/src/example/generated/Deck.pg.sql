-- SIGNED-SOURCE: <0c506238e3813a0cf4544b5f5acfbef5>
CREATE TABLE Deck (
  'id' BIGINT UNSIGNED,
  'name' TEXT,
  'created' DATETIME,
  'modified' DATETIME,
  'ownerId' BIGINT UNSIGNED,
  'selectedSlideId' BIGINT UNSIGNED
);
-- SIGNED-SOURCE: <46fabe29dac2117f5a18d82d0c06515d>
CREATE TABLE Deck (
  'id' BIGINT UNSIGNED,
  'name' TEXT,
  'created' DATETIME,
  'modified' DATETIME,
  'ownerId' BIGINT UNSIGNED,
  'selectedSlide' BIGINT UNSIGNED
);
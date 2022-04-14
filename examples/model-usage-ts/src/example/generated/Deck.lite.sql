-- SIGNED-SOURCE: <6e53c68e7d32bc2b29fb7ecbf34217c4>
CREATE TABLE Deck (
  'id' UNSIGNED BIG INT PRIMARY KEY,
  'name' TEXT,
  'created' DATETIME,
  'modified' DATETIME,
  'ownerId' UNSIGNED BIG INT,
  'selectedSlideId' UNSIGNED BIG INT
);
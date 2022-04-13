-- SIGNED-SOURCE: <82a5cf4be1fa161ccf3cfdb7714b28dd>
CREATE TABLE Deck (
  'id' UNSIGNED BIG INT PRIMARY KEY,
  'name' TEXT,
  'created' DATETIME,
  'modified' DATETIME,
  'ownerId' UNSIGNED BIG INT,
  'selectedSlide' UNSIGNED BIG INT
);
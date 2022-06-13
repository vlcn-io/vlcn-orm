-- SIGNED-SOURCE: <d8c4a03de2f8f91c42ae16f143833e6c>
CREATE TABLE
  "todolist" (
    "id" bigint NOT NULL,
    "filter" varchar(255) NOT NULL,
    "editing" bigint,
    primary key ("id")
  )
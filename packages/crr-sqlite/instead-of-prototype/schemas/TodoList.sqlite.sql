CREATE VIEW
  IF NOT EXISTS "todolist" (
    "id" integer NOT NULL,
    "filter" varchar(255) NOT NULL,
    "editingId" integer,
    primary key ("id")
  )
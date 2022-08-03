-- SIGNED-SOURCE: <66b2f9402c1190b56c68fc1f7afd3cff>
CREATE TABLE
  "component" (
    "id" bigint NOT NULL,
    "subtype" varchar(255) NOT NULL,
    "slideId" bigint NOT NULL,
    "content" text NOT NULL,
    primary key ("id")
  )
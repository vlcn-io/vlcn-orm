-- SIGNED-SOURCE: <f05548df93edf0e73608b029f017579e>
CREATE TABLE
  "component" (
    "id" bigint NOT NULL
    /* n:1 */
,
    "subtype" varchar(255) NOT NULL
    /* n:2 */
,
    "slideId" bigint NOT NULL
    /* n:3 */
,
    "content" text NOT NULL
    /* n:4 */
,
    primary key ("id")
  )
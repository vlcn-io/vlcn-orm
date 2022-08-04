-- SIGNED-SOURCE: <3d8b71104dc07973343f849744638943>
CREATE TABLE
  "component" (
    "id" bigint NOT NULL
    /* n=1 */
,
    "subtype" varchar(255) NOT NULL
    /* n=2 */
,
    "slideId" bigint NOT NULL
    /* n=3 */
,
    "content" text NOT NULL
    /* n=4 */
,
    PRIMARY KEY ("id")
  )
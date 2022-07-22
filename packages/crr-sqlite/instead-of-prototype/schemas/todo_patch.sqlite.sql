CREATE VIEW
  IF NOT EXISTS "todo_patch" AS SELECT 
    "todo_patch".*,
    json_group_object("vc_peerId", "vc_version") as vector_clock
  FROM "todo_crr"
  JOIN "todo_vector_clocks" ON
    "todo_vector_clocks"."vc_peerId" = (SELECT "id" FROM "crr_peer_id") AND
    "todo_vector_clocks"."vc_todoId" = "todo_crr"."id";
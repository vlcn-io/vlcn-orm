# Instead Of Prototype

A prototype to turn SQLite into a conflict free replicated database via views and `instead of` triggers.

The design is as follows.

Tables for an application are expressed in standard terms --

```sql
CREATE TABLE "track" (
  "id" bigint NOT NULL,
  "name" text NOT NULL,
  "albumId" bigint,
  "mediaTypeId" bigint NOT NULL,
  "genreId" bigint,
  "composer" text,
  "milliseconds" int NOT NULL,
  "bytes" int,
  "unitPrice" float NOT NULL,
  primary key ("id")
);
```

but rather than being tables, these are turned into views.

```sql
CREATE VIEW "track" AS
SELECT
  "id",
  "name",
  "albumId",
  "mediaTypeId",
  "genreId",
  "composer",
  "milliseconds",
  "bytes",
  "unitPrice" 
FROM
  "track_crr" 
WHERE
  "track_crr"."crr_cl" % 2 = 1
```

The views are build against a "crr" or "conflict free replicated relation" base table which, for the example, would be defined as follows:

```sql
CREATE TABLE "track_crr" (
  "id" bigint NOT NULL,
  "name" text NOT NULL,
  "crr_name" integer,
  "albumId" bigint,
  "crr_albumId" integer,
  "mediaTypeId" bigint NOT NULL,
  "crr_mediaTypeId" integer,
  "genreId" bigint,
  "crr_genreId" integer,
  "composer" text,
  "crr_composer" integer,
  "milliseconds" int NOT NULL,
  "crr_milliseconds" integer,
  "bytes" int,
  "crr_bytes" integer,
  "unitPrice" float NOT NULL,
  "crr_unitPrice" integer,
  "crr_cl" integer DEFAULT 1,
  "crr_db_version" integer NOT NULL
  primary key ("id")
);
```

The base crr table matches the normal schema except that:
1. Each column has an associated logic clock to turn that column into a LWW
2. A "causal length" or "crr_cl" column is added to determine deletion status of the row.
3. crr_db_version -- this is a value that is incremented with every to the db. It represents the global version of the database
  and can be used by peers to figure out how to sync with one another.

The application atop the CRR-modified sqlite only interacts with the views and thus sees no modification to its domain model.

# Local Insert, Update, Delete

Rows in views cannot be inserted, updated or deleted unless we register `INSTEAD OF` triggers for those operations.

If `INSTEAD OF` triggers exist against a view then whenever an `INSERT`, `UPDATE`, or `DELETE` is run against the view, the corresponding tigger will be run *instead of* that operation.

Example --

Insert trigger:
```sql
CREATE TRIGGER "insert_track_trig"
  INSTEAD OF INSERT ON "track"
BEGIN
  -- on conflict clause since this could be an undelete and the crr tables has all previously deleted rows
  INSERT INTO "track_crr" (...) VALUES ... ON CONFLICT ("id") DO UPDATE SET
    "name" = EXCLUDED.name,
    "crr_name" = EXCLUDED.crr_name + 1,
    ...
    "crr_cl" = "crr_cl" + 1
END;
```

Update trigger:
```sql
CREATE TRIGGER "update_track_trig"
  INSTEAD OF UPDATE ON "track"
BEGIN
  UPDATE "crr_db_version" SET "version" = "version" + 1;

  UPDATE "crr_track" 
  SET "name" = NEW.name,
  "crr_name" = CASE WHEN OLD.name != NEW.name THEN crr_name + 1 ELSE "crr_name" END,
  ...
  "crr_db_version" = (SELECT * FROM "crr_db_version")
  WHERE "id" = OLD.id
END;
```

Delete trigger:
```sql
CREATE TRIGGER "delete_track_trig"
  INSTEAD OF DELETE ON "track"
BEGIN
-- just increment the cl for the row by 1
  UPDATE "crr_track"
  SET crr_cl = crr_cl + 1
  WHERE "id" = OLD.id
END;
```

# Merging

A wants to merge with B.

Have A grab all items from B where the db version of B is greater than what A knows to be the last known db version of B.
B merges with A in the same way.

After merging with one another, they update their knowledge of one another's db versions.

Note: this merging can be further limited to query slices requested by A or B rather than the entire dataset. (link to your posts on distributed queries).

A column on each row that maps to the DB version. Ala datomic.

# Relational Invariants
- Uniqueness constraints
- FK constraints

We will currently forgo integrity constraints.
Users of a CRR DB will:
1. Only be able to have the primary key as a unique index on the table otherwise a row can have multiple identities which we do not know how to resolve. E.g., Phone and Email and UUID unique? What if X gets updates to collide with _two_ rows? Does X merges with row A or B? Does the UUID and all things with the UUID to X now get invalidated?
2. FK constraints / field edges are always nullable. Application must deal with a potential dangling edge.
   1. This is fine. Privacy makes this happen all the time anyway.

Maybe:

We can resolve these through "undo" operations that count as new operations.
Could we hit a pathological case where two nodes have states that contradict one another?

**State:**
You:
A -> B
Have D

Me: 
A -> C
Have E

Ops:
You:
Delete C

Me:
Delete B

Result:
This is fine. Delete is undone.


Ops:
You:
Point A to D

Me:
Point A to E


# How to Merge...

Merge layer should interact directly with the base tables.

It takes a set of incoming changes and applies merge logic against each row from that set in a single transaction.
^-- single transaction bit for the case we ever want to go back and try preserving invariants.

Now we could...
1. Create a merge view
2. Put trigger logic to do merging whenever someone inserts against the merge view.

Base tables never get deletes.
Only ever inserts and updates.

We can collapse everything down to an upsert.

Creates new row fine on one path.
Updates existing row based on conflict resolution strategy on other path.
- Allow imports in schemas
- Pass around loaded schema list so we can validate edges point to real things
- re-visit EdgeFn and NodeFn functions
- Implement junction edge support
- Implement edge reference declarations and edge data
- Implement validation
- Implement queryAll
- Implement migrations feature?
- Add neo4j support?
- Implement traits
- Add comment support to the DSL
- Write folders in output path that don't exist


# Implementing Traits

Field edge to a trait... this would mean we'd need to check all tables that could hold a user of said trait.
and thus all users of the trait would _have_ to be of the same storage engine.

Now how would we correctly do the model load to the concrete trait type?


```aphro
Component as NodeTrait {
  slideId: ID<Slide>
}

TextComponent as Node {
  id: ID<TextComponent>
  content: string
} & Traits {
  Component
}
```

# Fixup Postgres table generation

```sql
CREATE TABLE public."User"
(
    id bigint NOT NULL,
    name text NOT NULL,
    created timestamp without time zone NOT NULL,
    modified timestamp without time zone NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public."Deck"
(
    id bigint NOT NULL,
    name text NOT NULL,
    created timestamp without time zone NOT NULL,
    modified timestamp without time zone NOT NULL,
    "ownerId" bigint NOT NULL,
    "selectedSlideId" bigint,
    PRIMARY KEY (id)
);

CREATE TABLE public."Slide"
(
    id bigint NOT NULL,
    "deckId" bigint NOT NULL,
    "order" double precision NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);
```
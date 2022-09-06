# @aphro/model-runtime-ts

## 0.2.6

### Patch Changes

- Export queries and specs, move connectors to own packages, fix #43 and other bugs
- Updated dependencies
  - @aphro/context-runtime-ts@0.3.6
  - @aphro/schema-api@0.2.6

## 0.2.5

### Patch Changes

- transaction support
- Updated dependencies
  - @aphro/context-runtime-ts@0.3.5
  - @aphro/schema-api@0.2.5

## 0.2.4

### Patch Changes

- Strict mode for typescript, useEffect vs useSyncExternalStore, useLiveResult hook
- Updated dependencies
  - @aphro/context-runtime-ts@0.3.4
  - @aphro/schema-api@0.2.4

## 0.2.3

### Patch Changes

- rebuild -- last publish had a clobbered version of pnpm
- Updated dependencies
  - @aphro/context-runtime-ts@0.3.3
  - @aphro/schema-api@0.2.3

## 0.2.2

### Patch Changes

- workaround to adhere to strict mode in generated code #43
- Updated dependencies
  - @aphro/context-runtime-ts@0.3.2
  - @aphro/schema-api@0.2.2

## 0.2.1

### Patch Changes

- generate bootstrapping utilities
- Updated dependencies
  - @aphro/context-runtime-ts@0.3.1
  - @aphro/schema-api@0.2.1

## 0.2.0

### Minor Changes

- Simplify manual files, change output dir for generated code, allow caching in live queries, simplify 1 to 1 edge fetches

### Patch Changes

- Updated dependencies
  - @aphro/context-runtime-ts@0.3.0
  - @aphro/schema-api@0.2.0

## 0.1.9

### Patch Changes

- Updated dependencies
  - @aphro/context-runtime-ts@0.2.0

## 0.1.8

### Patch Changes

- update dependency on strut/utils, enable manual methods for models
- Updated dependencies
  - @aphro/context-runtime-ts@0.1.8
  - @aphro/schema-api@0.1.4

## 0.1.7

### Patch Changes

- Updated dependencies
  - @aphro/schema-api@0.1.3
  - @aphro/context-runtime-ts@0.1.7

## 0.1.6

### Patch Changes

- allow ephemeral nodes. allow type expressions for fields.
- Updated dependencies
  - @aphro/context-runtime-ts@0.1.6
  - @aphro/schema-api@0.1.2

## 0.1.5

### Patch Changes

- in-memory model support
- Updated dependencies
  - @aphro/context-runtime-ts@0.1.5
  - @aphro/schema-api@0.1.1

## 0.1.4

### Patch Changes

- update sid dependency
- Updated dependencies
  - @aphro/context-runtime-ts@0.1.4

## 0.1.3

### Patch Changes

- enable reactivity via generators if desired, add better postgres support and bugfixes for mealfave
- Updated dependencies
  - @aphro/context-runtime-ts@0.1.3

## 0.1.2

### Patch Changes

- @aphro/context-runtime-ts@0.1.2

## 0.1.1

### Patch Changes

- @aphro/context-runtime-ts@0.1.1

## 0.1.0

### Minor Changes

- Support for standalone / junction edges

### Patch Changes

- Updated dependencies
  - @aphro/context-runtime-ts@0.1.0
  - @aphro/schema-api@0.1.0

## 0.0.11

### Patch Changes

- count/orderBy/take implementation, support for NOT NULL, empty queries
- Updated dependencies
  - @aphro/context-runtime-ts@0.0.11
  - @aphro/schema-api@0.0.11

## 0.0.10

### Patch Changes

- Fix casing errors on filesystem
- Updated dependencies
  - @aphro/context-runtime-ts@0.0.10
  - @aphro/schema-api@0.0.10

## 0.0.9

### Patch Changes

- graphql support, 'create table if not exists' for easier bootstrapping, @databases connection support
- Updated dependencies
  - @strut/counter@0.0.9
  - @strut/events@0.0.8
  - @strut/sid@0.0.9
  - @strut/utils@0.0.9
  - @aphro/context-runtime-ts@0.0.9
  - @aphro/schema-api@0.0.9

## 0.0.8

### Patch Changes

- full todomvc example, no partiall generated mutators, removal of knexjs
- Updated dependencies
  - @strut/counter@0.0.8
  - @strut/events@0.0.7
  - @strut/sid@0.0.8
  - @strut/utils@0.0.8
  - @aphro/context-runtime-ts@0.0.8
  - @aphro/schema-api@0.0.8

## 0.0.7

### Patch Changes

- enable running in the browser, implement reactive queries
- Updated dependencies
  - @strut/counter@0.0.7
  - @strut/events@0.0.6
  - @strut/sid@0.0.7
  - @strut/utils@0.0.7
  - @aphro/context-runtime-ts@0.0.7
  - @aphro/schema-api@0.0.7

## 0.0.6

### Patch Changes

- Simplify interactions with changesets, get basic hop queries working
- Updated dependencies
  - @strut/counter@0.0.6
  - @strut/utils@0.0.6
  - @aphro/context-runtime-ts@0.0.6
  - @aphro/schema-api@0.0.6
  - @strut/sid@0.0.6

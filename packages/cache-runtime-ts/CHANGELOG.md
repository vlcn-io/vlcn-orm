# @aphro/cache-runtime-ts

## 0.2.6

### Patch Changes

- Export queries and specs, move connectors to own packages, fix #43 and other bugs

## 0.2.5

### Patch Changes

- transaction support

## 0.2.4

### Patch Changes

- Strict mode for typescript, useEffect vs useSyncExternalStore, useLiveResult hook

## 0.2.3

### Patch Changes

- rebuild -- last publish had a clobbered version of pnpm

## 0.2.2

### Patch Changes

- workaround to adhere to strict mode in generated code #43

## 0.2.1

### Patch Changes

- generate bootstrapping utilities

## 0.2.0

### Minor Changes

- Simplify manual files, change output dir for generated code, allow caching in live queries, simplify 1 to 1 edge fetches

## 0.1.6

### Patch Changes

- update dependency on strut/utils, enable manual methods for models

## 0.1.5

### Patch Changes

- allow ephemeral nodes. allow type expressions for fields.

## 0.1.4

### Patch Changes

- in-memory model support

## 0.1.3

### Patch Changes

- update sid dependency

## 0.1.2

### Patch Changes

- use build-stable type identifiers

## 0.1.1

### Patch Changes

- Cache de-dupes on type name rather than just id -- enables non globally unique ids

## 0.1.0

### Minor Changes

- Support for standalone / junction edges

## 0.0.11

### Patch Changes

- count/orderBy/take implementation, support for NOT NULL, empty queries

## 0.0.10

### Patch Changes

- Fix casing errors on filesystem

## 0.0.9

### Patch Changes

- graphql support, 'create table if not exists' for easier bootstrapping, @databases connection support
- Updated dependencies
  - @strut/sid@0.0.9
  - @strut/utils@0.0.9

## 0.0.8

### Patch Changes

- full todomvc example, no partiall generated mutators, removal of knexjs
- Updated dependencies
  - @strut/sid@0.0.8
  - @strut/utils@0.0.8

## 0.0.7

### Patch Changes

- enable running in the browser, implement reactive queries
- Updated dependencies
  - @strut/sid@0.0.7
  - @strut/utils@0.0.7

## 0.0.6

### Patch Changes

- Simplify interactions with changesets, get basic hop queries working
- Updated dependencies
  - @strut/utils@0.0.6
  - @strut/sid@0.0.6

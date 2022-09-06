# @aphro/react

## 1.2.3

### Patch Changes

- Export queries and specs, move connectors to own packages, fix #43 and other bugs
- Updated dependencies
  - @aphro/runtime-ts@0.3.8

## 1.2.2

### Patch Changes

- transaction support
- Updated dependencies
  - @aphro/runtime-ts@0.3.7

## 1.2.1

### Patch Changes

- fix duplicative mutation imports, incorrect tracking of mounted state in react

## 1.2.0

### Minor Changes

- depend on `runtime-ts` to fix pkg mismatches, convenience mutations, named mutations replace unnmaed mutations
- depend on `runtime-ts` to prevent pkg version mismatch, convenience `mutatations` accessor

### Patch Changes

- @aphro/runtime-ts@0.3.6

## 1.1.0

### Minor Changes

- add missing dependency

## 1.0.4

### Patch Changes

- Strict mode for typescript, useEffect vs useSyncExternalStore, useLiveResult hook
- Updated dependencies
  - @aphro/runtime-ts@0.3.5

## 1.0.3

### Patch Changes

- rebuild -- last publish had a clobbered version of pnpm
- Updated dependencies
  - @aphro/runtime-ts@0.3.4

## 1.0.2

### Patch Changes

- workaround to adhere to strict mode in generated code #43
- Updated dependencies
  - @aphro/runtime-ts@0.3.3

## 1.0.1

### Patch Changes

- generate bootstrapping utilities
- Updated dependencies
  - @aphro/runtime-ts@0.3.1

## 1.0.0

### Minor Changes

- Simplify manual files, change output dir for generated code, allow caching in live queries, simplify 1 to 1 edge fetches

### Patch Changes

- Updated dependencies
  - @aphro/runtime-ts@0.3.0

## 0.2.0

### Minor Changes

- simplify mutations, simplify hooks

### Patch Changes

- @aphro/runtime-ts@0.1.11

## 0.1.10

### Patch Changes

- update dependency on strut/utils, enable manual methods for models
- Updated dependencies
  - @aphro/runtime-ts@0.1.9

## 0.1.9

### Patch Changes

- allow ephemeral nodes. allow type expressions for fields.
- Updated dependencies
  - @aphro/runtime-ts@0.1.7

## 0.1.8

### Patch Changes

- in-memory model support
- Updated dependencies
  - @aphro/runtime-ts@0.1.6

## 0.1.6

### Patch Changes

- incorporate react and aphro as peers

## 0.1.5

### Patch Changes

- @aphro/runtime-ts@0.1.4

## 0.1.4

### Patch Changes

- @aphro/runtime-ts@0.1.3

## 0.1.3

### Patch Changes

- update sqljs-connector to handle loading a sqlite db from storage

## 0.1.2

### Patch Changes

- @aphro/runtime-ts@0.1.2

## 0.1.1

### Patch Changes

- @aphro/runtime-ts@0.1.1

## 0.1.0

### Minor Changes

- Support for standalone / junction edges

### Patch Changes

- Updated dependencies
  - @aphro/runtime-ts@0.1.0

## 0.0.12

### Patch Changes

- count/orderBy/take implementation, support for NOT NULL, empty queries
- Updated dependencies
  - @aphro/runtime-ts@0.0.8

## 0.0.11

### Patch Changes

- Fix casing errors on filesystem
- Updated dependencies
  - @aphro/runtime-ts@0.0.7

## 0.0.10

### Patch Changes

- graphql support, 'create table if not exists' for easier bootstrapping, @databases connection support
- Updated dependencies
  - @strut/counter@0.0.9
  - @strut/events@0.0.8
  - @strut/sid@0.0.9
  - @strut/utils@0.0.9
  - @aphro/runtime-ts@0.0.6

## 0.0.9

### Patch Changes

- full todomvc example, no partiall generated mutators, removal of knexjs
- Updated dependencies
  - @strut/counter@0.0.8
  - @strut/events@0.0.7
  - @strut/sid@0.0.8
  - @strut/utils@0.0.8
  - @aphro/runtime-ts@0.0.5

## 0.0.8

### Patch Changes

- @aphro/runtime-ts@0.0.4

## 0.0.7

### Patch Changes

- enable running in the browser, implement reactive queries
- Updated dependencies
  - @strut/counter@0.0.7
  - @strut/events@0.0.6
  - @strut/sid@0.0.7
  - @strut/utils@0.0.7
  - @aphro/runtime-ts@0.0.3

## 0.0.6

### Patch Changes

- Updated dependencies
  - @strut/counter@0.0.6
  - @strut/utils@0.0.6
  - @aphro/model-runtime-ts@0.0.6
  - @strut/sid@0.0.6

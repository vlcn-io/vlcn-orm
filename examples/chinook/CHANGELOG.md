# @aphro/chinook

## 0.3.6

### Patch Changes

- Export queries and specs, move connectors to own packages, fix #43 and other bugs
- Updated dependencies
  - @aphro/runtime-ts@0.3.8

## 0.3.5

### Patch Changes

- transaction support
- Updated dependencies
  - @aphro/runtime-ts@0.3.7

## 0.3.4

### Patch Changes

- @aphro/runtime-ts@0.3.6

## 0.3.3

### Patch Changes

- Strict mode for typescript, useEffect vs useSyncExternalStore, useLiveResult hook
- Updated dependencies
  - @aphro/runtime-ts@0.3.5

## 0.3.2

### Patch Changes

- rebuild -- last publish had a clobbered version of pnpm
- Updated dependencies
  - @aphro/runtime-ts@0.3.4

## 0.3.1

### Patch Changes

- workaround to adhere to strict mode in generated code #43
- Updated dependencies
  - @aphro/runtime-ts@0.3.3

## 0.3.0

### Minor Changes

- update chinook to latest aphrodite

## 0.2.3

### Patch Changes

- @aphro/runtime-ts@0.3.2

## 0.2.2

### Patch Changes

- generate bootstrapping utilities
- Updated dependencies
  - @aphro/runtime-ts@0.3.1

## 0.2.1

### Patch Changes

- fixup bad spec imports when edges go to self

## 0.2.0

### Minor Changes

- Simplify manual files, change output dir for generated code, allow caching in live queries, simplify 1 to 1 edge fetches

### Patch Changes

- Updated dependencies
  - @aphro/runtime-ts@0.3.0

## 0.1.16

### Patch Changes

- @aphro/runtime-ts@0.1.11

## 0.1.15

### Patch Changes

- Updated dependencies
  - @aphro/runtime-ts@0.1.10

## 0.1.14

### Patch Changes

- update dependency on strut/utils, enable manual methods for models
- Updated dependencies
  - @aphro/runtime-ts@0.1.9

## 0.1.13

### Patch Changes

- @aphro/runtime-ts@0.1.8

## 0.1.12

### Patch Changes

- allow ephemeral nodes. allow type expressions for fields.
- Updated dependencies
  - @aphro/runtime-ts@0.1.7

## 0.1.11

### Patch Changes

- in-memory model support
- Updated dependencies
  - @aphro/runtime-ts@0.1.6

## 0.1.8

### Patch Changes

- @aphro/runtime-ts@0.1.5

## 0.1.7

### Patch Changes

- @aphro/runtime-ts@0.1.4

## 0.1.6

### Patch Changes

- @aphro/runtime-ts@0.1.3

## 0.1.5

### Patch Changes

- update sqljs-connector to handle loading a sqlite db from storage

## 0.1.4

### Patch Changes

- add missing edges

## 0.1.3

### Patch Changes

- use build-stable type identifiers
  - @aphro/runtime-ts@0.1.2

## 0.1.2

### Patch Changes

- Cache de-dupes on type name rather than just id -- enables non globally unique ids
  - @aphro/runtime-ts@0.1.1

## 0.1.1

### Patch Changes

- Resolve some codegen bugs for junction edges discovered while building out the chinook data model

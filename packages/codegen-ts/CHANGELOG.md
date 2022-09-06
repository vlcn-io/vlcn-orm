# @aphro/codegen-ts

## 0.4.2

### Patch Changes

- Export queries and specs, move connectors to own packages, fix #43 and other bugs
- Updated dependencies
  - @aphro/codegen@0.2.8
  - @aphro/codegen-api@0.2.6
  - @aphro/schema@0.3.2
  - @aphro/schema-api@0.2.6

## 0.4.1

### Patch Changes

- transaction support
- Updated dependencies
  - @aphro/codegen@0.2.7
  - @aphro/codegen-api@0.2.5
  - @aphro/schema@0.3.1
  - @aphro/schema-api@0.2.5

## 0.4.0

### Minor Changes

- depend on `runtime-ts` to fix pkg mismatches, convenience mutations, named mutations replace unnmaed mutations
- depend on `runtime-ts` to prevent pkg version mismatch, convenience `mutatations` accessor

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @aphro/schema@0.3.0
  - @aphro/codegen@0.2.6

## 0.3.6

### Patch Changes

- Strict mode for typescript, useEffect vs useSyncExternalStore, useLiveResult hook
- Updated dependencies
  - @aphro/codegen@0.2.5
  - @aphro/codegen-api@0.2.4
  - @aphro/schema@0.2.5
  - @aphro/schema-api@0.2.4

## 0.3.5

### Patch Changes

- rebuild -- last publish had a clobbered version of pnpm
- Updated dependencies
  - @aphro/codegen@0.2.4
  - @aphro/codegen-api@0.2.3
  - @aphro/schema@0.2.4
  - @aphro/schema-api@0.2.3

## 0.3.4

### Patch Changes

- explicit type on `gen` due to prior change (#43)

## 0.3.3

### Patch Changes

- workaround to adhere to strict mode in generated code #43
- Updated dependencies
  - @aphro/codegen@0.2.3
  - @aphro/codegen-api@0.2.2
  - @aphro/schema@0.2.3
  - @aphro/schema-api@0.2.2

## 0.3.2

### Patch Changes

- generate bootstrapping utilities
- Updated dependencies
  - @aphro/codegen@0.2.2
  - @aphro/codegen-api@0.2.1
  - @aphro/schema@0.2.2
  - @aphro/schema-api@0.2.1

## 0.3.1

### Patch Changes

- fixup bad spec imports when edges go to self
- Updated dependencies
  - @aphro/schema@0.2.1
  - @aphro/codegen@0.2.1

## 0.3.0

### Minor Changes

- Simplify manual files, change output dir for generated code, allow caching in live queries, simplify 1 to 1 edge fetches

### Patch Changes

- Updated dependencies
  - @aphro/codegen@0.2.0
  - @aphro/codegen-api@0.2.0
  - @aphro/schema@0.2.0
  - @aphro/schema-api@0.2.0

## 0.2.0

### Minor Changes

- simplify mutations, simplify hooks

## 0.1.9

### Patch Changes

- update dependency on strut/utils, enable manual methods for models
- Updated dependencies
  - @aphro/codegen@0.1.6
  - @aphro/codegen-api@0.1.4
  - @aphro/schema@0.1.5
  - @aphro/schema-api@0.1.4

## 0.1.8

### Patch Changes

- fix array of enumerations

## 0.1.7

### Patch Changes

- enable nested collections of nodes
- Updated dependencies
  - @aphro/schema@0.1.4
  - @aphro/schema-api@0.1.3
  - @aphro/codegen@0.1.5
  - @aphro/codegen-api@0.1.3

## 0.1.6

### Patch Changes

- allow ephemeral nodes. allow type expressions for fields.
- Updated dependencies
  - @aphro/codegen@0.1.4
  - @aphro/codegen-api@0.1.2
  - @aphro/schema@0.1.3
  - @aphro/schema-api@0.1.2

## 0.1.5

### Patch Changes

- in-memory model support
- Updated dependencies
  - @aphro/codegen@0.1.3
  - @aphro/codegen-api@0.1.1
  - @aphro/schema@0.1.2
  - @aphro/schema-api@0.1.1

## 0.1.4

### Patch Changes

- Updated dependencies
  - @aphro/codegen@0.1.2

## 0.1.3

### Patch Changes

- use build-stable type identifiers

## 0.1.2

### Patch Changes

- Cache de-dupes on type name rather than just id -- enables non globally unique ids

## 0.1.1

### Patch Changes

- Resolve some codegen bugs for junction edges discovered while building out the chinook data model
- Updated dependencies
  - @aphro/schema@0.1.1
  - @aphro/codegen@0.1.1

## 0.1.0

### Minor Changes

- Support for standalone / junction edges

### Patch Changes

- Updated dependencies
  - @aphro/codegen@0.1.0
  - @aphro/codegen-api@0.1.0
  - @aphro/schema@0.1.0
  - @aphro/schema-api@0.1.0

## 0.0.14

### Patch Changes

- count/orderBy/take implementation, support for NOT NULL, empty queries
- Updated dependencies
  - @aphro/codegen@0.0.13
  - @aphro/codegen-api@0.0.11
  - @aphro/schema@0.0.14
  - @aphro/schema-api@0.0.11

## 0.0.13

### Patch Changes

- Fix casing errors on filesystem
- Updated dependencies
  - @aphro/codegen@0.0.12
  - @aphro/codegen-api@0.0.10
  - @aphro/schema@0.0.13
  - @aphro/schema-api@0.0.10

## 0.0.12

### Patch Changes

- graphql support, 'create table if not exists' for easier bootstrapping, @databases connection support
- Updated dependencies
  - @strut/counter@0.0.9
  - @strut/utils@0.0.9
  - @aphro/codegen@0.0.11
  - @aphro/codegen-api@0.0.9
  - @aphro/schema@0.0.12
  - @aphro/schema-api@0.0.9

## 0.0.11

### Patch Changes

- full todomvc example, no partiall generated mutators, removal of knexjs
- Updated dependencies
  - @strut/counter@0.0.8
  - @strut/utils@0.0.8
  - @aphro/codegen@0.0.10
  - @aphro/codegen-api@0.0.8
  - @aphro/schema@0.0.11
  - @aphro/schema-api@0.0.8

## 0.0.10

### Patch Changes

- lazily reference destinations of edges (allows for circular edges)

## 0.0.9

### Patch Changes

- Better error reporting, .js extensions on all generated imports
- Updated dependencies
  - @aphro/schema@0.0.10
  - @aphro/codegen@0.0.9

## 0.0.8

### Patch Changes

- enable running in the browser, implement reactive queries
- Updated dependencies
  - @strut/counter@0.0.7
  - @strut/utils@0.0.7
  - @aphro/codegen@0.0.8
  - @aphro/codegen-api@0.0.7
  - @aphro/schema@0.0.9
  - @aphro/schema-api@0.0.7

## 0.0.7

### Patch Changes

- Simplify interactions with changesets, get basic hop queries working
- Updated dependencies
  - @strut/counter@0.0.6
  - @strut/utils@0.0.6
  - @aphro/codegen@0.0.7
  - @aphro/codegen-api@0.0.6
  - @aphro/schema@0.0.8
  - @aphro/schema-api@0.0.6

## 0.0.6

### Patch Changes

- Updated dependencies [8524412]
  - @aphro/schema@0.0.7
  - @aphro/codegen@0.0.6

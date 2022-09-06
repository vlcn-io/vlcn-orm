# @aphro/wa-sqlite-connector

## 0.3.3

### Patch Changes

- Export queries and specs, move connectors to own packages, fix #43 and other bugs
- Updated dependencies
  - @aphro/instrument@0.0.6
  - @aphro/runtime-ts@0.3.8

## 0.3.2

### Patch Changes

- fix imports to appease webpack

## 0.3.1

### Patch Changes

- transaction support
- Updated dependencies
  - @aphro/instrument@0.0.5
  - @aphro/runtime-ts@0.3.7

## 0.3.0

### Minor Changes

- depend on `runtime-ts` to fix pkg mismatches, convenience mutations, named mutations replace unnmaed mutations
- depend on `runtime-ts` to prevent pkg version mismatch, convenience `mutatations` accessor

### Patch Changes

- @aphro/runtime-ts@0.3.6

## 0.2.4

### Patch Changes

- Strict mode for typescript, useEffect vs useSyncExternalStore, useLiveResult hook
- Updated dependencies
  - @aphro/context-runtime-ts@0.3.4
  - @aphro/instrument@0.0.4
  - @aphro/sql-ts@0.2.4

## 0.2.3

### Patch Changes

- rebuild -- last publish had a clobbered version of pnpm
- Updated dependencies
  - @aphro/context-runtime-ts@0.3.3
  - @aphro/instrument@0.0.3
  - @aphro/sql-ts@0.2.3

## 0.2.2

### Patch Changes

- workaround to adhere to strict mode in generated code #43
- Updated dependencies
  - @aphro/context-runtime-ts@0.3.2
  - @aphro/instrument@0.0.2
  - @aphro/sql-ts@0.2.2

## 0.2.1

### Patch Changes

- generate bootstrapping utilities
- Updated dependencies
  - @aphro/context-runtime-ts@0.3.1
  - @aphro/sql-ts@0.2.1

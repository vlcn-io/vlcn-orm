# acid-memory : value

This package is the core building block of ACID Memory. All instances of "Value" are transaction aware an uphold ACI~~d~~ properties.

In that:

- **A** - all `Values` changed within a transaction are committed **A**tomically
- **C** - values are only updated if those updates leave all values in a valid (**C**onsistent) state.
- **I** - concurrent transactions are **I**solated. I.e., one transaction is not impacted by the updates of another transaction that is executing in parallel. Thus each transaction is alway operating on a consistent set of data.
- **D** - given this is in-memory, durability is a non-goal.

# Implementation

Atomicity, consistency and isolation are implemented in a similar manner to a [WAL](https://www.sqlite.org/wal.html).

When a value is modified by a transaction that modification is stored within the transaction object rather than in the value itself. This allows for isolation (other transactions don't see the changes), a gathering of pending changes for atomicity, and consistency by allowing a transaction to fail without having altered db state.

When a transaction reads a value it first checks to see if the value exists in the current transaction's data store. If not, it reads from the value itself. This latter part has some special cases.

Another transaction could have been committed and thus updated the core value (committing always checkpoints the "wal" if you're keeping with that analogy). A transaction should not see changes that were committed while it was running. To prevent this from happening, a transaction records what "version" system memory was at when the transaction started. When reading from a value the transaction will only read values from a version less than or equal to the version of memory when the transaction started. Writing to a value will save the old version of the value into a history buffer if there are pending transactions in flight. If no pending transactions are in flight the history buffer(s) are dropped.

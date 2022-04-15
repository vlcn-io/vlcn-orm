/**
 * Will listen for log change events.
 * Based on the received changeset, pull its spec
 * From the spec, find the persistence engine
 * Then persist.
 *
 * Now... will model always exist in changeset? Should it?
 */
/**
 *
export class Persistor {
  constructor(private storage: Storage, private log: TransactionLog) {
    this.log.observe(this._onLogChange);
  }

  _onLogChange = (changes: MergedChangesets) => {
    const ops: any[] = [];
    for (let [model, diff] of changes) {
      if (!(model instanceof PersistedModel)) {
        continue;
      }

      const table = model.schemaName + "s";
      if (diff === undefined) {
        ops.push(this.storage[table].delete(model.id));
      } else {
        ops.push(this.storage[table].put(model.toStorage()));
      }
    }
    if (ops.length === 0) {
      return;
    }
    Promise.all(ops).then(
      (value) => {}, //console.log(value),
      (err) => console.error(err)
    );
  };
}

const def = {
  registerType(registry: TypeRegistry) {
    registry.persistor = (storage: Storage, log: TransactionLog) =>
      new Persistor(storage, log);
  },
};

export default def;

 */
//# sourceMappingURL=Persistor.js.map
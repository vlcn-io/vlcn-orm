import { inflight } from "./transaction.js";
export class History {
    // most recent things are at the end
    nodes = [];
    at(memVers) {
        for (let i = this.nodes.length - 1; i > -1; --i) {
            const node = this.nodes[i];
            if (node.memVers <= memVers) {
                return node.data;
            }
        }
        throw new Error("Could not find any data for version " + memVers);
    }
    maybeAdd(data, memoryVersion) {
        if (inflight.length === 0) {
            this.drop();
            // if no tx is in flight we have no need to record history of values.
            // history of values is only retained for tx isolation.
            return;
        }
        this.nodes.push({
            memVers: memoryVersion,
            data,
        });
    }
    drop() {
        if (this.nodes.length > 0) {
            this.nodes = [];
        }
    }
}
//# sourceMappingURL=History.js.map
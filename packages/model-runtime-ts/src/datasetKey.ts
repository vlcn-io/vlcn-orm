import { JunctionEdgeSpec, NodeSpec } from '@aphro/schema-api';

export type DatasetKey = string;

export default function specToDatasetKey(spec: NodeSpec | JunctionEdgeSpec): DatasetKey {
  return spec.storage.engine + '-' + spec.storage.db + '-' + spec.storage.tablish;
}

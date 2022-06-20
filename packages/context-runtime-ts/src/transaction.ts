import { SID_of } from '@strut/sid';
import HeteroModelMap from './HeteroModelMap.js';
import { Changeset } from './changeset.js';
import { INode } from './INode.js';

export type Transaction = {
  readonly changes: Map<SID_of<INode>, Changeset<INode>>;
  readonly nodes: HeteroModelMap;
  readonly persistHandle: Promise<any>;
  // readonly options: CommitOptions;
};

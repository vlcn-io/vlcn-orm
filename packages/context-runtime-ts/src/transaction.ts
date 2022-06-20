import { SID_of } from '@strut/sid';
import HeteroModelMap from './HeteroModelMap.js';
import { Changeset } from './changeset.js';
import { IModel } from './INode.js';

export type Transaction = {
  readonly changes: Map<SID_of<IModel>, Changeset<IModel>>;
  readonly nodes: HeteroModelMap;
  readonly persistHandle: Promise<any>;
  // readonly options: CommitOptions;
};

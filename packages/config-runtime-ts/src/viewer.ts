import { SID_of } from '@strut/sid';

export type Viewer = {
  readonly id: SID_of<Viewer>;
};

export function viewer(id: SID_of<Viewer>) {
  return {
    id,
  };
}

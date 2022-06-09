import { SID_of } from '@strut/sid';

export type ViewerAuth = 'authenticated' | 'anonymous';

export type Viewer<T = unknown> =
  | {
      auth: 'authenticated';
      // TODO: we should probably not give out the viewer id. Doing so allows
      // devs to create security holes.
      readonly id: SID_of<T>;
      readonly key: string;
    }
  | {
      auth: 'anonymous';
      readonly key: string;
    };

// TODO: we should force proof of authentication so these can't be created arbitrarily
// by devs. for users that are not actually logged in. I.e., protecting devs from mistakes.
export function viewer<T>(id: SID_of<T>): Viewer {
  return {
    auth: 'authenticated',
    id,
    get key() {
      return 'authenticated' + '-' + id;
    },
  };
}

export function anonymous(): Viewer {
  return {
    auth: 'anonymous',
    get key() {
      return 'anonymous';
    },
  };
}

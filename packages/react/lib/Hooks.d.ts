import { IModel } from '@aphro/model-runtime-ts';
export declare function useSubscription<T extends IModel<any>>(m: T): T;
export declare function useQuery<T>(keys: (keyof T)[], m: IModel<T>): void;

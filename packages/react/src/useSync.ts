import { useEffect, useState } from 'react';

type Resolution<T> = {
  loading: boolean;
  error?: any;
  data?: T;
};

// TODO: update to use eager promises.
export default function useSyncify<T>(fn: () => Promise<T>, deps: any[] = []): Resolution<T> {
  const [resolution, setResolution] = useState<Resolution<T>>({
    loading: true,
  });
  useEffect(() => {
    fn()
      .then(r => {
        setResolution({
          loading: false,
          data: r,
        });
      })
      .catch(e => {
        setResolution({
          loading: false,
          error: e,
        });
      });
  }, []);
  return resolution;
}
